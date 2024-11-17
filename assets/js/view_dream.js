import '../styles/app.css';
import React from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import {Audio} from "react-loader-spinner";

class ViewDream extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dreamId: window.location.pathname.split('/')[2],
            userDream: null,
            isAddingComment: null,
            myLikeId: null,

        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('jwt');
        const dreamId = window.location.pathname.split('/')[2];
        const url = `/api/dreams/${dreamId}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const fetchData = response.data;

            // Calculate myLikeId and liked status
            const userId = fetchData.owner["@id"].split("/").pop();
            const likedLike = fetchData.likes.find(like => like.owner["@id"].split('/').pop() === userId);
            const likeId = likedLike ? likedLike['@id'].split('/').pop() : null;

            this.setState({
                userDream: fetchData,
                dreamId: dreamId,
                myLikeId: likeId, // Set myLikeId here
            });
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
        }
    }

    handleLikeAdd = async (dream_id) => {
        const { userDream, user, dreamId, myLikeId } = this.state;
        const token = localStorage.getItem('jwt');

        if(myLikeId!=null){
            await this.handleUnlike(dreamId);
        }else{
            alert("Adding like...");
            try {
                const response = await axios.post('/api/add_like', { dreamId: dreamId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/ld+json'
                    }
                });
                if (response.status === 200) {
                    const likeId = response.data.likeId;
                    this.setState({myLikeId: likeId});
                    this.componentDidMount(); // Reload the data
                }
            } catch (error) {
                console.error('Error adding like:', error);
            }
        }
    }

    handleUnlike = async (dreamId) => {
        const token = localStorage.getItem('jwt');
        const likeId = this.state.myLikeId;
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
                this.setState({myLikeId: null});
                this.componentDidMount(); // Reload the data
            }
        } catch (error) {
            console.error('Error removing like:', error);
        }

    }

    render() {
        const { userDream, dreamId, myLikeId } = this.state;

        if (!userDream ) {
            return <div className="loading">
                <Audio
                    height="150"
                    width="150"
                    radius="9"
                    color="#9a87e2"
                    ariaLabel="three-dots-loading"
                    wrapperStyle
                    wrapperClass
                />
            </div>;
        }

        const liked = !!myLikeId;

        return (
            <div className="view-dream">
                <div id="top">
                    <img src={userDream.owner.detail.photo} alt="Photo"/>
                    <p>{userDream.owner.detail.name}</p>
                    <h4>Title: {userDream.title}</h4>
                    <data>{new Date(userDream.date).toLocaleDateString('de-DE')}</data>
                </div>
                <section className="wrapper">
                    {userDream.tags && userDream.tags.length > 0 && (
                        <div className="tags">
                            {userDream.tags.map(tag => (
                                <span key={'dream-tag-' + tag['@id'].split("/").pop()} className="tag">
                                    {tag.name}
                                 </span>
                            ))}
                        </div>
                    )}
                    <div className="emotion">
                        {userDream.emotion.emotion_name === 'HAPPY' && (
                            <label className="emoji">😊</label>
                        )}
                        {userDream.emotion.emotion_name === 'NEUTRAL' && (
                            <label className="emoji">😐</label>
                        )}
                        {userDream.emotion.emotion_name === 'SAD' && (
                            <label className="emoji">😢</label>
                        )}
                    </div>
                </section>
                <div id="bottom">
                    <p>{userDream.dream_content}</p>
                    <div id="social-icons">
                        <div className="likes">
                            <div className="likes" onClick={() => this.handleLikeAdd(dreamId)}>
                                <i className={`fa-solid fa-heart fa-xl ${liked ? 'liked' : ''}`}></i>
                            </div>
                            <p className="like-amount">{userDream.likes.length}</p>

                        </div>
                        <div className="comment_icon"
                             onClick={() => {
                                 if (this.state.isAddingComment === dreamId) this.setState({isAddingComment: null})
                                 else this.setState({isAddingComment: dreamId})
                             }
                             }
                        >
                            <i className="fa-solid fa-comment fa-xl"></i>
                            <p>{userDream.comments.length}</p>
                        </div>
                    </div>
                    {
                        this.state.isAddingComment === dreamId &&
                        <div className="comments">
                            <div className="comments-list">
                                {this.state.userDream.comments.map(comment => (
                                    <div className="single-comment" key={comment.id}>
                                        <p className="single-comment-date">
                                            {(new Date(comment.comment_date)).toLocaleDateString()}
                                        </p>
                                        <p className="single-comment-content">{comment.comment_content}</p>
                                    </div>
                                ))}
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
                                        this.componentDidMount(); // Reload the data
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
            </div>
        );
    }
}

createRoot(document.getElementById('root')).render(<ViewDream/>);
