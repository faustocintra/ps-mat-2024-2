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

controller.retrieveAll = async function (req,res){
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
controller.retrieveOne = async function (req,res){
    try {
        const result = await prisma.car.findUnique({
            where: {id: Number(req.params.id)}
    })
        // incontrou retorna HTTP 200 :OK (IMPLICITO)
       if(result)  res.send(result)
        // nao encocontrou retorna HTTP 404: NOT FOUND
       else res.status(404).end()

    }
    catch(error){
        console.error(error)

        //HTTP 500: Internal Server Error

        res.status(500).end()
    }
}

controller.update = async function (req,res) {
    try {
        const result = await prisma.car.update({
            where: {id : Number(req.params.id)},
            data: req.body
        })
        //encontrou e atualizou HTTP 204 : not content
        if (result)res.status(204).end()
        //nao encontrou (e nao atualizou ) HTTP 404 not found
        else res.status(404).end()
    }
    catch(error){
        console.error(error)

        //HTTP 500: Internal Server Error

        res.status(500).end()
    }    
}

controller.delete = async function (req,res) {
    try {
        await prisma.car.delete ({
            where: {id: Number(req.params.id)}
        })
        // encontrou e excluiu HTTP 204 no content
        res.status(204).end()
        
    }
    catch(error){
        if (error?.code ==='P2025'){
            // nao endcontrou NOT FOUND
            res.status(404).end()
        }
        else {
            // outros erros
            console.error(error)
            // HTTP 500 Internal Server Error
            res.status(500).end()
        }
    }  
    
}


export default controller 