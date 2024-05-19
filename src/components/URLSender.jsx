import React from 'react';
import { addRxPlugin } from 'rxdb';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBUpdatePlugin);

const URLSender = ({ document }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newUrl = formData.get('url');
    const newMessage = formData.get('message');

    //  addUrl(newUrl, newMessage);
    var name = document.get('name'); 
    console.log('update .. ',document , name)
    await document.update({
      $push: {
        urls: {
          url: newUrl,
          description: '',
          messege: newMessage,
          added: new Date().toISOString()
        }
      }
    }).then(()=>{
      event.target.reset();
    });

  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="url" placeholder="Enter URL" />
      <input type="text" name="message" placeholder="Enter message" />
      <button type="submit">Add URL</button>
    </form>
  );
};

export default URLSender;
