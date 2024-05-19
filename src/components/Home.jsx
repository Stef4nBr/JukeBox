import React, { useState, useEffect } from 'react';
import ListItems from './ListItems';
import { useRxData } from 'rxdb-hooks';
import URLSender from './URLSender';
import PlayerContainer from './PlayerContainer';
import { addRxPlugin } from 'rxdb';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import UserPrompt from './UserPrompt';
addRxPlugin(RxDBUpdatePlugin);

const Home = () => {

  const [currentUrlItem, setUrlItem] = useState(null);
  const [playingNow, setPlayerInstance] = useState(null);
  const [userName, setUserNameValue] = useState(null);
  const [autohorizedUser, setAuthorizedUser] = useState(false);
  

  const { result: document, isFetching } = useRxData(
    // the collection to be queried
    'urlcollection',
    // a function returning the query to be applied
    collection =>
      collection.findOne({
        selector: { name: window.location.pathname },
        sort: [
          // { added: 'asc' }
        ]
      })
  );

  useEffect(() => {
    const autohorizedUser = JSON.parse(localStorage.getItem('user'));
    if (autohorizedUser === document[0]?.uuid || userName === document[0]?.user) {
      setAuthorizedUser(true);
    }
  }, [isFetching]);


  const onEnd = () => {
    console.log('Track ended !!')
    let index = document[0].urls.findIndex(item => item.url === currentUrlItem.url);
    let nextIndex = index + 1;

    // Ensure nextIndex is within bounds of the array
    if (nextIndex < document[0].urls.length) {
      setUrlItem(document[0].urls[nextIndex])
    }
  };

  useEffect(() => {
    if (!document[0] || !playingNow) {
      console.log('return')
      return
    }
    let index = document[0].urls.findIndex(item => item.url === currentUrlItem.url);
    document[0].update(
      {
        $set: {
          [`urls.${index}.description`]: playingNow,
          [`urls.${index}.lastPlayed`]: new Date().toISOString(),
        }

      });
    console.log('currentUrlItem has changed ...')
    setPlayerInstance(null)
  }, [currentUrlItem, playingNow]); // Specify currentUrl in the dependency array


  if (isFetching) {
    return 'loading ...';
  }

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        {/* Left part (20% width) */}
        <div className="col-sm-4 bg-light p-0 overflow-auto">
          {/* <URLSender document={document[0]} /> */}
          {autohorizedUser ? <URLSender document={document[0]} /> : <div>User is not logged in!</div>}
          <div className="list-group" style={{ maxHeight: '200px' }}>
            <ListItems getUrlFromListItem={setUrlItem} urls={document[0].urls} currentUrlItem={currentUrlItem} />
            {/* {console.log(document[0].urls)} */}
          </div>
        </div>

        {/* Right part (80% width) */}
        <div className="col-sm-8 p-0">
          {/* Your content for the right part */}
          {autohorizedUser ? <PlayerContainer internalPlayer={setPlayerInstance} urlItem={currentUrlItem}
            endOfTrack={onEnd} /> : <UserPrompt userNameValue={setUserNameValue} />}

        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);