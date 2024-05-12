import '../styles/app.css';
import React from 'react';
import axios from 'axios';
import {createRoot} from 'react-dom/client';

class ViewDream extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userDream: null,
            user: null
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('jwt');
        const dreamId = window.location.pathname.split('/')[2];
        console.log('ID:', dreamId);
        const url = `/api/dreams/${dreamId}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const fetchData = response.data;
            this.setState({ userDream: fetchData });
            console.log('Dane pobrane z API:', fetchData);

            // Fetch user details after fetching the dream
            const userUrl = `${fetchData.owner}`;
            const userResponse = await axios.get(userUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const userFetchData = userResponse.data;
            console.log('User details:', userFetchData);
            this.setState({ user: userFetchData });

        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
        }
    }

    render() {
        const { userDream, user } = this.state;

        if (!userDream || !user) {
            return <div>Loading...</div>;
        }

        return (
            <div className="view-dream">
                <div id="top">
                    <img src={user.detail.photo} alt="Photo" />
                    <p>{user.detail.name}</p>
                    <h4>Title: {userDream.title}</h4>
                    <data>{new Date(userDream.date).toLocaleDateString('de-DE')}</data>
                </div>

                <div id="bottom">
                    <p>{userDream.dream_content}</p>
                    <div id="social-icons">
                        <div className="likes">
                            <div>
                                <i className="fa-solid fa-heart fa-xl like"></i>
                            </div>
                            <p className="like-amount">{userDream.likes.length}</p>
                        </div>
                        <div className="comment_icon">
                            <i className="fa-solid fa-comment fa-xl"></i>
                            <p>{userDream.comments.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

createRoot(document.getElementById('root')).render(<ViewDream />);
