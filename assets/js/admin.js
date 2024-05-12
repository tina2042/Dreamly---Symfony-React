import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {createRoot} from "react-dom/client";


function UserProfile({user_id}) {
    const [userData, setUserData] = useState(null);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('jwt');

        // Fetch data for the current user
        /*axios.get(`/api/user_detail`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setUserData(response.data);
                console.log(userData);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });*/

        // Fetch data for all users
        axios.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setAllUsers(response.data);
                console.log(allUsers);
            })
            .catch(error => {
                console.error('Error fetching all users data:', error);
            });
    });

    return (

    <div className="two_panels">
        {userData && (
            <div className="user_settings">
                <div className="top">
                    <div className="profile-photo">
                        <img src={userData.photo} alt="User Photo" />
                    </div>
                    <div className="name">
                        {userData.name} {userData.surname}
                    </div>
                    <div className="statistics">
                        <p>
                            <i className="fa-solid fa-heart"></i>
                            {userData.stats.likeAmount}
                        </p>
                        <p>
                            {userData.stats.dreamsAmount} {userData.stats.dreamsAmount > 1 ? 'dreams' : 'dream'}
                        </p>
                    </div>
                </div>
                <div className="other">
                    {/* Profile info */}
                    <div>
                        <p><i className="fa-solid fa-user"></i> Profile info</p>
                        <div className="profile-info hidden">
                            <p>Name: {userData.name}</p>
                            <p>Surname: {userData.surname}</p>
                            <p>Email: {userData.email}</p>
                        </div>
                    </div>
                    {/* Change photo */}
                    <div>
                        <p><i className="fa-solid fa-camera"></i> Change photo</p>
                    </div>
                    {/* Statistics */}
                    <div>
                        <p><i className="fa-solid fa-square-poll-vertical"></i> Statistics</p>
                        <div className="statistics-info hidden">
                            {/* Statistics info */}
                        </div>
                    </div>
                    {/* Logout */}
                    <div>
                        <form action="/logout" method="post">
                            <button type="submit" id="logoutButton">
                                <p><i className="fa-solid fa-right-from-bracket" style={{ color: '#a6a2da' }}></i> Log out</p>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )}
        <div className="admin-panel">
            {allUsers.map(user => (
                <div className="session-info user-info" key={user.id}>
                    <img src={user.photo} alt="User" />
                    <div className="session-details">
                        <p className="dark">{user.name} {user.surname}</p>
                        <p className="dark email">{user.email}</p>
                    </div>
                    <button type="button" className="small-btn" data-email={user.email}>Delete User</button>
                </div>
            ))}
        </div>
    </div>
    );
}

createRoot(document.getElementById('root')).render(<UserProfile/>);
