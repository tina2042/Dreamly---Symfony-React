import React from 'react';

function SearchResults({ results, isSearching, isFocused, addFriend }) {
    return (
        <div className="search-results">
            <ul id="search-result-item" className="search-result-list" >
                {isSearching ? (
                    <li className="search-result-item-wrapper searching">Loading...</li>
                ) : (
                    isFocused &&
                    (results.length === 0 ? (
                        <li className="search-result-item-wrapper no-results">User not found</li>
                    ) : (
                        results.map((user) => (

                            <li
                                className="search-result-item-wrapper"
                                key={user.id}
                                onClick={() => {
                                    addFriend(user.id);
                                    console.log("dupsko")
                                }}
                            >
                                <div className="search-result-item">
                                    <img src={user.photo} alt={`${user.name} ${user.surname}`} />
                                    <span>
                                        {user.name} {user.surname}
                                    </span>
                                </div>
                            </li>
                        ))
                    ))
                )}
            </ul>
        </div>
    );
}

export default SearchResults;
