import { Prisma } from '@prisma/client'
import prisma from '../database/client.js'
import bcrypt from 'bcrypt'
import webtoken from 'jsonwebtoken'

const controller = {} //Objeto vazio

controller.create = async function (req,res) {
    try{
        // Verificando se foi passado o campo "password"
        // Em caso afirmativo, criptografa a senha
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password, 12)
        }

        await prisma.user.create({data: req.body})

        //HTTP 201: Created
        res.status(201).end()
    }
    catch(error){
        console.error(error)

        //HTTP 500: Internal server error
        res.status(500).end()
    }
}

controller.retriveAll = async function (req, res) {
    try{
        const result = await prisma.user.findMany({
            omit: {password: true} //Não retornará o campo "password"
        })
        res.send(result).end()
    }   
    catch(error){
        console.error(error)

        //HTTP 500: Internal Server Error
        res.status(500).end()
    } 
}

controller.retriveOne = async function(req, res) {
    try{
        const result = await prisma.user.findUnique({
            omit: {password: true}, //Não retornará o campo "password"
            where: {id: Number(req.params.id)}
        })

        //Encontrou -> retorna HTTP 200: OK (implícito)
        if(result) res.send(result).end()
        //Não Encontrou -> retorna HTTP 404: Not Found
        else res.status(404).end()
    }
    catch(error){
        console.error(error)

        //HTTP 500: Internal Server Error
        res.status(500).end()
    } 
}

controller.update = async function(req,res) {
    try{
        // Verificando se foi passado o campo "password"
        // Em caso afirmativo, criptografa a senha
        if(req.body.password){ 
            req.body.password = await bcrypt.hash(req.body.password, 12)
        }
        const result = await prisma.user.update({
            where: {id: Number(req.params.id)},
            data: req.body
        })

        //Encontrou e atualizou -> HTTP 204: No Content
        if(result) res.status(204).end()
        //Não encontrou(e não atualizou) -> HTTP 404: Not Found
        else res.status(404).end() 
    }
    catch(error){
        console.error(error)

        //HTTP 500: Internal Server Error
        res.status(500).end()
    }
}

controller.delete = async function(req,res){
    try{
        const result = await prisma.user.delete({
            where: {id: Number(req.params.id)}
        })

        //Encontrou e excluiu -> HTTP 204: No Content
        res.status(204).end()
    }    
    catch(error){
        if(error?.code === 'P2025'){
            //Não encontrou e não excluiu -> HTTP 404: Not Found
            res.status(404).end()
        }
        else{
            console.error(error)

            // HTTP 500 -> Internal Server Error
            res.status(500).end()
        }
    }

    controller.login = async function(req,res) {
        try{
            // Busca usuário no Banco de Dados usando o valor dos campos
            //"user" e "password"
            const user = await prisma.user.findUnique({
                where:{
                    OR:
                        [
                            {username:req.body?.username},
                            {email: req.body?.email}
                        ]
                }
            })

            // Se o usuário não for encontrado, retorna
            //HTTP 401: Unauthorized
            if(!user) return res.status(401).end()

            // Usuário encontrado, vamos conferir a senha
            const validPassword = await bcrypt.compare(req.body?.password, user.password)

            //Se a senha estiver errada, retorna
            //HTTP 401: Unauthorized
            if(!validPassword) return res.status(401).end()
            
            //Usuário e senha ok, passamos ao procedimento de gerar o token
            const token = webtoken.sign(
                user,                       //Dados do usuário
                process.env.TOKEN_SECRET,   //Senha para criptografar o token
                {expiresIn: '24h'}          //Prazo de validade do token
            )

            //Retorna o token e o usuário autenticado
            res.send({token, user})
        }
        catch(error){
            console.error(error)
            
            //HTTP 500: Internal Server Error
            res.status(500).end()
        }
    }
}

export default controller