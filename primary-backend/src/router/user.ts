import { Router } from "express";
import { authMiddleware } from "../middleware";
import { SigninSchema,SignupSchema } from "../types";
import { JWT_SECRECT } from "../config";
import  jwt  from "jsonwebtoken";
import { prismaClient } from "../db";

const router=Router();

router.post("/signup",async(req,res)=>{
    const body=req.body;
    const parseData=SignupSchema.safeParse(body);

    if(!parseData.success){
        return res.status(411).json({
            message:"Incorrect Inputs"
        })
    }
    

    const userExits=await prismaClient.user.findFirst({
        where:{
            email:parseData.data.username
        }
    });

    if(userExits){
        return res.status(403).json({
            message:"User already exists"
        })
    }

    await prismaClient.user.create({
        data:{
           email:parseData.data.username,
           password:parseData.data.password,
           name:parseData.data.name
        }
    })

    return res.json({
        message:"Please verify your account!"
    })
})

router.post("/signin",async(req,res)=>{
    const body=req.body;
    const parseData=SigninSchema.safeParse(body)

      if (!parseData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user=await prismaClient.user.findFirst({
        where:{
            email:parseData.data.username,
            password:parseData.data.password
        }
    })

    if(!user){
        return res.status(403).json({
            message:"Sorry credentials are inncorrect"
        })
    }

    const token=jwt.sign({
        id:user.id
    },JWT_SECRECT)

    res.json({
        token:token
    })
})

router.get("/",authMiddleware,async(req,res)=>{
    //TODO:Fix the type
    //@ts-ignore
        const id=req.id
        const user=await prismaClient.user.findFirst({
            where:{
                id
            },
            select:{
                email:true,
                name:true
            }
        });

        return res.json({
            user
        })
})

export const userRouter=router;