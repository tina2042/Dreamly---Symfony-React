import React, { Component } from 'react';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';

class SocialIcons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmittingComment: false,
            isSubmittingLike: false
        };
    }

    handleLikeAdd = async (dreamId, isMyDream, liked) => {
        const token = localStorage.getItem('jwt');

        if (liked) {
            await this.handleUnlike(dreamId, isMyDream);
        } else {
            this.setState({ isSubmittingLike: true });
            try {
                const response = await axios.post('/api/add_like', { dreamId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/ld+json',
                    },
                });

                if (response.status === 200) {
                    const likeId = response.data.likeId;
                    this.props.onLikeChange(dreamId, 1, isMyDream, likeId );
                }
            } catch (error) {
                if(error.response.data.code===401){
                    window.location.replace("/logout");
                    console.error("User not authenticated or email missing in localStorage");
                    alert("Your session is expired");
                }else
                console.error('Error adding like:', error);
            } finally {
                this.setState({ isSubmittingLike: false });
            }
        }
    };

    handleUnlike = async (dreamId, isMyDream) => {
        const token = localStorage.getItem('jwt');
        const likeId = this.props.likeId;
        this.setState({ isSubmittingLike: true });

        try {
            const response = await axios.delete(`/api/user_likes/${likeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/ld+json',
                },
            });

            if (response.status === 204) {
                this.props.onLikeChange(dreamId, -1, isMyDream, 0);
            }
        } catch (error) {
            if(error.response.data.code===401){
                window.location.replace("/logout");
                console.error("User not authenticated or email missing in localStorage");
                alert("Your session is expired");
            }else

            console.error('Error removing like:', error);
        } finally {
            this.setState({ isSubmittingLike: false });
        }
    };



    handleAddComment = (e, dreamId, isMyDream) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const token = localStorage.getItem('jwt');

        if (data.get('comment').length < 5) {
            alert("Comment must be at least 5 characters long");
            return;
        }
        this.setState({ isSubmittingComment: true });

        axios.post('/api/add_comment', {
            comment: data.get('comment'),
            dream_id: dreamId,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/ld+json',
            },
        })
            .then(response => {
                const fetchData = response.data;
                this.props.onCommentAdded(dreamId, isMyDream, fetchData);

                e.target.reset();
            })
            .catch((error) => {
                if(error.response.data.code===401){
                    window.location.replace("/logout");
                    console.error("User not authenticated or email missing in localStorage");
                    alert("Your session is expired");
                }else
                    console.error(error);
            })
            .finally(() => {
                this.setState({ isSubmittingComment: false });
            });
    };

    render() {
        const { dream, liked, isAddingComment} = this.props;
        const { isSubmittingComment, isSubmittingLike } = this.state;

        return (
            <>
                <div className="social-icons">
                    <div className="likes" onClick={() => this.handleLikeAdd(dream.id, dream.isMyDream, liked)}>
                        {isSubmittingLike ? (
                                <BeatLoader />
                            ) :
                            <i className={`fa-solid fa-heart fa-xl ${liked ? 'liked' : dream.isMyDream ? 'unliked-my': 'unliked'}`}></i>}
                        <p className="like-amount">{dream.likesAmount}</p>
                    </div>
                    <div
                        className="comment_icon"
                        onClick={() => this.props.setIsAddingComment(dream.id)}
                    >
                        <i className="fa-solid fa-comment fa-xl"></i>
                        <p>{dream.commentsAmount}</p>
                    </div>
                </div>

                {isAddingComment === dream.id && (
                    <div className="comments">
                        <div className="comments-list">
                            {dream.comments.map((comment) => (
                                <div className="single-comment" key={comment["id"]}>
                                    <p className="single-comment-date">
                                        {new Date(comment.comment_date).toLocaleDateString()}
                                    </p>
                                    <p className="single-comment-content">{comment.comment_content}</p>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={(e) => this.handleAddComment(e, dream.id, dream.isMyDream)}>
                            <div className="add-comment">
                                <textarea
                                    name="comment"
                                    minLength={5}
                                    placeholder="Add a comment..."
                                ></textarea>
                                <button type="submit">
                                    {isSubmittingComment ? (
                                        <BeatLoader />
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </>
        );
    }
}

export default SocialIcons;
