import prisma from "../database/client.js";

const controller = {} // objeto vazio

controller.create = async function (req,res){
    try{
        await prisma.car.create({data:req.body})
        // HTTP 201: Created
        res.status(201).end()
    } 
    catch(error){
        console.error(error)
        //HTTP 500: Internal Server Error
        res.status(500).end() 
    }   
}

controller.retrievall = async function (req,res){
    try {
        const result = await prisma.car.findMany()
        // HTTP 200 :OK (IMPLICITO)
        res.send(result)

    }
    catch(error){
        console.error(error)

        //HTTP 500: Internal Server Error

        res.status(500).end()
    }
}

export default controller 