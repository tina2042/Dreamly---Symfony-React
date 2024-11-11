import '../styles/app.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DreamSearch = ({ allTags, onSearch }) => {
    const [searchInput, setSearchInput] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // Update searchInput when user types
    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    // Toggle tag selection on click
    const handleTagClick = (tag) => {
        setSelectedTags(prevSelectedTags =>
            prevSelectedTags.includes(tag)
                ? prevSelectedTags.filter(t => t !== tag)
                : [...prevSelectedTags, tag]
        );
    };

    // Trigger search when searchInput or selectedTags change
    useEffect(() => {
        onSearch(searchInput, selectedTags);
    }, [searchInput, selectedTags, onSearch]);

    return (
        <div className="dream-search">
            {/* Text input for tag search */}
            <input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                placeholder="Search dreams by tags..."
            />

            {/* Tag selection list */}
            <div className="tag-list">
                {allTags.map(tag => (
                    <span
                        key={tag.id}
                        onClick={() => handleTagClick(tag.name)}
                        className={`tag ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
                    >
                        {tag.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

// Main component for displaying filtered dreams
const DreamsList = () => {
    const [allTags, setAllTags] = useState([]);
    const [dreams, setDreams] = useState([]);
    const [filteredDreams, setFilteredDreams] = useState([]);

    // Fetch all tags and dreams on initial render
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        axios.get('/api/tagss', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setAllTags(response.data['hydra:member']);
            console.log(response.data['hydra:member']);
        }).catch(error => {
            console.error('Error fetching tags:', error);
        });
        axios.get('/api/dreams', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setDreams(response.data);
            setFilteredDreams(response.data);
            console.log(response.data);
        }).catch(error => {
            console.error('Error fetching dreams:', error);
        });

    }, []);

    // Filter dreams based on search input and selected tags
    const handleSearch = (searchInput, selectedTags) => {
        console.log('search');
        /*const filtered = dreams.filter(dream => {
            const matchesInput = dream.title.includes(searchInput) || dream.dream_content.includes(searchInput);
            const matchesTags = selectedTags.length === 0 || dream.tags.some(tag => selectedTags.includes(tag.name));
            return matchesInput && matchesTags;
        });
        setFilteredDreams(filtered);*/
    };

    return (
        <div className="dreams-list">
            <DreamSearch allTags={allTags} onSearch={handleSearch} />

            {/* Display filtered dreams */}
            <div className="dreams">
                {filteredDreams.map(dream => (
                    <div key={dream.id} className="dream">
                        <h3>{dream.title}</h3>
                        <p>{dream.dream_content}</p>
                        <div className="dream-tags">
                            {dream.tags.map(tag => (
                                <span key={tag['@id']} className="tag">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
import {createRoot} from 'react-dom/client';

createRoot(document.getElementById('root')).render(<DreamsList/>);
