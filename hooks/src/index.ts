import express from "express"
import { PrismaClient } from "@prisma/client"

const app = express();
const port=3000;
app.use(express());

const client=new PrismaClient();

//http://hooks.zapier.com/hooks/catch/123342/432342
app.post("/hooks/catch/:userId/:zapId",async(req,res)=>{
    const userId=req.params.userId;
    const zapId=req.params.zapId;
    const body=req.body

    //store in db a new trigger
    await client.$transaction(async tx=>{
        const run=await tx.zapRun.create({
            data:{
                zapId:zapId,
                metadata:body
            }
        });
        await tx.zapRunOutbox.create({
            data:{
                zapRunId:run.id
            }
        })
    })
    res.json({
        message:"Message received"
    })
})

app.listen(port,()=>{
    console.log(`Server running on PORT ${port}`)
})