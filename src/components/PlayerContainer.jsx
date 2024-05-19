import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { addRxPlugin } from 'rxdb';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBUpdatePlugin);

const PlayerContainer = ({ urlItem, internalPlayer , endOfTrack }) => {

  const [currentTitle, setTitle] = useState(null);
  const playerRef = useRef(null);

  const logInternalPlayer = () => {
    const internalPlayerInstance = playerRef?.current?.getInternalPlayer();
    if (internalPlayerInstance) {
      setTitle(internalPlayerInstance.videoTitle);
     
    }
  };

  const onEnd = () => {
    console.log('Track ended !!')
    endOfTrack();
  };

  useEffect(() => {
    internalPlayer(currentTitle);
  }, [playerRef, currentTitle])


  if (!urlItem) {
    return (
      <div className="player-container">
        <div className='player-wrapper'>
          <p>No video added !</p>
        </div>
      </div>
    )
  }

  console.log('player ..', urlItem)

  return (
    <div className="player-container">
      <div className='player-wrapper' >
        <ReactPlayer
          className='react-player'
          url={urlItem.url}
          controls={true}
          playing={true}
          width='100%'
          height='100%'
          ref={playerRef}
          onPlay={logInternalPlayer}
          onEnded={onEnd}
        />


      </div>
    </div>
  );
};

export default React.memo(PlayerContainer);
