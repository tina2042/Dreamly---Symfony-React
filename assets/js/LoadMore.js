import React from 'react';
import axios from 'axios';
import {BeatLoader} from "react-spinners";

export default class LoadMore extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            hasMore: true,
            currentPage: 1,

        };
    }
    handleLoadMore = () => {
        const token = localStorage.getItem("jwt");
        const ownerEmails = this.props.friendsEmails

        if(ownerEmails.length>0) {
            const nextPage = this.state.currentPage + 1;

            this.setState({ isLoading:  true });
            axios.get('/api/dreams', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/ld+json'
                },
                params: {
                    'owner.email[]': ownerEmails,
                    'privacy.privacy_name[]': ['PUBLIC', 'FOR FRIENDS'],
                    'order[date]': 'desc',
                    'order[id]': 'desc',
                    'itemsPerPage': 5,
                    'page': nextPage

                }
            }).then((response) => {
                this.setState({ currentPage: nextPage });
                if(!("hydra:next" in response.data["hydra:view"])){
                    this.setState({hasMore: false});
                }
                this.props.handleMoreDreams(response.data["hydra:member"])

            }).catch(error => {
                if(error.response.data.code===401){
                    window.location.replace("/logout");
                    console.error("User not authenticated or email missing in localStorage");
                    alert("Your session is expired");
                } else
                    console.error(error);

            }).finally(() => {
                this.setState({isLoading:  false});
            });

        }
    }
    render() {
        const {hasMore, isLoading}=this.state
        return(
            <>
        {hasMore && (
            <button className="load-more" onClick={this.handleLoadMore}>
                {isLoading ? (
                    <BeatLoader />
                ) : (
                    <span>Load more</span>
                )}
            </button>
        )}</>)
    }
}