import { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';  
import logo from './logo.png'

const Room = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)

  const handleMute = () => {
    setMuted(prevMuted => !prevMuted)
  }
  const handleVideoOff = () => {
    setVideoOff(prevVideoOff => !prevVideoOff)
  }

  
  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant}/>
  ));

  useEffect(() => {
    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };
    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName
    })
    .then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    }, error => {
        console.error(`Unable to connect to Room: ${error.message}`);
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  },[roomName, token]);


if(room){

  if(muted){
    room.localParticipant.audioTracks.forEach(({track}) => {
      track.disable();
    })
  } 
  else{
    room.localParticipant.audioTracks.forEach(({track}) => {
      track.enable();
    })
  }

  if(videoOff){
    room.localParticipant.videoTracks.forEach(({track}) => {
      track.disable();
    })
  } 
  else{
    room.localParticipant.videoTracks.forEach(({track}) => {
      track.enable();
    })
  }
}

  return (
    <div className="room">
      <div className="participants">
        {remoteParticipants}
        {room ? (
          <Participant key={room.localParticipant.sid} participant={room.localParticipant}/>
        ) : (
          ''
        )}
      </div>
      <nav className='controls'>
        <h2>{roomName}</h2>
        <div className='buttons'>
          {muted ? 
          <button className='button disabled' onClick={handleMute}> 
            <FontAwesomeIcon  icon={faMicrophoneSlash} /> 
          </button>
          : 
          <button className='button' onClick={handleMute}>
            <FontAwesomeIcon icon={faMicrophone} />
          </button>}

          {videoOff ? 
          <button className='button disabled' onClick={handleVideoOff}> 
            <FontAwesomeIcon icon={faVideoSlash} />
          </button>
          :
          <button className='button' onClick={handleVideoOff}> 
            <FontAwesomeIcon icon={faVideo} />
          </button>
          }
          <button className='button disabled wide' onClick={handleLogout}><FontAwesomeIcon icon={faPhoneAlt} transform={{ rotate: 225 }}/></button>
        </div>
        <img src={logo} alt='daily meet logo'></img>
      </nav>
    </div>
  );
};

export default Room;