import {Audio} from "react-loader-spinner";
import React from "react";

const Message = ({ message, isLoading }) => {
    return (
        <div className="top">
            {isLoading && (
                <Audio
                    height="50"
                    width="50"
                    radius="9"
                    color="#263238"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            )}
            {message!=="" && (
            <h4>{message}</h4>)
            }
        </div>
    );
};

export default Message;