import '../styles/app.css';
import React from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';

class ViewDream extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dreamId: window.location.pathname.split('/')[2],
            userDream: null,
            user: null,
            dreamsComments: [],
            isAddingComment: null,
            myLikeId: null,
            tags:[]
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
            this.setState({ userDream: fetchData });

            // Fetch user details after fetching the dream
            const userUrl = `${fetchData.owner}`;
            const userResponse = await axios.get(userUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const userFetchData = userResponse.data;
            this.setState({ user: userFetchData });

            // Fetch comments
            const comments = [];
            for (const comment of fetchData.comments) {
                const commentId = comment.split('/').pop();
                try {
                    const commentsUrl = `/api/comments/${commentId}`;
                    const commentsResponse = await axios.get(commentsUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    const commentsFetchData = commentsResponse.data;
                    comments.push(commentsFetchData);

                } catch (error) {
                    console.error('Błąd podczas pobierania danych:', error);
                }
            }
            this.setState({ dreamsComments: comments });

        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
        }
    }
    handleLikeAdd = async (dream_id) => {
        const { userDream, user, dreamId, myLikeId } = this.state;
        const token = localStorage.getItem('jwt');

        if(myLikeId!=null){
            await this.handleUnlike(dream_id);
        }else{
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
                    this.setState({myLikeId: likeId});
                    this.componentDidMount(); // Reload the data
                }
            } catch (error) {
                console.error('Error adding like:', error);
            }
        }
    }

    handleUnlike = async (dream_id) => {
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
        const { userDream, user, dreamId } = this.state;

        if (!userDream || !user) {
            return <div>Loading...</div>;
        }
        const userId = user.id.toString();
        const likedLike = userDream.likes.find(like => like.owner.split('/').pop() === userId);
        const liked = !!likedLike; // Convert found like object to boolean
        const likeId = likedLike ? likedLike['@id'].split('/').pop() : null;
        this.setState({myLikeId: likeId})

        return (
            <div className="view-dream">
                <div id="top">
                    <img src={user.detail.photo} alt="Photo"/>
                    <p>{user.detail.name}</p>
                    <h4>Title: {userDream.title}</h4>
                    <data>{new Date(userDream.date).toLocaleDateString('de-DE')}</data>
                </div>
                <section className="wrapper">
                    {userDream.tags && userDream.tags.length > 0 && (
                        <div className="tags">
                            {userDream.tags.map(tag => (
                                <span key={'dream-tag-' + tag['@id']} className="tag">
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
                                {this.state.dreamsComments.map(comment => (
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
