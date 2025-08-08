import express, { Request, Response } from 'express';
const apiRouter = express.Router();

apiRouter.get("/test",(req:Request,res:Response)=>{
    res.status(200).json({message:"This is a test route"});
})

export default apiRouter;