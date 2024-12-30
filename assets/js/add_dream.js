import '../styles/app.css';
import React from 'react';
import axios from 'axios';
import {BeatLoader} from "react-spinners";

class Add_dream extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            emotion: 'HAPPY',
            privacy: 'PUBLIC', // Default value
            tags: ["dream"],
            inputTag: "",
            maxCharactersLengthTag: 20,
            maxLengthTags: 10,
            errors: {
                length: false,
                lengthTags: false,
                validChar: false,
                already: false,
                startChar: false
            },
            isAdding:false
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleTagChange = (e) => {
        let value = e.target.value;

        if (value.includes(' ') || value.includes(',')) {
            value = value.trim().replace(/,$/, '').toLowerCase();

            if (value.length > 0) {
                this.addTag(value);
            }

            this.setState({ inputTag: '' });
        } else {

            this.setState({
                inputTag: value.slice(0, this.state.maxCharactersLengthTag)
            });
        }
    };

    addTag = (tag) => {
        const { tags, maxCharactersLengthTag, maxLengthTags } = this.state;
        const patternTag = /^[A-Za-z0-9ء-ي_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/g;
        let errors = {};

        if (tag.length > maxCharactersLengthTag) {
            errors.length = true;
        } else if (/^_/.test(tag)) {
            errors.startChar = true;
        } else if (tags.length === maxLengthTags) {
            errors.lengthTags = true;
        } else if (!patternTag.test(tag)) {
            errors.validChar = true;
        } else if (tags.includes(tag)) {
            errors.already = true;
        } else {
            this.setState({

                tags: [...tags, tag],
                errors: {}
            });
        }


        this.setState({ errors });
    };

    removeTag = (tagToRemove) => {
        this.setState({
            tags: this.state.tags.filter(tag => tag !== tagToRemove)
        });
    };
    handleSubmit = (e) => {
        e.preventDefault();

        const { title, content, emotion, privacy, tags } = this.state;
        const token = localStorage.getItem('jwt');
        this.setState( {isAdding: true});
        axios.post('/api/add_dream', {
            title,
            content,
            emotion,
            privacy,
            tags
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const newDream = response.data;

                // Notify the parent component (Home) about the new dream
                if (this.props.onDreamAdded) {
                    this.props.onDreamAdded(newDream);
                }
                // Clear the form or redirect
                this.setState({
                    title: '',
                    content: '',
                    emotion: 'HAPPY',
                    privacy: 'PUBLIC',
                    tags: ["dream"]
                });
                if( !window.location.href.endsWith('/home') ) window.location.href='/home';
            })
            .catch(error => {
                // Handle error
                console.error('Error adding dream:', error);
            }).finally(()=>{
                this.setState( {isAdding: false})
            });
    }

    render() {
        const { tags, inputTag, maxCharactersLengthTag, maxLengthTags, errors } = this.state;
        return (
            <div className="add-dream-form">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="title" value={this.state.title} onChange={this.handleChange}
                           placeholder="Enter title"/>
                    <hr></hr>
                    <section className="wrappers">
                        <div className="tags">
                            <div className={`wrapper-tags ${inputTag ? 'focus' : ''}`}>
                                <div className="view-tags">
                                    {tags.map((tag, index) => (
                                        <span key={index} className="tag" data-tag={tag}>
                                            {tag}
                                            <i
                                                className="fa fa-close"
                                                onClick={() => this.removeTag(tag)}
                                            ></i>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        className="input-tag"
                                        value={inputTag}
                                        onChange={this.handleTagChange}
                                        onKeyUp={(e) => e.key === 'Enter' && this.addTag(e)}
                                        placeholder="Add tag"
                                    />
                                </div>
                            </div>

                            {this.state.errors.length &&
                                <div className="show-error length">Tag must be between 1 and 20 characters.</div>}
                            {this.state.errors.lengthTags &&
                                <div className="show-error lengthTags">You cannot add more than 10 tags.</div>}
                            {this.state.errors.validChar &&
                                <div className="show-error validChar">Use only letters or numbers.</div>}
                            {this.state.errors.already &&
                                <div className="show-error already">This tag is already added.</div>}
                            {this.state.errors.startChar &&
                                <div className="show-error startChar">Tag must start with a letter.</div>}

                            <div className="show-count-all">
                                <div className="count-character-tag">
                                    <span>{maxCharactersLengthTag - inputTag.length}</span> characters left.
                                </div>
                                <div className="count-tags">
                                    <span>{maxLengthTags - tags.length}</span> tags left.
                                </div>
                            </div>
                        </div>

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

                    </section>
                    <hr></hr>
                    <textarea name="content" value={this.state.content} onChange={this.handleChange}
                              placeholder="Write your dream here"></textarea>
                    <div id="buttons">
                        <div className="dropdown-list">
                            <label htmlFor="privacy">
                                <select name="privacy" id="privacy" value={this.state.privacy}
                                        onChange={this.handleChange}>
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private</option>
                                    <option value="FOR FRIENDS">For friends</option>
                                </select>
                            </label>
                        </div>
                        <button type="button" className="cancel-btn" onClick={() => {
                            window.location.href = '/home'
                        }}>Cancel
                        </button>
                        <button type="submit" className="submit">
                            {this.state.isAdding ? <BeatLoader /> :
                                <span>Add Dream </span> } </button>

                    </div>
                </form>
            </div>
        );
    }
}
export default  Add_dream;

import {createRoot} from 'react-dom/client';
createRoot(document.getElementById('root')).render(<Add_dream/>);