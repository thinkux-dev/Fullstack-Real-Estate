import asyncHandler from 'express-async-handler'
import {prisma} from '../config/prismaConfig.js'

// Create residency handler
export const createResidency = asyncHandler(async (req, res) => {
  const {title, description, price, address, city, country, image, facilities, userEmail} = req.body.data;

  console.log(req.body.data)
  try{
    const residency = await prisma.residency.create({
      data: {
        title, 
        description, 
        price, 
        address, 
        city, 
        country, 
        image, 
        facilities,  
        owner : {connect : {email: userEmail}}
      }
    });
    res.send({message: "Residency created sucessfully", residency})

  } catch(err){
    if(err.code === "P2002"){
      throw new Error("A residency with this address exists already")
    } else {
      throw new Error(err.message)
    }
  }
});

// Get All Residencyhandler
export const getAllResidencies = asyncHandler(async (req, res) => {

  try{
    const residencies = await prisma.residency.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
    res.send(residencies)

  } catch(err) {
    res.status(402).send({message: 'Failed to fetch residencies'})
  }
})

// Get a single Residencyhandler
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try{
    const residency = await prisma.residency.findUnique({
      where: {id}
    })
    res.send(residency)

  } catch(err) {
    res.status(404).send({message: 'Residency not found'})
  }
})