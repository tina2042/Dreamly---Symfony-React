import React from 'react';
import axios from 'axios';
import {createRoot} from 'react-dom/client';
import Message from "./Message";
import FriendSearch from "./FriendSearch";
import Add_dream from "./add_dream";
import SocialIcons from "./SocialIcons";
import LoadMore from "./LoadMore";
class Home extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            userDream: null,
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
            friendsEmails:[],
            hasMore:true
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
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
            .get(`/api/dreams`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/ld+json",
                }, params:{
                    'order': {
                        'date': 'desc',
                        'id': 'desc'
                    },
                    'page': 1,
                    'itemsPerPage':1,
                    'owner.email': email
                    }
            })
            .then((response) => {
                const fetchData = response.data;
                let dreams = fetchData["hydra:member"];
                if (dreams.length === 0) {

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
                let latestDream = null;
                if (dreams.length > 0) {
                    latestDream = dreams[dreams.length - 1];
                }
                // Update state with fetched dreams
                this.setState({
                    userDream: latestDream,
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
                if(error.response.data.code===401){
                    window.location.replace("/logout");
                    console.error("User not authenticated or email missing in localStorage");
                    alert("Your session is expired");
                } else console.error(error)
                }
            );

        axios
            .get(`/api/friends`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/ld+json'
                }, params: {
                    'user_1.email[]': email,
                    'itemsPerPage': 30,
                    'page': 1,
                }
            })
            .then((response)=>{
                const fetchData = response.data;
                const friends = fetchData['hydra:member'];
                const friendEmails = friends.map(friend => friend.user_2.email);
                if(friendEmails.length>0) {
                    this.setState({
                        friendsEmails: friendEmails
                    })
                    axios.get('/api/dreams', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/ld+json'
                        },
                        params: {
                            'owner.email[]': friendEmails,
                            'privacy.privacy_name[]': ['PUBLIC', 'FOR FRIENDS'],
                            'itemsPerPage': 5,
                            'page': 1,
                            'order': {
                                'date': 'desc',
                                'id': 'asc'
                            }
                        }
                    })
                        .then((dreamResponse) => {
                            let friendsDreams = dreamResponse.data['hydra:member'];
                            if(!("hydra:next" in dreamResponse.data["hydra:view"])){
                                this.setState({hasMore: false});
                            }
                            friendsDreams = friendsDreams.map(dream => ({
                                ...dream,
                                likesAmount: dream.likes.length,
                                commentsAmount: dream.comments.length,
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
                                const dreamId = dream["id"]; // Extract dream ID
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
                            if(error.response.data.code===401){
                                window.location.replace("/logout");
                                console.error("User not authenticated or email missing in localStorage");
                                alert("Your session is expired");
                            } else console.error(error)
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
            if(error.response.data.code===401){
                window.location.replace("/logout");
                console.error("User not authenticated or email missing in localStorage");
                alert("Your session is expired");
            } else console.error("Error fetching friends:", error);
            }
        );

    }

    handleNewDream = (newDream) => {
        const dreamWithCounts = {
            ...newDream,
            likesAmount: newDream.likes?.length || 0,
            commentsAmount: newDream.comments?.length || 0,
        };
        this.setState({
            userDream: dreamWithCounts
        });

    };
    handleLikeChange = (dreamId, change, isMyDream, likeID) => {
        if(isMyDream){
            this.setState((prevState) => ({
                userDream: {
                    ...prevState.userDream,
                    likesAmount: prevState.userDream.likesAmount + change,
                },
            }));
        } else {
            this.setState((prevState) => ({
                userFriendDreams: prevState.userFriendDreams.map((dream) =>
                    dream.id === dreamId
                        ? { ...dream, likesAmount: dream.likesAmount + change }
                        : dream
                ),
            }));
        }
        if(change>0){
            this.setState((prevState) => ({
                didUserLikedThis: {
                    ...prevState.didUserLikedThis,
                    [dreamId]: {
                        liked: true,
                        likeId: likeID,
                    },
                },
            }));
        } else {
            this.setState((prevState) => ({
                didUserLikedThis: {
                    ...prevState.didUserLikedThis,
                    [dreamId]: {
                        liked: false,
                        likeId: null,
                    },
                },
            }));
        }
    };
    handleMoreDreams = (dreams) => {
        dreams = dreams.map(dream => ({
            ...dream,
            likesAmount: dream.likes.length,
            commentsAmount: dream.comments.length,
        }));

        this.setState((prevState) => ({
            userFriendDreams: [...prevState.userFriendDreams, ...dreams],
        }));
    }
    handleCommentAdded = (dreamId, isMyDream, fetchData) => {

        if(isMyDream){
            this.setState((prevState) => ({
                userDream: {
                    ...prevState.userDream,
                    commentsAmount: prevState.userDream.commentsAmount + 1,
                    comments: [...prevState.userDream.comments, fetchData],
                },
            }));
        } else {
            this.setState((prevState) => ({
                userFriendDreams: prevState.userFriendDreams.map((dream) =>
                    dream.id === dreamId
                        ? { ...dream, commentsAmount: dream.commentsAmount + 1, comments: [...dream.comments, fetchData]}
                        : dream
                ),
            }));
        }

    };


    render() {
        const { userDream, userFriendDreams} = this.state;
        const UserDreamItem = ({dream}) => {
            const dreamId = dream["id"];
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            };
            const formattedDate = new Date(dream.date).toLocaleDateString(undefined, options);

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

                        <SocialIcons
                            dream={{ ...dream, isMyDream: true }}
                            liked={!!this.state.didUserLikedThis?.[dream.id]?.liked}
                            likeId={this.state.didUserLikedThis?.[dream.id]?.likeId}
                            onLikeChange={this.handleLikeChange}
                            onCommentAdded={this.handleCommentAdded}
                            isAddingComment={this.state.isAddingComment}
                            setIsAddingComment={(dream_id)=>{
                                if(this.state.isAddingComment===dream_id){
                                    this.setState({
                                        isAddingComment: 0
                                    })
                                    return;
                                }
                                this.setState({
                                    isAddingComment: dream_id
                                })

                            }}
                        />
                    </div>
                </div>
            );
        };
        const FriendDreamItem = ({dream}) => {
            const didUserLikedThis = this.state.didUserLikedThis;
            let liked = false;
            const dreamId = dream["id"];
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
                             src={dream.owner.detail.photo} />
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
                        <SocialIcons
                            dream={{ ...dream, isMyDream: false }}
                            liked={!!this.state.didUserLikedThis?.[dream.id]?.liked}
                            likeId={this.state.didUserLikedThis?.[dream.id]?.likeId}
                            onLikeChange={this.handleLikeChange}
                            onCommentAdded={this.handleCommentAdded}
                            isAddingComment={this.state.isAddingComment}
                            setIsAddingComment={(dream_id)=>{
                                if(this.state.isAddingComment===dream_id){
                                    this.setState({
                                        isAddingComment: 0
                                    })
                                    return;
                                }
                                this.setState({
                                    isAddingComment: dream_id
                                })

                            }}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div>
                <Add_dream onDreamAdded={this.handleNewDream} />
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
                    userDream != null ? (
                        <UserDreamItem key={userDream.id} dream={userDream}/>
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
                {
                    this.state.isLoading.friendsDreams ?
                        <div className="friend-dream">
                            <Message message="Loading friends' dreams..." isLoading={true} />
                        </div> :
                        (
                            userFriendDreams.length > 0 ?
                                <>
                                    {
                                        userFriendDreams.map(dream =>
                                            <FriendDreamItem key={dream.id} dream={dream} />
                                        )
                                    }
                                    {
                                        this.state.hasMore &&
                                        <LoadMore
                                            friendsEmails={this.state.friendsEmails}
                                            handleMoreDreams={this.handleMoreDreams}
                                        />
                                    }
                                </> :
                                <div className="friend-dream">
                                    <Message message="Add more friends to see their dreams" isLoading={false} />
                                </div>
                        )
                }

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