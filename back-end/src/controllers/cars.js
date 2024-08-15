import prisma from '../database/client.js'

const controller = {}

controller.create = async function (req, res) {
    try {
        await prisma.car.create({data: req.body})

        res.status(201).end()
    }
    catch(error) {
        console.error(error)

        res.status(500).end
    }
}

controller.retrieveAll = async function(req, res) {
    try {
        const result = await prisma.car.findMany()

        res.send(result)
    }
    catch(error){
        console.error(error)

        res.status(500).end()
    }
}


export default controller