import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/app.css';
const FriendsDreams = () => {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        console.log(token);
        const fetchFriendsDreams = async () => {
            try {
                const response = await axios.get('/api/friends/dreams',
                    {headers: {

                    'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                }});
                setFriends(response.data.friend);
            } catch (error) {
                console.error('Error fetching friends dreams:', error);
            }
        };

        fetchFriendsDreams();
    }, []);

    return (
        <div>
            <h1>Friends' Dreams</h1>
            <ul>
                {friends.map((friend, index) => (
                    <li key={index}>{friend.user_1_id}</li>
                    // You can adjust the data you want to display
                ))}
            </ul>
        </div>
    );
};
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')).render(<FriendsDreams />);