import '../styles/app.css';
import React from 'react';
import axios from 'axios';
import {createRoot} from 'react-dom/client';
import {Audio} from "react-loader-spinner";
import LoadMore from "./LoadMore";

class Dreams_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userDreams: [],
            isLoading: true,
            hasMore:true
        };
    }

    async componentDidMount() {

        const token = localStorage.getItem('jwt');
        const email = localStorage.getItem('email');
        await axios.get(`/api/dreams/?order%5Bdate%5D=desc&page=1&itemsPerPage=5&owner.email=${(email)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const fetchData = response.data["hydra:member"];
                this.setState({userDreams: fetchData,
                                    isLoading: false})
                if(!("hydra:next" in response.data["hydra:view"])){
                    this.setState({hasMore: false});
                }
            })
            .catch(error => {
                console.error('Error fetching user dreams:', error);
            });
    }

    handleMoreDreams = (dreams) => {
        dreams = dreams.map(dream => ({
            ...dream,
            likesAmount: dream.likes.length,
            commentsAmount: dream.comments.length,
        }));

        this.setState((prevState) => ({
            userDreams: [...prevState.userDreams, ...dreams],
        }));
    }
    render() {
        const email = localStorage.getItem('email');
        const {userDreams, isLoading} = this.state;
        const UserDreamItem = ({dream}) => {
            const formattedDate = new Date(dream.date).toLocaleDateString('de-DE');
            return (

                    <div className="dream-tile" onClick={() => {
                        window.location.href = `/dreams/${dream["@id"].split("/").pop()}`
                    }}>
                        <h2 className="dream-title">{dream.title}</h2>
                        <p className="dream-description">{dream.dream_content}</p>
                        <span className="dream-date">{formattedDate}</span>
                    </div>

            );
        };
        return (
            <div className="dream-container">
                {isLoading ? (
                    <div className="loading">
                        <Audio
                            height="120"
                            width="120"
                            radius="9"
                            color="#263238"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                ) : userDreams.length > 0 ? (
                    <>
                        {userDreams.map(dream => (
                            <UserDreamItem key={dream["@id"].split("/").pop()} dream={dream}/>
                        ))}
                        {this.state.hasMore &&
                            <LoadMore
                                friendsEmails={email}
                                handleMoreDreams={this.handleMoreDreams}
                                hasMore={this.state.hasMore}
                            />}
                    </>
                ) : (
                    <div className="message-container">
                        No dreams added
                    </div>
                )}
            </div>
        );

    }
}

createRoot(document.getElementById('root')).render(<Dreams_list/>);