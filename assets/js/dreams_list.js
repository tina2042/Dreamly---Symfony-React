import '../styles/app.css';
import React from 'react';
import axios from 'axios';
import {createRoot} from 'react-dom/client';

class Dreams_list extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userDreams: []
        };

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
            })
            .catch(error => {
                console.error('Error fetching user dreams:', error);
            });
    }

    render() {
        const {userDreams} = this.state;
        const UserDreamItem = ({dream}) => {
            const formattedDate = new Date(dream.date).toLocaleDateString('de-DE');
            return (


                    <div className="dream-tile" onClick={() => {
                        window.location.href = `/dreams/${dream.id}`
                    }}>
                        <h2 className="dream-title">{dream.title}</h2>
                        <p className="dream-description">{dream.content}</p>
                        <span className="dream-date">{formattedDate}</span>
                    </div>



            );
        };
        return (
            userDreams.map(dream => (
                <UserDreamItem key={dream.id} dream={dream}/>
            )));

    }
}

createRoot(document.getElementById('root')).render(<Dreams_list/>);