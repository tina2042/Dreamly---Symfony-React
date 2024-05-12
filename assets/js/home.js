/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import '../styles/app.css';
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
                fiendsDreams: true,
            },
        };

    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const {title, content, emotion, privacy} = this.state;
        const token = localStorage.getItem('jwt');
        //console.log(token);
        axios.post('/api/add_dream', {
            title,
            content,
            emotion,
            privacy
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                // Handle success, maybe redirect or update state
                //console.log(response.data);
                //message that dream has been added
                this.setState({
                    title: '',
                    content: '',
                    emotion: 'HAPPY',
                    privacy: 'PUBLIC',
                });
            })
            .catch(error => {
                // Handle error
                console.error('Error adding dream:', error);
            });
    }

    async componentDidMount() {

        const token = localStorage.getItem('jwt');

        await axios.get('/api/dreams', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const fetchData = response.data;
                this.setState({userDreams: fetchData})
                this.setState({isLoading: {dreams: false}});
               // console.log('Dane pobrane z API ():', this.state.userDreams);
            })
            .catch(error => {
                console.error('Error fetching user dreams:', error);
            });
        await axios.get('/api/friends/dreams', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const fetchData = response.data;
                this.setState({userFriendDreams: fetchData})
                this.setState({isLoading: {friendsDreams: false}});
                //console.log('Dane pobrane z API friends/dreams:', this.state.userFriendDreams);
            })
            .catch(error => {
                console.error('Error fetching user friends:', error);
            });

    }

    render() {
        const {userDreams, userFriendDreams} = this.state;
        const UserDreamItem = ({dream}) => {
            const formattedDate = new Date(dream.date).toLocaleDateString('de-DE');
            return (
                <div>
                    <div className="my-dream-top">
                        <h3 className="block-name">My last dream</h3>
                        <button type="button" className="dream-list-btn" onClick={() => {
                            window.location.href = '/dreams_list'
                        }}>View all my dreams
                        </button>
                    </div>
                    <div className="my-dream" onClick={() => {
                        window.location.href = `/dreams/${dream.id}`
                    }}>
                        <div className="top">
                            <h4>{dream.title}</h4>
                            <data>{formattedDate}</data>
                        </div>
                        <p>{dream.content}</p>
                        <div className="social-icons">
                            <div className="likes">
                                <i className="fa-solid fa-heart fa-xl like"></i>
                                <p className="like-amount">{dream.likes}</p>
                            </div>
                            <div className="comment_icon">
                                <i className="fa-solid fa-comment fa-xl"></i>
                                <p>{dream.commentsAmount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        const Message = ({message}) => (

                <div className="top">
                    <h4>{message}</h4>
                </div>

        );

        const FriendDreamItem = ({dream}) => {
            return (
                    <div key={dream.id} className="friend-dream">
                        <div className="top">
                            <img alt="dream"
                                 src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"/>
                            <p>{dream.ownerName}</p>
                            <h4>{dream.title}</h4>
                            <data>{dream.date}</data>
                        </div>
                        <div className="bottom">
                            <p>{dream.content}</p>
                            <div className="social-icons">
                                <div className="likes">
                                    <i className="fa-solid fa-heart fa-xl like"></i>
                                    <p className="like-amount">{dream.likes}</p>
                                </div>
                                <div className="comment_icon">
                                    <i className="fa-solid fa-comment fa-xl"></i>
                                    <p>{dream.commentsAmount}</p>
                                </div>
                            </div>
                        </div>
                    </div>)
        }
        let latestDream = null;
        if(userDreams.length >0){
            latestDream=null;
        }
        latestDream = userDreams[userDreams.length - 1];
        return (
            <div>
                <div className="add-dream-form">
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name="title" value={this.state.title} onChange={this.handleChange}
                               placeholder="Enter title"/>
                        <textarea name="content" value={this.state.content} onChange={this.handleChange}
                                  placeholder="Write your dream here"></textarea>
                        <div id="buttons">
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
                {
                    this.state.isLoading.dreams &&
                    <div>
                        <p></p>
                    </div>
                }
                {
                    !this.state.isLoading.dreams &&
                    (
                        latestDream != null ? (

                            <UserDreamItem dream={latestDream} />
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
                    )
                }

                <div className="friend-find">
                    <h3 className="block-name">Friends dreams</h3>
                    <div className="wrap">
                        <div className="search">
                            <div>
                                <input type="text" className="searchTerm" placeholder="Find more friends"/>
                                <button type="submit" className="searchButton">
                                    <i className="fa fa-search search-icon"></i>
                                </button>
                            </div>
                            <ul id="search-results"></ul>
                        </div>
                    </div>
                </div>
                {
                    (this.state.isLoading.friendsDreams || []).length > 0 &&
                    <div>
                        <p></p>
                    </div>
                }
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

createRoot(document.getElementById('root')).render(<Home/>);
