import prisma from '../database/client.js'

const controller = {} //objeto vazio

controller.create = async function(req, res) {
    try{
        await prisma.car.create({data: req.body})

        // http 201: created
        res.status(201).end()
    }
    catch(error){
        console.error(error)

        //http 500: internal server error
        res.status(500).end()
    }
}

export default controller