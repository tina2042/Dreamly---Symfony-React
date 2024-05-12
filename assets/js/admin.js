import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {createRoot} from "react-dom/client";

function AdminProfile({user_id}) {
    const [userData, setUserData] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [userId, setUserId] = useState(undefined);

    useEffect(() => {
        const token = localStorage.getItem('jwt');

        // Fetch data for the current user
        axios.get(`/api/user_id`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setUserId(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        // Fetch data for all users
        axios.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setAllUsers(response.data['hydra:member']);
            })
            .catch(error => {
                console.error('Error fetching all users data:', error);
            });
    }, []);


    useEffect(()=>{
        if(userId){
            const token = localStorage.getItem('jwt');
            axios.get(`/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setUserData(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    },[userId])

    const handleDeleteUser = (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            const token = localStorage.getItem('jwt');
            axios.delete(`/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    // Refresh the user list after deletion
                    const updatedUsers = allUsers.filter(user => user.id !== userId);
                    setAllUsers(updatedUsers);
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
        }
    };

    return (

    <div className="two_panels">
        {userData && (
            <div className="user_settings">
                <div className="top">
                    <div className="profile-photo">
                        <img src={userData.detail.photo} alt="User Photo" />
                    </div>
                    <div className="name">
                        {userData.detail.name} {userData.detail.surname}
                    </div>
                    <div className="statistics">
                        <p>
                            <i className="fa-solid fa-heart"></i>
                            {userData.userStatistics.like_amount}
                        </p>
                        <p>
                            {userData.userStatistics.dreams_amount}
                            {userData.userStatistics.dreams_amount > 1 ? ' dreams' : ' dream'}
                        </p>
                    </div>
                </div>
                <div className="other">
                    {/* Profile info */}
                    <div>
                        <p><i className="fa-solid fa-user"></i> Profile info</p>
                        <div className="profile-info hidden">
                            <p>Name: {userData.detail.name}</p>
                            <p>Surname: {userData.detail.surname}</p>
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
                    <img src={user.detail.photo} alt="User" />
                    <div className="session-details">
                        <p className="dark">{user.detail.name} {user.detail.surname}</p>
                        <p className="dark email">{user.email}</p>
                    </div>
                    <button
                        type="button"
                        className="small-btn"
                        onClick={() => handleDeleteUser(user.id)}
                    >Delete User
                    </button>
                </div>
            ))}
        </div>
    </div>
    );
}

createRoot(document.getElementById('root')).render(<AdminProfile/>);
