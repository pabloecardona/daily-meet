import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [muted, setMuted] = useState(false)

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = trackMap => Array.from(trackMap.values())
  .map(publication => publication.track)
  .filter(track => track !== null);

  useEffect(() => {
    const trackSubscribed = track => {
      if (track.kind === 'video') {
        setVideoTracks(videoTracks => [...videoTracks, track]);
      } else {
        setAudioTracks(audioTracks => [...audioTracks, track]);
        //track.on('enabled', () => setMuted(false))
        //track.on('disabled', () => setMuted(true))
      }
    };

    const trackUnsubscribed = track => {
      if (track.kind === 'video') {
        setVideoTracks(videoTracks => videoTracks.filter(v => v !== track));
      } else {
        setAudioTracks(audioTracks => audioTracks.filter(a => a !== track));
      }
    };

    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);


  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      audioTrack.isEnabled ? setMuted(false) : setMuted(true) ;
      audioTrack.on('enabled', () => setMuted(false))
      audioTrack.on('disabled', () => setMuted(true))
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);



  return (
    <div className="participant">
      <video className='video--local' ref={videoRef} autoPlay={true}> 
      </video>
      <div className="participant--info">
        {muted ? 
          <FontAwesomeIcon className='muteIcon' icon={faMicrophoneSlash} /> 
        :
          <FontAwesomeIcon className='muteIcon hidden' icon={faMicrophoneSlash} /> 
        }
        <p className='name'>{participant.identity}</p>
      </div>
      <audio ref={audioRef} autoPlay={true} muted={false} />
    </div>
  );

};

export default Participant;