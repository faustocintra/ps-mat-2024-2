import prisma from "../database/client";

const controller = {}; // Objeto vazio

controller.create = async function (req, res) {
  try {
    await prisma.car.create({ data: req.body });

    // HTTP 201: Created
    res.status(201).end();
  } catch (error) {
    console.error(error);

    // HTTP 500: Internal Server Error
    res.status(500).end();
  }
};

export default controller;
