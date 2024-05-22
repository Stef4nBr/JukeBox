import React, { useState } from 'react';
import shortid from 'shortid';

const Redirect = ({ url, collection }) => {

    const [newUser, setNewUser] = useState(null);
    
    let uuid = window.crypto.randomUUID();
    
    const handleClick = () => {
        window.location.href = url;
        
        collection.insert({
            id: shortid.generate(),
            name: url,
            user: newUser,
            created: new Date().toISOString(),
            uuid: uuid
        })
        localStorage.setItem('user', JSON.stringify(uuid));
    };
    
    const handleInputChange = (e) => {
        setNewUser(e.target.value);
    };

    
    return (
        <div>
            <input
                type="text"
                name="message"
                placeholder="Enter user name"
                onChange={handleInputChange}
                value={newUser || ''}
                required // This makes the input mandatory
            />
            <button onClick={handleClick} disabled={!newUser}>
                Submit
            </button>
        </div>
    );
};

export default Redirect;
