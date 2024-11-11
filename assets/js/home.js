import React from 'react';
import axios from 'axios';
import {createRoot} from 'react-dom/client';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            emotion: 'HAPPY',
            privacy: 'PUBLIC', // Default value
            userDreams: [],
            userFriendDreams: [],
            isLoading: {
                dreams: true,
                friendsDreams: true,
                userLikes: true
            },
            searchQuery: '',
            searchResults: [],
            isSearching: false,
            isFocused: false, // New state for tracking focus
            userLikes: [], // New state for user likes,
            didUserLikedThis:  {},
            dreamsComments: [],
            isAddingComment: null,
            tags: ["sen" ],
            inputTag: "",
            maxCharactersLengthTag: 20,
            maxLengthTags: 10,
            errors: {
                length: false,
                lengthTags: false,
                validChar: false,
                already: false,
                startChar: false
            }
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleTagChange = (e) => {
        let value = e.target.value;
        if (value.includes(' ') || value.includes(',')) {
            value = value.trim().replace(/,$/, '').toLowerCase();

            if (value.length > 0) {
                this.addTag(value);
            }

            this.setState({ inputTag: '' });
        } else {
            this.setState({
                inputTag: value.slice(0, this.state.maxCharactersLengthTag)
            });
        }
    };

    addTag = (tag) => {
        const { tags, maxCharactersLengthTag, maxLengthTags } = this.state;
        const patternTag = /^[A-Za-z0-9ء-ي_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/g;
        let errors = {};

        if (tag.length > maxCharactersLengthTag) {
            errors.length = true;
        } else if (/^_/.test(tag)) {
            errors.startChar = true;
        } else if (tags.length === maxLengthTags) {
            errors.lengthTags = true;
        } else if (!patternTag.test(tag)) {
            errors.validChar = true;
        } else if (tags.includes(tag)) {
            errors.already = true;
        } else {
            this.setState({
                tags: [...tags, tag],
                errors: {}
            });
        }


        this.setState({ errors });
    };

    removeTag = (tagToRemove) => {
        this.setState({
            tags: this.state.tags.filter(tag => tag !== tagToRemove)
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const {title, content, emotion, privacy, tags} = this.state;
        const token = localStorage.getItem('jwt');
        axios.post('/api/add_dream', {
            title,
            content,
            emotion,
            privacy,
            tags
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                alert('Dream has been added');
                this.setState({
                    title: '',
                    content: '',
                    emotion: 'HAPPY',
                    privacy: 'PUBLIC',
                    tags: ['sen']
                });
            })
            .catch(error => {
                console.error('Error adding dream:', error);
            });
    }

    async componentDidMount() {
        const token = localStorage.getItem('jwt');

        await axios.get('/api/dreams', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/ld+json'
            }
        })
            .then(response => {
                const fetchData = response.data;

                this.setState({userDreams: fetchData, isLoading: {...this.state.isLoading, dreams: false}});
            })
            .catch(error => {
                console.error('Error fetching user dreams:', error);
            });
        await axios.get('/api/user_likes', {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/ld+json'
            }
        }).then(response => {
            const fetchData = response.data;
            this.setState({userLikes: fetchData, isLoading: {...this.state.isLoading, userLikes: false}});

            // Process userLikes to create likes object
            const didUserLikedThis = { ...this.state.didUserLikedThis }; // Create a copy of the current state
            fetchData['hydra:member'].forEach(like => {
                const dreamId = like.dream.split('/').pop(); // Extract the ID from the dream URL
                const userId = like.owner.split('/').pop();
                const likeId = like['@id'].split('/').pop();

                if (Number(userId) === Number(this.state.userDreams[0].ownerId)) {
                    // Initialize didUserLikedThis[dreamId] as an object if it's not already
                    if (!didUserLikedThis[dreamId]) {
                        didUserLikedThis[dreamId] = {};
                    }

                    didUserLikedThis[dreamId].liked = true; // Set true for liked dreams
                    didUserLikedThis[dreamId].likeId = likeId;
                }
            });

            this.setState({ didUserLikedThis: didUserLikedThis }); // Update the state with the new object



        }).catch(error => {
            console.error('Error fetching user likes:', error);
        });

        await axios.get('/api/friends/dreams', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/ld+json'
            }
        })
            .then(response => {
                const fetchData = response.data;

                this.setState({userFriendDreams: fetchData, isLoading: {...this.state.isLoading, friendsDreams: false}});
            })
            .catch(error => {
                console.error('Error fetching user friends:', error);
            });
        await axios.get('/api/comments', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/ld+json'
            }
        })
            .then(response => {
                const fetchData = response.data;
                const comments = fetchData['hydra:member'].map(comment=>{
                    return {
                        ...comment,
                        dreamId: +comment.dream.split('/').pop(),
                    };
                });

                this.setState({dreamsComments: comments});
            })
            .catch(error => {
                console.error('Error fetching dreams comments:', error);
            });

    }

    handleSearchChange = (e) => {
        this.setState({searchQuery: e.target.value}, () => {
            if (this.state.searchQuery.length >= 3) {
                this.searchFriends();
            } else {
                this.setState({searchResults: [], isSearching: false});
            }
        });
    }

    handleLikeAdd = async (dream_id, isMyDream) => {

        const token = localStorage.getItem('jwt');
        let liked = false;
        if(Object.keys(this.state.didUserLikedThis).includes(dream_id.toString())){
            liked = this.state.didUserLikedThis[dream_id.toString()].liked; // Check if the dream is liked
        }
        if (liked) {
            await this.handleUnlike(dream_id, isMyDream);
        } else {
            alert("Adding like...");
            try {
                const response = await axios.post('/api/add_like', { dream_id }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/ld+json'
                    }
                });
                if (response.status === 200) {

                    const likeId = response.data.likeId;
                    console.log("Like added");
                    // Update the local state to reflect the newly added like
                    this.setState(prevState => ({
                        didUserLikedThis: {
                            ...prevState.didUserLikedThis,
                            [dream_id]: {
                                liked: true,
                                likeId: likeId
                            }
                        }
                    }));
                    if (isMyDream) {
                        let userDreams = [...this.state.userDreams];
                        let latestDream = null;
                        if (userDreams.length > 0) {
                            latestDream = userDreams[userDreams.length - 1];
                            latestDream.likes = latestDream.likes + 1;
                            userDreams[userDreams.length - 1] = latestDream;
                            this.setState({userDreams: userDreams});
                        }
                    } else {
                        let userFriendsDreams = this.state.userFriendDreams;
                        const likedDream = userFriendsDreams.find(dream => dream.id === dream_id);
                        const likedDreamId = userFriendsDreams.findIndex(dream => dream.id === dream_id);
                        likedDream.likes = likedDream.likes + 1;
                        userFriendsDreams[likedDreamId] = likedDream;
                        this.setState({userFriendsDreams:userFriendsDreams});
                    }
                }
            } catch (error) {
                console.error('Error adding like:', error);
            }
        }
    }

    handleUnlike = async (dream_id, isMyDream) => {
        const token = localStorage.getItem('jwt');
        const likeId = this.state.didUserLikedThis[dream_id]?.likeId;
        alert("Removing your like...");
        try {
            const response = await axios.delete(`/api/user_likes/${likeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/ld+json'
                }
            });
            if (response.status === 204) {
                console.log("Like removed");
                // Update the local state to reflect the removed like
                const didUserLikedThis = { ...this.state.didUserLikedThis }; // Create a copy of the current state
                if (!didUserLikedThis[dream_id]) {
                    didUserLikedThis[dream_id] = {};
                }

                didUserLikedThis[dream_id].liked = false; // Set false for unliked dreams
                didUserLikedThis[dream_id].likeId = null;
                this.setState({ didUserLikedThis }); // Update the state with the new object
                if (isMyDream) {
                    let userDreams = [...this.state.userDreams];
                    let latestDream = null;
                    if (userDreams.length > 0) {
                        latestDream = userDreams[userDreams.length - 1];
                        latestDream.likes = latestDream.likes - 1;
                        userDreams[userDreams.length - 1] = latestDream;
                        this.setState({userDreams: userDreams});
                    }
                } else {
                    let userFriendsDreams = this.state.userFriendDreams;
                    const likedDream = userFriendsDreams.find(dream => dream.id === dream_id);
                    const likedDreamId = userFriendsDreams.findIndex(dream => dream.id === dream_id);
                    likedDream.likes = likedDream.likes - 1;
                    userFriendsDreams[likedDreamId] = likedDream;
                    this.setState({userFriendsDreams:userFriendsDreams});
                }
            }
        } catch (error) {
            console.error('Error removing like:', error);
        }

    }

    searchFriends = async () => {
        const { searchQuery } = this.state;
        this.setState({ isSearching: true });

        const token = localStorage.getItem('jwt');

        try {
            const response = await axios.post('/api/search', { query: searchQuery }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/ld+json'
                }
            });
            this.setState({ searchResults: response.data, isSearching: false });

        } catch (error) {
            console.error('Error searching friends:', error);
            this.setState({ isSearching: false });
        }
    }

    addFriend = async (user_id) => {
        const token = localStorage.getItem('jwt');
        if(confirm("Are you sure you want to add this friend?")){
            console.log("Trying to add friend");
            try {
                const response = await axios.post('/api/friends/add', { user_id }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/ld+json'
                    }
                });
                if (response.status === 200) {
                    alert("Friend added");
                    this.setState({ searchQuery: '', searchResults: [] });
                }
            } catch (error) {
                console.error('Error adding friend:', error);
            }
        }
    }

    render() {
        const { userDreams, userFriendDreams, searchResults, searchQuery, isSearching, tags, inputTag, maxCharactersLengthTag, maxLengthTags, errors } = this.state;
        const UserDreamItem = ({dream}) => {
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            };
            const formattedDate = new Date(dream.date).toLocaleDateString(undefined, options);
            const { didUserLikedThis } = this.state;
            let liked = false;
            if(Object.keys(didUserLikedThis).includes(dream.id.toString())){
                liked = didUserLikedThis[dream.id.toString()].liked; // Check if the dream is liked
            }
            return (
                <div data-id={dream.id}>
                    <div className="my-dream-top">
                        <h3 className="block-name">My last dream</h3>
                        <button type="button" className="dream-list-btn" onClick={() => {
                            window.location.href = '/dreams_list'
                        }}>View all my dreams
                        </button>
                    </div>
                    <div className="my-dream">
                        <div className="top" onClick={() => {
                            window.location.href = `/dreams/${dream.id}`
                        }}>
                            <h4>{dream.title}</h4>
                            <data>{formattedDate}</data>
                        </div>

                        <section className="wrapper">
                            {dream.tags && dream.tags.length > 0 && (

                                <div className="tags">
                                    {dream.tags.map(tag => (
                                        <span key={'dream-tag-' + tag} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                )}
                            <div className="emotion">
                                { dream.emotion === 'HAPPY' && (
                                    <label  className="emoji">😊</label>
                                )}
                                { dream.emotion === 'NEUTRAL' && (
                                    <label  className="emoji">😐</label>
                                )}
                                { dream.emotion === 'SAD' && (
                                    <label className="emoji">😢</label>
                                )}
                            </div>
                        </section>
                            <p>{dream.content}</p>
                            <div className="social-icons">
                                <div className="likes" onClick={() => this.handleLikeAdd(dream.id, true)}>
                                    <i className={`fa-solid fa-heart fa-xl ${liked ? 'liked' : 'unliked-my'}`}></i>
                                    <p className="like-amount">{dream.likes}</p>
                                </div>
                                <div className="comment_icon"
                                     onClick={() => {
                                         if (this.state.isAddingComment === dream.id) this.setState({isAddingComment: null})
                                         else this.setState({isAddingComment: dream.id})
                                     }
                                     }
                                >
                                    <i className="fa-solid fa-comment fa-xl"></i>
                                    <p>{dream.commentsAmount}</p>
                                </div>
                            </div>
                            {
                                this.state.isAddingComment === dream.id &&
                                <div className="comments">
                                    <div className="comments-list">
                                        {this.state.dreamsComments.filter(comment => {
                                            return dream.id === comment.dreamId;
                                        }).map(comment =>
                                            <div className="single-comment" key={comment.id}>
                                                <p className="single-comment-date">
                                                    {(new Date(comment.comment_date)).toLocaleDateString()}
                                                </p>
                                                <p className="single-comment-content">{comment.comment_content}</p>
                                            </div>
                                        )}
                                    </div>
                                    <form onSubmit={e => {
                                        e.preventDefault();
                                        const data = new FormData(e.target);
                                        const token = localStorage.getItem('jwt');
                                        if (data.get('comment').length < 5) {

                                            alert("Comment must be at least 5 characters long");
                                            return;
                                        }
                                        axios.post('/api/add_comment', {
                                                comment: data.get('comment'),
                                                dream_id: dream.id,
                                            },
                                            {
                                                headers: {
                                                    'Authorization': `Bearer ${token}`,
                                                    'Content-Type': 'application/ld+json'
                                                },
                                            })
                                            .then(response => {
                                                axios.get('/api/comments', {
                                                    headers: {
                                                        'Authorization': `Bearer ${token}`,
                                                        'Content-Type': 'application/ld+json'
                                                    }
                                                })
                                                    .then(response => {
                                                        const fetchData = response.data;
                                                        const comments = fetchData['hydra:member'].map(comment => {
                                                            return {
                                                                ...comment,
                                                                dreamId: +comment.dream.split('/').pop(),
                                                            };
                                                        });

                                                        this.setState({dreamsComments: comments});
                                                    })
                                                    .catch(error => {
                                                        console.error('Error fetching dreams comments:', error);
                                                    });

                                                let userDreams = [...this.state.userDreams];
                                                let latestDream = null;
                                                if (userDreams.length > 0) {
                                                    latestDream = userDreams[userDreams.length - 1];
                                                    latestDream.commentsAmount = latestDream.commentsAmount + 1;
                                                    userDreams[userDreams.length - 1] = latestDream;
                                                    this.setState({userDreams: userDreams});
                                                }
                                                e.target.reset();
                                            })
                                            .catch(error => {
                                                console.error(error);
                                            });
                                    }}>
                                        <div className="add-comment">
                                            <textarea name="comment" minLength={5}
                                                      placeholder="Add a comment..."></textarea>
                                            <button type="submit">Submit</button>
                                        </div>
                                    </form>
                                </div>
                            }
                    </div>
                </div>
            )
                ;
        };
        const Message = ({message}) => (
            <div className="top">
                <h4>{message}</h4>
            </div>
        );

        const FriendDreamItem = ({dream}) => {
            const didUserLikedThis = this.state.didUserLikedThis;
            let liked = false;
            if (Object.keys(didUserLikedThis).includes(dream.id.toString())) {
                liked = didUserLikedThis[dream.id.toString()].liked; // Check if the dream is liked
            }
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            };

            const formattedDate = new Date(dream.date).toLocaleDateString(undefined, options);
            return (
                <div key={dream.id} className="friend-dream" data-id={dream.id}>
                    <div className="top">
                        <img alt="dream"
                             src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"/>
                        <p>{dream.ownerName}</p>
                        <h4>{dream.title}</h4>
                        <data>{formattedDate}</data>
                    </div>
                    <section className="wrapper">
                        {dream.tags && dream.tags.length > 0 && (

                            <div className="tags">
                                {dream.tags.map(tag => (
                                    <span key={'dream-tag-' + tag} className="tag">
                                            {tag}
                                        </span>
                                ))}
                            </div>
                        )}
                        <div className="emotion">
                            {dream.emotion === 'HAPPY' && (
                                <label className="emoji">😊</label>
                            )}
                            {dream.emotion === 'NEUTRAL' && (
                                <label className="emoji">😐</label>
                            )}
                            {dream.emotion === 'SAD' && (
                                <label className="emoji">😢</label>
                            )}
                        </div>
                    </section>
                    <div className="bottom">

                        <p>{dream.content}</p>
                        <div className="social-icons">
                            <div className="likes" onClick={() => this.handleLikeAdd(dream.id, false)}>
                                <i className={`fa-solid fa-heart fa-xl ${liked ? 'liked' : ''}`}></i> {/* Add 'liked' class if liked */}
                                <p className="like-amount">{dream.likes}</p>
                            </div>
                            <div className="comment_icon"
                                 onClick={() => {
                                     if (this.state.isAddingComment === dream.id) this.setState({isAddingComment: null})
                                     else this.setState({isAddingComment: dream.id})
                                 }
                                 }
                            >
                                <i className="fa-solid fa-comment fa-xl"></i>
                                <p>{dream.commentsAmount}</p>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.isAddingComment === dream.id &&
                        <div className="comments">
                            <div className="comments-list">
                                {this.state.dreamsComments.filter(comment => {
                                    return dream.id === comment.dreamId;
                                }).map(comment =>
                                    <div className="single-comment" key={comment.id}>
                                        <p className="single-comment-date">
                                            {(new Date(comment.comment_date)).toLocaleDateString()}
                                        </p>
                                        <p className="single-comment-content">{comment.comment_content}</p>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={e => {
                                e.preventDefault();
                                const data = new FormData(e.target);
                                const token = localStorage.getItem('jwt');
                                if (data.get('comment').length < 5) {

                                    alert("Comment must be at least 5 characters long");
                                    return;
                                }
                                axios.post('/api/add_comment', {
                                        comment: data.get('comment'),
                                        dream_id: dream.id,
                                    },
                                    {
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'Content-Type': 'application/ld+json'
                                        },
                                    })
                                    .then(response => {
                                        e.target.reset();
                                        axios.get('/api/comments', {
                                            headers: {
                                                'Authorization': `Bearer ${token}`,
                                                'Content-Type': 'application/ld+json'
                                            }
                                        })
                                            .then(response => {
                                                const fetchData = response.data;
                                                const comments = fetchData['hydra:member'].map(comment => {
                                                    return {
                                                        ...comment,
                                                        dreamId: +comment.dream.split('/').pop(),
                                                    };
                                                });

                                                this.setState({dreamsComments: comments});
                                            })
                                            .catch(error => {
                                                console.error('Error fetching dreams comments:', error);
                                            });
                                        let userFriendsDreams = this.state.userFriendDreams;
                                        const likedDream = userFriendsDreams.find(dream => dream.id === dream.id);
                                        const likedDreamId = userFriendsDreams.findIndex(dream => dream.id === dream.id);
                                        likedDream.commentsAmount = likedDream.commentsAmount + 1;
                                        userFriendsDreams[likedDreamId] = likedDream;
                                        this.setState({userFriendsDreams: userFriendsDreams});
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            }}>
                                <div className="add-comment">
                                    <textarea name="comment" minLength={5} placeholder="Add a comment..."></textarea>
                                    <button type="submit">Submit</button>
                                </div>
                            </form>
                        </div>
                    }
                </div>
            );
        }

        const SearchResults = ({results, addFriend}) => {
            return (
                <ul id="search-results">
                    {this.state.isFocused && !this.state.isSearching && results.length === 0 ? (
                        <li>User not found</li>
                    ) : (

                        results.map(user => (
                            <li key={user.id} onClick={() => addFriend(user.id)}>
                                <div className="search-result-item">
                                    <img src={user.photo} alt={user.name}/>
                                    <span>{user.name} {user.surname}</span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            );
        }

        let latestDream = null;
        if (userDreams.length > 0) {
            latestDream = userDreams[userDreams.length - 1];
        }

        return (
            <div>
                <div className="add-dream-form">
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name="title" value={this.state.title} onChange={this.handleChange}
                               placeholder="Enter title"/>
                        <hr></hr>
                        <section className="wrappers">
                            <div className="tags">
                                <div className={`wrapper-tags ${inputTag ? 'focus' : ''}`}>
                                    <div className="view-tags">
                                        {tags.map((tag, index) => (
                                            <span key={index} className="tag" data-tag={tag}>
                                            {tag}
                                                <i
                                                    className="fa fa-close"
                                                    onClick={() => this.removeTag(tag)}
                                                ></i>
                                        </span>
                                        ))}
                                        <input
                                            type="text"
                                            className="input-tag"
                                            value={inputTag}
                                            onChange={this.handleTagChange}
                                            onKeyUp={(e) => e.key === 'Enter' && this.addTag(e)}
                                            placeholder="Add tag"
                                        />
                                    </div>
                                </div>

                                {this.state.errors.length &&
                                    <div className="show-error length">Tag must be between 1 and 20 characters.</div>}
                                {this.state.errors.lengthTags &&
                                    <div className="show-error lengthTags">You cannot add more than 10 tags.</div>}
                                {this.state.errors.validChar &&
                                    <div className="show-error validChar">Use only letters or numbers.</div>}
                                {this.state.errors.already && <div className="show-error already">This tag is already added.</div>}
                                {this.state.errors.startChar &&
                                    <div className="show-error startChar">Tag must start with a letter.</div>}

                                <div className="show-count-all">
                                    <div className="count-character-tag">
                                        <span>{maxCharactersLengthTag - inputTag.length}</span> characters left.
                                    </div>
                                    <div className="count-tags">
                                        <span>{maxLengthTags - tags.length}</span> tags left.
                                    </div>
                                </div>
                            </div>

                            <div className="emotion-picker">
                                <input type="radio" id="HAPPY" name="emotion" value="HAPPY"
                                       onChange={this.handleChange}/>
                                <label htmlFor="HAPPY" className="emoji">😊</label>
                                <input type="radio" id="NEUTRAL" name="emotion" value="NEUTRAL"
                                       onChange={this.handleChange}/>
                                <label htmlFor="NEUTRAL" className="emoji">😐</label>
                                <input type="radio" id="SAD" name="emotion" value="SAD"
                                       onChange={this.handleChange}/>
                                <label htmlFor="SAD" className="emoji">😢</label>
                            </div>

                        </section>
                        <hr></hr>
                        <textarea name="content" minLength={5} value={this.state.content} onChange={this.handleChange}
                                  placeholder="Write your dream here"></textarea>
                        <div id="buttons">

                            <div className="dropdown-list">
                                <label htmlFor="privacy">
                                    <select name="privacy" id="privacy" value={this.state.privacy}
                                            onChange={this.handleChange}>
                                        <option value="PUBLIC">Public</option>
                                        <option value="PRIVATE">Private</option>
                                    </select>
                                </label>
                            </div>
                            <button type="button" className="cancel-btn" onClick={() => {
                                window.location.href = '/home'
                            }}>Cancel
                            </button>
                            <button type="submit" className="submit">Add Dream</button>
                        </div>
                    </form>
                </div>
                {this.state.isLoading.dreams ? (
                    <div>
                        <div className="my-dream-top">
                            <h3 className="block-name">My last dream</h3>
                            <button type="button" className="dream-list-btn" onClick={() => {
                                window.location.href = '/dreams_list'
                            }}>View all my dreams
                            </button>
                        </div>
                        <div className="my-dream">
                            <Message message="Loading your dreams..." divName="my-dream"/>
                        </div>
                    </div>
                ) : (
                    latestDream != null ? (
                        <UserDreamItem dream={latestDream}/>
                    ) : (
                        <div>
                            <div className="my-dream-top">
                                <h3 className="block-name">My last dream</h3>
                                <button type="button" className="dream-list-btn" onClick={() => {
                                    window.location.href = '/dreams_list'
                                }}>View all my dreams
                                </button>
                            </div>
                            <div className="my-dream">
                                <Message message="No dreams added" divName="my-dream"/>
                            </div>
                        </div>
                    )
                )}

                <div className="friend-find">
                    <h3 className="block-name">Friends dreams</h3>
                    <div className="wrap">
                        <div className="search">
                            <div>
                                <input type="text" className="searchTerm" placeholder="Find more friends"
                                       value={searchQuery} onChange={this.handleSearchChange}
                                       onFocus={() => this.setState({isFocused: true})}
                                       onBlur={() => this.setState({isFocused: false})}/>
                                <button type="button" className="searchButton" onClick={() => this.searchFriends()}>
                                    <i className="fa fa-search search-icon"></i>
                                </button>
                            </div>
                            {isSearching && <p>Searching...</p>}
                            <SearchResults results={searchResults} addFriend={this.addFriend}/>
                        </div>
                    </div>
                </div>
                {userFriendDreams.length > 0 && !this.state.isLoading.friendsDreams ? (
                    userFriendDreams.map(dream => (
                        <FriendDreamItem key={dream.id} dream={dream}/>
                    ))
                ) : (
                    <div className="friend-dream">
                        <Message message="Add more friends to see their dreams"/>
                    </div>
                )}

                <button className="floating-button" onClick={() => {
                    window.location.href = '/add_dream'
                }}>Add dream</button>
            </div>
        );
    }
}
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Home />);