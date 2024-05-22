import React, { useState } from 'react';

const UserPrompt = ({ userNameValue }) => {

    const [userName, setUserName] = useState(null);


    const handleClick = () => {

        if (userName) {
            userNameValue(userName)
        }
    };

    const handleInputChange = (e) => {
        setUserName(e.target.value);
    };


    return (
        <div>
            <input
                type="text"
                name="message"
                placeholder="Enter user name"
                onChange={handleInputChange}
                value={userName || ''}
                required // This makes the input mandatory
            />
            <button onClick={handleClick} disabled={!userName}>
                Enter User Name or Email
            </button>
        </div>
    );
};

export default UserPrompt;
