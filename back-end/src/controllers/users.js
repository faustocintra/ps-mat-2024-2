import prisma from '../database/client.js'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const controller = {}

controller.create = async function (req, res) {
    try {
        if(req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 12)
        }

        await prisma.user.create({data: req.body})

        res.status(201).end()
    }
    catch(error) {
        console.error(error)

        res.status(500).end
    }
}

controller.retrieveAll = async function(req, res) {
    try {
        const result = await prisma.user.findMany({
            omit: {password: true}
        })

        res.send(result)
    }
    catch(error){
        console.error(error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.user.findUnique({
            omit: {password: true},
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

        if(req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 12)
        }

        const result = await prisma.user.update({
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
        await prisma.user.delete({
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

controller.login = async function (req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                OR: [
                    {username: req.body?.username},
                    { email: req.body?.email}
                ]
            }
        })

        if(! user) return res.status(401).end()

        const passwordIsValid = await bcrypt.compare(req.body?.password, user.password)

        if(! password) return res.status(401).end()

        const token = jwt.sign(
            user, 
            process.env.TOKEN_SECRET,
            { expiresIn: '24h'}
        )

        res.send({token, user})
    }
    catch(error){
        console.error(error)

        res.status(500).end()
    }
}

export default controller