import primsa from '../database/client.js'

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

export default controller