import '../styles/app.css';
import React from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import {Audio} from "react-loader-spinner";
import SocialIcons from "./SocialIcons";

class ViewDream extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dreamId: window.location.pathname.split('/')[2],
            userDream: null,
            isAddingComment: null,
            didUserLikedThis: null,

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

            const userId = fetchData.owner["@id"].split("/").pop();
            const likedLike = fetchData.likes.find(like => like.owner["@id"].split('/').pop() === userId);
            const likeId = likedLike ? likedLike['@id'].split('/').pop() : null;

            this.setState({
                userDream: {...fetchData,
                likesAmount: fetchData.likes.length,
                commentsAmount: fetchData.comments.length} ,
                dreamId: dreamId,
                didUserLikedThis: {
                    likeId: likeId,
                    liked: !!likedLike,
                },
            });
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
        }
    }

    handleLikeChange = (dreamId, change, isMyDream, likeID) => {

            this.setState((prevState) => ({
                userDream: {
                    ...prevState.userDream,
                    likesAmount: prevState.userDream.likesAmount + change,
                },
            }));

        if(change>0){
            this.setState((prevState) => ({
                didUserLikedThis: {
                    likeId: likeID,
                    liked: true,}

            }));
        } else {
            this.setState((prevState) => ({
                didUserLikedThis: {likeId: null,
                liked: false,}
            }));
        }
    };

    handleCommentAdded = (dreamId, isMyDream, fetchData) => {
        console.log(fetchData);

            this.setState((prevState) => ({
                userDream: {
                    ...prevState.userDream,
                    commentsAmount: prevState.userDream.commentsAmount + 1,
                    comments: [...prevState.userDream.comments, fetchData],
                },
            }));

    };

    render() {
        const { userDream, dreamId, didUserLikedThis } = this.state;

        if (!userDream ) {
            return <div className="loading">
                <Audio
                    height="120"
                    width="120"
                    radius="9"
                    color="#263238"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>;
        }

        let isLiked = false;
        if(didUserLikedThis!==null){
            isLiked = true;
        }
        console.log(didUserLikedThis);
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
                    <SocialIcons
                        dream={{ ...userDream, isMyDream: false }}
                        liked={this.state.didUserLikedThis.liked}
                        likeId={this.state.didUserLikedThis.likeId}
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
}

createRoot(document.getElementById('root')).render(<ViewDream/>);
