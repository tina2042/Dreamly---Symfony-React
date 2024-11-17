import '../styles/app.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {createRoot} from 'react-dom/client';
import selectedOwnerType from "core-js/internals/array-includes";
import {Audio, MagnifyingGlass} from 'react-loader-spinner';

const DreamSearch = ({allTags = [], onSearch}) => {
    const [searchInput, setSearchInput] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const allOwner = ['user', 'friends'];
    const [selectedOwner, setSelectedOwner] = useState([])
    const [selectedOwnerType, setSelectedOwnerType] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleTagClick = (tag) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tag)
                ? prevSelectedTags.filter((t) => t !== tag)
                : [...prevSelectedTags, tag]
        );
    };

    const handleOwnerClick = async (ownerType) => {
        setIsLoading(true);
        const token = localStorage.getItem('jwt');
        const email = localStorage.getItem('email');
        setSelectedOwnerType((prevSelectedOwnerType) =>
            prevSelectedOwnerType.includes(ownerType)
                ? prevSelectedOwnerType.filter((t) => t !== ownerType)
                : [...prevSelectedOwnerType, ownerType]
        );
        if (ownerType === 'user') {
            setSelectedOwner((prevSelectedOwner) =>
                prevSelectedOwner.includes(email)
                    ? prevSelectedOwner.filter((e) => e !== email)
                    : [...prevSelectedOwner, email]
            );
            setIsLoading(false);
        } else if (ownerType === 'friends') {
            try {
                const response = await axios.get(`/api/friends?page=1&itemsPerPage=30&user_1.email=${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const friendEmails = response.data['hydra:member'].map(friend => friend.user_2.email);
                setSelectedOwner((prevSelectedOwner) =>
                    prevSelectedOwner.some((e) => friendEmails.includes(e))
                        ? prevSelectedOwner.filter((e) => !friendEmails.includes(e))
                        : [...prevSelectedOwner, ...friendEmails]
                );
            } catch (error) {
                console.error('Error fetching friends:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSearchClick = () => {
        if (onSearch) {
            onSearch(searchInput, selectedTags, selectedOwner, selectedOwnerType);
        }
    };


    return (
        <div className="dream-search">
            <h2 className="search-title">Search by value</h2>
            <div className="dream-search-container">
                <input
                    className="searchTerm"
                    type="text"
                    value={searchInput}
                    onChange={handleInputChange}
                    placeholder="Search dreams..."
                />

            </div>
            <h2 className="search-title">Search by tags</h2>
            {allTags.length>0 ?
            <div className="tag-list">

                {allTags.map((tag) => (
                    <span
                        key={tag.id}
                        onClick={() => handleTagClick(tag.name)}
                        className={`tag search-choose ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
                    >
                        {tag.name}
                    </span>
                ))}
            </div>
                : <div className="tag-list">
                    <Audio height="50"
                           width="50"
                           radius="9"
                           color="#C9B4EC"
                           ariaLabel="three-dots-loading"
                           wrapperStyle
                           wrapperClass />
                </div>
            }
            <h2 className="search-title">Search by owner</h2>
            <div className="owner-list">

                {allOwner.map((owner, index) => (
                    <span
                        className={`search-choose tag ${selectedOwnerType.includes(owner) ? 'selected' : ''}`}
                        key={index}
                        onClick={() => handleOwnerClick(owner)}
                    >
                        {owner}
                    </span>
                ))}
            </div>
            <button disabled={isLoading} type="button" className="searchButton" onClick={handleSearchClick}>
                <span className="searchIcon">Search</span>
                <i className="fa fa-search search-icon"></i>
            </button>
        </div>
    );
};


// Main component for displaying filtered dreams
const DreamsList = () => {
    const [allTags, setAllTags] = useState([]);
    const [dreams, setDreams] = useState([]);
    const [filteredDreams, setFilteredDreams] = useState([]);
    const [isSearching, setIsSearching] = useState('initial');

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        axios.get('/api/tagss', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setAllTags(response.data['hydra:member']);
            setIsLoading(false)
        }).catch(error => {
            console.error('Error fetching tags:', error);
        });


    }, []);

    const UserDreamItem = ({dream}) => {
        const formattedDate = new Date(dream.date).toLocaleDateString('de-DE');
        return (

            <div className="dream-tile" onClick={() => {
                window.location.href = `/dreams/${dream["@id"].split("/").pop()}`
            }}>
                <h2 className="dream-title">{dream.title}</h2>
                <p className="dream-description">{dream.dream_content}</p>
                <span className="dream-date">{formattedDate}</span>
            </div>

        );
    };
    const handleSearch = async (searchInput, selectedTags, selectedOwners, selectedOwnersType) => {
        setIsSearching('searching');
        const token = localStorage.getItem('jwt');
        const params = {};
        if (searchInput != null) {
            params['title'] = searchInput;
        }

        // Add selectedTags as a filter
        if (selectedTags.length > 0) {
            params['tags.name[]'] = selectedTags;

        }

        // Add selectedOwners as a filter
        if (selectedOwners.length > 0) {
            params['owner.email[]'] = selectedOwners;

        }


        if (selectedOwnerType.includes('friends')) {
            params['privacy.privacy_name[]'] = '[PUBLIC, FOR FRIENDS]'
        } else
            params['privacy.privacy_name'] = 'PUBLIC';

        try {
            let response1 = await axios.get('/api/dreams', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: params,
            });

            if (searchInput != null) {
                params['title'] = '';
                params['dream_content'] = searchInput;

                let response2 = await axios.get('/api/dreams', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params,
                });
                const combinedDreams = [
                    ...response1.data['hydra:member'],
                    ...response2.data['hydra:member'].filter(
                        (dream2) => !response1.data['hydra:member'].some((dream1) => dream1['@id'] === dream2['@id'])
                    ),
                ];

                // Set the filteredDreams state with combined results
                setFilteredDreams(combinedDreams);
            } else {
                setFilteredDreams(response1.data['hydra:member']);
            }
        } catch (error) {
            console.error('Error searching dreams:', error);
        } finally {
            setIsSearching('done')
        }
    };

    return (

        <div className="dreams-list">
            <DreamSearch allTags={allTags} onSearch={handleSearch}/>

            {isSearching === 'initial' ? (
                <></> // or whatever you want to show when it's in the initial state
            ) : isSearching === 'searching' ? (
                <div className="searching">
                    <MagnifyingGlass
                        visible={true}
                        height="90"
                        width="90"
                        radius="9"
                        ariaLabel="magnifying-glass-loading"
                        wrapperStyle={{}}
                        wrapperClass="magnifying-glass-wrapper"
                        glassColor="#c0efff"
                        color="#3b5775"
                    />
                </div>
            ) : (
                <div className="dream-results">
                    {filteredDreams.length > 0 ? (
                        <>
                            <p>Results found: {filteredDreams.length}</p>
                            {filteredDreams.map((dream) => (
                                <UserDreamItem dream={dream} key={dream['@id'].split("/").pop()} />
                            ))}
                        </>
                    ) : (
                        <p>No results found</p>
                    )}
                </div>
            )}


        </div>

    );
};

createRoot(document.getElementById('root')).render(<DreamsList/>);
