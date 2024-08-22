import prisma from '../database/client.js';

const controller = {}   // Objeto vazio

controller.create = async function(req, res) {
    try {
        await prisma.car.create({data: req.body});
        
        // HTTP 201 Created
        res.status(201).end();
    }
    catch (error) {
        console.error(error);
        
        // HTTP 500 Internal Server Error
        res.status(500).end();
    }
}

controller.retriveAll = async function(req, res) {
    try {
        const cars = await prisma.car.findMany();
        
        // HTTP 200 OK
        res.status(200).json(cars);
    }
    catch (error) {
        console.error(error);
        
        // HTTP 500 Internal Server Error
        res.status(500).end();
    }
}

controller.retrieveOne = async function(req, res) {
    try {
      const result = await prisma.car.findUnique({
        where: { id: Number(req.params.id) }
      })
  
      // Encontrou ~> retorna HTTP 200: OK (implícito)
      if(result) res.send(result)
      // Não encontrou ~> retorna HTTP 404: Not Found
      else res.status(404).end()
    }
    catch(error) {
      console.error(error)
  
      // HTTP 500: Internal Server Error
      res.status(500).end()
    }
  }
  
  controller.update = async function(req, res) {
    try {
      const result = await prisma.car.update({
        where: { id: Number(req.params.id) },
        data: req.body
      })
  
      // Encontrou e atualizou ~> HTTP 204: No Content
      if(result) res.status(204).end()
      // Não encontrou (e não atualizou) ~> HTTP 404: Not Found
      else res.status(404).end()
    }
    catch(error) {
      console.error(error)
  
      // HTTP 500: Internal Server Error
      res.status(500).end()
    }
  }
  
  controller.delete = async function(req, res) {
    try {
      await prisma.car.delete({
        where: { id: Number(req.params.id) }
      })
  
      // Encontrou e excluiu ~> HTTP 204: No Content
      res.status(204).end()
    }
    catch(error) {
      if(error?.code === 'P2025') {
        // Não encontrou e não excluiu ~> HTTP 404: Not Found
        res.status(404).end()
      }
      else {
        // Outros tipos de erro
        console.error(error)
  
        // HTTP 500: Internal Server Error
        res.status(500).end()
      }
    }
  }
  
export default controller; // Exporta o objeto vazio