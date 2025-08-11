import express, { Request, Response } from 'express';
import { AccessToken } from 'livekit-server-sdk';

const liveKitRouter = express.Router()

const createToken = async (roomName:string,participantName:string) => {
  // If this room doesn't exist, it'll be automatically created when the first
  // participant joins
  // Identifier to be used for participant.
  // It's available as LocalParticipant.identity with livekit-client SDK

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: '10m',
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};


liveKitRouter.get('/getToken', async (req:Request, res:Response) => {
  const { roomName, userName } = req.query;
  if(!roomName || !userName || typeof roomName != "string" || typeof userName != "string"){
    res.status(400).json({message:"Username and room name required."});
    return;
  }
  const token = await createToken(roomName,userName);
  res.status(200).json({token});
});

export default liveKitRouter;