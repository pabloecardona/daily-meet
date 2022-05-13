const twilio = require("twilio");
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;


exports.handler = function(context, event, callback) {
  const TWILIO_ACCOUNT_SID = context.TWILIO_ACCOUNT_SID;
  const TWILIO_API_KEY_SID = context.TWILIO_API_KEY_SID;
  const TWILIO_API_KEY_SECRET = context.TWILIO_API_KEY_SECRET;

  //const AccessToken = require('twilio').jwt.AccessToken;
  /* const VideoGrant = AccessToken.VideoGrant;
  
  // enable client to use video, only for this room 
  const videoGrant = new VideoGrant({
      room: event.room
  });

  const accessToken = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET);
  
  accessToken.addGrant(videoGrant); //Add the grant to the token
  accessToken.identity = event.identity; */
  
  const accessToken = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET);

  const videoGrant = new VideoGrant({
    room: event.room
  });

  accessToken.addGrant(videoGrant);
  accessToken.identity = event.identity;


  const response = new Twilio.Response();

   response.appendHeader('Access-Control-Allow-Origin', '*');
   response.appendHeader('Access-Control-Allow-Methods', 'GET');
   response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

   response.appendHeader('Content-Type', 'application/json');
  response.setBody({ token: accessToken.toJwt() });

  callback(null, response );  
};