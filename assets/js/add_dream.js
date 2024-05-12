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

class Add_dream extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            emotion: 'HAPPY',
            privacy: 'PUBLIC' // Default value
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { title, content, emotion, privacy } = this.state;
        const token = localStorage.getItem('jwt');
        console.log(token);
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
                console.log(response.data);
                window.location.href='/home';
            })
            .catch(error => {

                // Handle error
                console.error('Error adding dream:', error);
            });
    }

    render() {
        return (
            <div className="add-dream-form">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="title" value={this.state.title} onChange={this.handleChange}
                           placeholder="Enter title"/>
                    <textarea name="content" value={this.state.content} onChange={this.handleChange}
                              placeholder="Write your dream here"></textarea>
                    <div id="buttons">
                        <div className="emotion-picker">
                            <input type="radio" id="HAPPY" name="emotion" value="HAPPY" onChange={this.handleChange}/>
                            <label htmlFor="HAPPY" className="emoji">😊</label>

                            <input type="radio" id="NEUTRAL" name="emotion" value="NEUTRAL"
                                   onChange={this.handleChange}/>
                            <label htmlFor="NEUTRAL" className="emoji">😐</label>

                            <input type="radio" id="SAD" name="emotion" value="SAD" onChange={this.handleChange}/>
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
        );
    }
}

import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')).render(<Add_dream />);


