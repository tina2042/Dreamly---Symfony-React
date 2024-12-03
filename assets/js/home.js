import React from 'react';
import axios from 'axios';
import {createRoot} from 'react-dom/client';
import Message from "./Message";
import FriendSearch from "./FriendSearch";


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            emotion: 'HAPPY',
            privacy: 'PUBLIC', // Default value
            userDreams: {},
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
            didUserLikedThis:  {},
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

        const token = localStorage.getItem("jwt"); // Retrieve token from localStorage
        const email = localStorage.getItem("email"); // Retrieve email from localStorage

        if (!token || !email) {
            alert("Your session is expired");
            window.location.replace("127.0.0.1:8000/login");
            console.error("User not authenticated or email missing in localStorage");
            return;
        }

        axios
            .get(`/api/dreams?order%5Bdate%5D=desc&page=1&itemsPerPage=1&owner.email=${(email)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/ld+json",
                },
            })
            .then((response) => {
                const fetchData = response.data;
                let dreams = fetchData["hydra:member"];
                if (dreams.length === 0) {
                    console.log("No dreams found for the user");
                    this.setState({
                        isLoading: {...this.state.isLoading, dreams: false},
                    });
                    return;
                }

                dreams = dreams.map(dream => ({
                    ...dream,
                    likesAmount: dream.likes.length,
                    commentsAmount: dream.comments.length
                }));
                // Update state with fetched dreams
                this.setState({
                    userDreams: dreams,
                    isLoading: {...this.state.isLoading, dreams: false},
                });
                // Process likes from the returned dream data
                const didUserLikedThis = {}; // Initialize the object to store like data
                dreams.forEach((dream) => {
                    const dreamId = dream["@id"].split("/").pop(); // Extract dream ID

                    dream.likes.forEach((like) => {
                        const ownerEmail = like.owner.email;
                        const likeId = like["@id"].split("/").pop();

                        if (ownerEmail === email) {
                            // Mark the dream as liked by the current user
                            didUserLikedThis[dreamId] = {
                                liked: true,
                                likeId: likeId,
                            };
                        }
                    });
                });

                // Update state with likes data
                this.setState({didUserLikedThis});
            })
            .catch((error) => {
                console.error("Error fetching user dreams:", error);
            }
            );

        axios
            .get(`/api/friends?page=1%itemsPerPage=30&user_1.email=${(email)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/ld+json'
                },
            })
            .then((response)=>{
                const fetchData = response.data;
                const friends = fetchData['hydra:member'];
                const friendEmails = friends.map(friend => friend.user_2.email);
                if(friendEmails.length>0) {
                    axios.get('/api/dreams', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/ld+json'
                        },
                        params: {
                            'owner.email[]': friendEmails,
                            'privacy.privacy_name[]': ['PUBLIC', 'FOR FRIENDS']
                        }
                    })
                        .then((dreamResponse) => {
                            let friendsDreams = dreamResponse.data['hydra:member'];

                            friendsDreams = friendsDreams.map(dream => ({
                                ...dream,
                                likesAmount: dream.likes.length,
                                commentsAmount: dream.comments.length
                            }));

                            this.setState({
                                userFriendDreams: friendsDreams,
                                isLoading: {
                                    ...this.state.isLoading,
                                    friendsDreams: false
                                }
                            });

                            // Process likes from the returned dream data
                            const updatedDidUserLikedThis = {...this.state.didUserLikedThis};  // Initialize the object to store like data
                            friendsDreams.forEach((dream) => {
                                const dreamId = dream["@id"].split("/").pop(); // Extract dream ID
                                dream.likes.forEach((like) => {
                                    const ownerEmail = like.owner.email;
                                    const likeId = like["@id"].split("/").pop();

                                    if (ownerEmail === email) {
                                        // Mark the dream as liked by the current user
                                        updatedDidUserLikedThis[dreamId] = {
                                            liked: true,
                                            likeId: likeId,
                                        };
                                    }
                                });
                            });

                            // Update state with the merged likes data
                            this.setState({didUserLikedThis: updatedDidUserLikedThis});
                        })
                        .catch((error) => {
                                console.error("Error fetching friends dreams:", error);
                            }
                        );
                } else {
                    this.setState({
                        isLoading: {
                            ...this.state.isLoading,
                            friendsDreams: false
                        }
                    });
                }
            }).catch((error) => {
                console.error("Error fetching friends:", error);
            }
        );

    }

    handleLikeAdd = async (dreamId, isMyDream) => {

        const token = localStorage.getItem('jwt');
        let liked = false;
        if(Object.keys(this.state.didUserLikedThis).includes(dreamId)){
            liked = this.state.didUserLikedThis[dreamId].liked; // Check if the dream is liked
        }
        if (liked) {
            await this.handleUnlike(dreamId, isMyDream);
        } else {
            alert("Adding like...");
            try {
                console.log(dreamId);
                const response = await axios.post('/api/add_like', { dreamId }, {
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
                            [dreamId]: {
                                liked: true,
                                likeId: likeId
                            }
                        }
                    }));
                    if(isMyDream){
                        this.setState(prevState =>({
                            userDreams:{
                                ...this.state.userDreams, likesAmount: this.state.userDreams.likesAmount+1
                            }
                        }))
                    } else {
                        this.setState(prevState =>({
                            userFriendDreams: prevState.userFriendDreams.map(dream=>
                            dream["@id"].split("/").pop() === dreamId
                                ? { ...dream, likesAmount: dream.likesAmount+1}
                                :dream
                            )
                        }))
                    }
                }
            }catch (error) {
                console.error('Error adding like:', error);
            }
        }
    }

    handleUnlike = async (dreamId, isMyDream) => {
        const token = localStorage.getItem('jwt');
        const likeId = this.state.didUserLikedThis[dreamId]?.likeId;
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
                if (!didUserLikedThis[dreamId]) {
                    didUserLikedThis[dreamId] = {};
                }

                didUserLikedThis[dreamId].liked = false; // Set false for unliked dreams
                didUserLikedThis[dreamId].likeId = null;
                this.setState({ didUserLikedThis }); // Update the state with the new object
                if(isMyDream){
                    this.setState(prevState =>({
                        userDreams:{
                            ...this.state.userDreams, likesAmount: this.state.userDreams.likesAmount-1
                        }
                    }))
                } else {
                    this.setState(prevState =>({
                        userFriendDreams: prevState.userFriendDreams.map(dream=>
                            dream["@id"].split("/").pop() === dreamId
                                ? { ...dream, likesAmount: dream.likesAmount-1}
                                :dream
                        )
                    }))
                }
            }
        } catch (error) {
            console.error('Error removing like:', error);
        }

    }

    render() {
        const { userDreams, userFriendDreams, tags, inputTag, maxCharactersLengthTag, maxLengthTags, errors } = this.state;
        const UserDreamItem = ({dream}) => {
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            };
            const formattedDate = new Date(dream.date).toLocaleDateString(undefined, options);
            const { didUserLikedThis } = this.state;
            let liked = false;
            const dreamId=dream["@id"].split("/").pop();
            if(Object.keys(didUserLikedThis).includes(dreamId)){
                liked = didUserLikedThis[dreamId].liked; // Check if the dream is liked
            }


            return (
                <div data-id={dreamId}>
                    <div className="my-dream-top">
                        <h3 className="block-name">My last dream</h3>
                        <button type="button" className="dream-list-btn" onClick={() => {
                            window.location.href = '/dreams_list'
                        }}>View all my dreams
                        </button>
                    </div>
                    <div className="my-dream">
                        <div className="top" onClick={() => {
                            window.location.href = `/dreams/${dreamId}`
                        }}>
                            <h4>{dream.title}</h4>
                            <data>{formattedDate}</data>
                        </div>

                        <section className="wrapper">
                            {dream.tags && dream.tags.length > 0 && (

                                <div className="tags">
                                    {dream.tags.map(tag => (
                                        <span key={'dream-tag-' + tag.name} className="tag">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="emotion">
                                { dream.emotion.emotion_name === 'HAPPY' && (
                                    <label  className="emoji">😊</label>
                                )}
                                { dream.emotion.emotion_name === 'NEUTRAL' && (
                                    <label  className="emoji">😐</label>
                                )}
                                { dream.emotion.emotion_name === 'SAD' && (
                                    <label className="emoji">😢</label>
                                )}
                            </div>
                        </section>
                        <p>{dream.dream_content}</p>
                        <div className="social-icons">
                            <div className="likes" onClick={() =>  handleLikeAdd(dreamId, likesAmount)}>
                                <i className={`fa-solid fa-heart fa-xl ${liked ? 'liked' : 'unliked-my'}`}></i>
                                <p className="like-amount">{dream.likesAmount}</p>
                            </div>
                            <div className="comment_icon"
                                 onClick={() => {
                                     if (this.state.isAddingComment === dreamId) this.setState({isAddingComment: null})
                                     else this.setState({isAddingComment: dreamId})
                                 }
                                 }
                            >
                                <i className="fa-solid fa-comment fa-xl"></i>
                                <p>{dream.commentsAmount}</p>
                            </div>
                        </div>
                        {
                            this.state.isAddingComment === dreamId &&
                            <div className="comments">

                                <div className="comments-list">
                                    {dream.comments.map(comment => (
                                        <div className="single-comment" key={comment["@id"].split("/").pop()}>
                                            <p className="single-comment-date">
                                                {new Date(comment.comment_date).toLocaleDateString()}
                                            </p>
                                            <p className="single-comment-content">{comment.comment_content}</p>
                                        </div>
                                    ))
                                    }
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
                                            dream_id: dreamId,
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
                                            userDreams.commentsAmount = latestDream.commentsAmount + 1;
                                            this.setState({userDreams: userDreams});

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
            );
        };
        const FriendDreamItem = ({dream}) => {
            const didUserLikedThis = this.state.didUserLikedThis;
            let liked = false;
            const dreamId = dream["@id"].split("/").pop();
            if (Object.keys(didUserLikedThis).includes(dreamId)) {
                liked = didUserLikedThis[dreamId].liked; // Check if the dream is liked
            }
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            };

            const formattedDate = new Date(dream.date).toLocaleDateString(undefined, options);
            return (
                <div key={dreamId} className="friend-dream" data-id={dreamId}>
                    <div className="top">
                        <img alt="dream"
                             src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"/>
                        <p>{dream.owner.detail.name} {dream.owner.detail.surname}</p>
                        <h4>{dream.title}</h4>
                        <data>{formattedDate}</data>
                    </div>
                    <section className="wrapper">
                        {dream.tags && dream.tags.length > 0 && (

                            <div className="tags">
                                {dream.tags.map(tag => (
                                    <span key={'dream-tag-' + tag.name} className="tag">
                                            {tag.name}
                                        </span>
                                ))}
                            </div>
                        )}
                        <div className="emotion">
                            {dream.emotion.emotion_name === 'HAPPY' && (
                                <label className="emoji">😊</label>
                            )}
                            {dream.emotion.emotion_name === 'NEUTRAL' && (
                                <label className="emoji">😐</label>
                            )}
                            {dream.emotion.emotion_name === 'SAD' && (
                                <label className="emoji">😢</label>
                            )}
                        </div>
                    </section>
                    <div className="bottom">

                        <p>{dream.dream_content}</p>
                        <div className="social-icons">
                            <div className="likes" onClick={() => this.handleLikeAdd(dreamId, false)}>
                                <i className={`fa-solid fa-heart fa-xl ${liked ? 'liked' : ''}`}></i> {/* Add 'liked' class if liked */}
                                <p className="like-amount">{dream.likesAmount}</p>
                            </div>
                            <div className="comment_icon"
                                 onClick={() => {
                                     if (this.state.isAddingComment === dreamId) this.setState({isAddingComment: null})
                                     else this.setState({isAddingComment: dreamId})
                                 }
                                 }
                            >
                                <i className="fa-solid fa-comment fa-xl"></i>
                                <p>{dream.commentsAmount}</p>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.isAddingComment === dreamId &&
                        <div className="comments">
                            <div className="comments-list">
                                {dream.comments.map(comment => (
                                    <div className="single-comment" key={comment["@id"].split("/").pop()}>
                                        <p className="single-comment-date">
                                            {new Date(comment.comment_date).toLocaleDateString()}
                                        </p>
                                        <p className="single-comment-content">{comment.comment_content}</p>
                                    </div>
                                ))
                                }
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
                                        dream_id: dreamId,
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
                                        const commentedDream = userFriendsDreams.find(dream => dream.id === dreamId);
                                        const likedDreamId = userFriendsDreams.findIndex(dream => dream.id === dreamId);
                                        commentedDream.commentsAmount = commentedDream.commentsAmount + 1;
                                        userFriendsDreams[likedDreamId] = commentedDream;
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
        const AddDreamForm = () => (
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
                                    <option value="FOR FRIENDS">For friends</option>
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
        );

        let latestDream = null;
        if (userDreams.length > 0) {
            latestDream = userDreams[userDreams.length - 1];
        }

        return (
            <div>
                <AddDreamForm />
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
                            <Message message="Loading your dreams..." isLoading={this.state.isLoading.dreams} divName="my-dream"/>
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
                                <Message message="No dreams added" isLoading={this.state.isLoading.dreams} divName="my-dream"/>
                            </div>
                        </div>
                    )
                )}

                <div className="friend-find">
                    <h3 className="block-name">Friends dreams</h3>
                    <div className="wrap">
                        <FriendSearch />
                    </div>
                </div>
                {this.state.isLoading.friendsDreams ? (
                    <div className="friend-dream">
                        <Message message="Loading friends' dreams..." isLoading={true} />
                    </div>
                ) : userFriendDreams.length > 0 ? (
                    userFriendDreams.map(dream => (
                        <FriendDreamItem key={dream.id} dream={dream} />
                    ))
                ) : (
                    <div className="friend-dream">
                        <Message message="Add more friends to see their dreams" isLoading={false} />
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