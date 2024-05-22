import React, { useEffect, useState, useRef } from 'react';
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom"
import PlayerContainer from './components/PlayerContainer';
import URLSender from './components/URLSender';
import Home from './components/Home';
import Sync from './components/Sync';
import { generate } from "random-words";
import { useRxQuery, useRxCollection, useRxData } from 'rxdb-hooks';
import Redirect from './components/Redirect'; // Assuming RedirectButton.js is in the same directory


const App = () => {
  // 404 component
  const NotFound = () => {
    return <h1>404 - Not Found</h1>;
  };
  const urlcoll = useRxCollection('urlcollection');

  const { result: urlRecords, isFetching } = useRxData(
    // the collection to be queried
    'urlcollection',
    // a function returning the query to be applied
    collection =>
      collection.find()
  );

  if (isFetching) {
    return 'loading ...';
  }

  function generateUrl() {
    const urlPath = generate({ minLength: 6, maxLength: 6, exactly: 1 })

    return urlPath[0]
  }

  //urlcollection.destroy();


  
/* ... add routes from below */

  return (
    <BrowserRouter>
      <Routes>
        {urlRecords.forEach(url => {
          console.log('new url .. ', url)
        })}

        {urlRecords.map((path, index) =>
          <Route path={path.name} element={<Home />} key={index} />
        )}
        <Route path="/" element={<Redirect url={"/" + generateUrl()} collection={urlcoll} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/player" element={<PlayerContainer />} />
        <Route path="/urlsender" element={<URLSender />} />
        <Route path="/sync" component={<Sync />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};



export default App;
