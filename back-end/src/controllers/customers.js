import prisma from '../database/client.js'
import { Prisma } from '@prisma/client'

const controller = {}

controller.create = async function (req, res) {
    try {
        await prisma.customer.create({data: req.body})

        res.status(201).end()
    }
    catch(error) {
        console.error(error)

        res.status(500).end
    }
}

controller.retrieveAll = async function(req, res) {
    try {
        const result = await prisma.customer.findMany()

        res.send(result)
    }
    catch(error){
        console.error(error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.customer.findUnique({
            where: {id: Number(req.params.id)}
        })

        if (result) res.send(result)
        else res.status(404).end()
    }
    catch(error) {
        console.error(error)

        res.status(500).end()
    }
}

controller.update = async function (req, res) {
    try {
        const result = await prisma.customer.update({
            where: { id: Number(req.params.id) },
            data: req.body
        })

        if(result) res.status(204).end()

        else res.status(404).end()
    }
    catch(error) {
        console.error(error)

        res.status(500).end()
    }
    
}

controller.delete = async function (req, res) {
    try {
        await prisma.customer.delete({
            where: {id: Number(req.params.id)}
        })

        res.status(204).end()
    }
    catch(error){
        if(error?.code === 'P2025') {
            res.status(404).end()
        }
        else{
            console.error(error)
            
            res.status(500).end()
        }
    }
}

export default controller