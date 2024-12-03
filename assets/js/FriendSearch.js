import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchResults from './SearchResults'; // Import the standalone component

function FriendSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [didSearch, setDidSearch] = useState(false);

    const addFriend = (userId) => {
        const token = localStorage.getItem('jwt');
        if (window.confirm("Are you sure you want to add this friend?")) {
            axios
                .post(
                    '/api/friends/add',
                    { user_id: userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/ld+json',
                        },
                    }
                )
                .then((response) => {
                    if (response.status === 200) {
                        alert('Friend added successfully!');
                    }
                })
                .catch((error) => {
                    console.error('Error adding friend:', error);
                    alert('Failed to add friend.');
                })
                .finally(()=>{
                    setIsFocused(false);
                });
        } else {
            setIsFocused(false);
        }
    };

    useEffect(function debounceQuery() {
        const delayInputTimeoutId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return function cleanup() {
            clearTimeout(delayInputTimeoutId);
        };
    }, [searchQuery]);

    useEffect(
        function fetchSearchResults() {
            if (debouncedSearchQuery.length >= 3) {
                searchFriends(debouncedSearchQuery);
            } else {
                setSearchResults([]);
                setIsSearching(false);
            }
        },
        [debouncedSearchQuery]
    );

    function searchFriends(query) {
        setDidSearch(true);
        setIsSearching(true);
        const token = localStorage.getItem('jwt');

        axios
            .post(
                '/api/search',
                { query },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/ld+json',
                    },
                }
            )
            .then((response) => {
                setSearchResults(response.data);
            })
            .catch((error) => {
                console.error('Error searching friends:', error);
            })
            .finally(() => {
                setIsSearching(false);
            });
    }

    useEffect(() => {
        const searchEle = document.querySelector('#search-friend-element');
        document.querySelector('body').addEventListener('click', e=>{
            if(!searchEle.contains(e.target)){
                setIsFocused(false);
            }
        });
    }, []);

    return (
        <div id="search-friend-element" className="search">
            <div>
                <input
                    type="text"
                    className="searchTerm"
                    placeholder="Find more friends"
                    value={searchQuery}
                    onChange={(e) => {
                        setIsFocused(true);
                        setSearchQuery(e.target.value);
                    }}
                    onFocus={() => setIsFocused(true)}
                    // onBlur={() => setTimeout(()=>setIsFocused((false), 500))}
                />
                <button
                    type="button"
                    className="searchButton"
                    onClick={() => searchFriends(searchQuery, )}
                >
                    <i className="fa fa-search search-icon"></i>
                </button>
            </div>
            {
                didSearch &&
                <SearchResults
                    results={searchResults}
                    isSearching={isSearching}
                    isFocused={isFocused}
                    addFriend={addFriend}
                />
            }
        </div>
    );
};

export default  FriendSearch;
