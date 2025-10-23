import { NextFunction,Request,Response } from "express";
import jwt  from "jsonwebtoken";
import { JWT_SECRECT } from "./config";


export function authMiddleware(req:Request,res:Response,next:NextFunction){
    //as unknown as string means, forcefully converting the token into the string
        const token=req.headers.authorization as unknown as string

        try{
            const payload=jwt.verify(token,JWT_SECRECT)
            //@ts-ignore
            req.id=payload.id
            next();
        }catch(e){
            return res.status(403).json({
                message:"You are not logged in"
            })
        }
}