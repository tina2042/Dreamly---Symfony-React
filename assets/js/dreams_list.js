import '../styles/app.css';
import React from 'react';
import axios from 'axios';
import {createRoot} from 'react-dom/client';
import {Audio} from "react-loader-spinner";

class Dreams_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userDreams: [],
            isLoading: true
        };
    }

    async componentDidMount() {

        const token = localStorage.getItem('jwt');
        const email = localStorage.getItem('email');
        await axios.get(`/api/dreams/?order%5Bdate%5D=desc&page=1&itemsPerPage=30&owner.email=${(email)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const fetchData = response.data["hydra:member"];
                this.setState({userDreams: fetchData,
                                    isLoading: false})
            })
            .catch(error => {
                console.error('Error fetching user dreams:', error);
            });
    }

    render() {
        const {userDreams, isLoading} = this.state;
        const UserDreamItem = ({dream}) => {
            const formattedDate = new Date(dream.date).toLocaleDateString('de-DE');
            return (

                    <div className="dream-tile" onClick={() => {
                        window.location.href = `/dreams/${dream["@id"].split("/").pop()}`
                    }}>
                        <h2 className="dream-title">{dream.title}</h2>
                        <p className="dream-description">{dream.content}</p>
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
                    userDreams.map(dream => (
                        <UserDreamItem key={dream["@id"].split("/").pop()} dream={dream}/>
                    ))
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