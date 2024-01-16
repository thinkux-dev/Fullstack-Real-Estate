import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// Create user handler
export const createUser = asyncHandler(async (req, res) => {
    console.log("creating a user");

    let { email } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists) {
        const user = await prisma.user.create({ data: { email } });

        res.send({
            message: "User registered successfully",
            user: user,
        });
    } else {
        res.status(201).send({ message: `user with ${email} already exist` });
    }
});

// Create bookVisit user handler
export const bookVisit = asyncHandler(async (req, res) => {
    const { email, date } = req.body;
    const { id } = req.params;

    try {
        const alreadyBooked = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true },
        });

        if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
            res.status(400).json({
                message: "You already booked a visit to this residency",
            });
        } else {
            await prisma.user.update({
                where: { email },
                data: {
                    bookedVisits: { push: { id, date } },
                },
            });
        }
        res.send("You successfully booked a visit");
    } catch (err) {
        throw new Error(err.message);
    }
});

// Get All Bookings handler
export const getAllBookings = asyncHandler(async (req, res) => {
  const {email} = req.body
  try{
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true }
    })
    res.status(200).send(bookings)

  } catch(err) {
    throw new Error(err.message);
  }
})

// Cancel Booking handler
export const cancelBooking = asyncHandler(async (req, res) => {

  const {email} = req.body
  const { id } = req.params;
  try{

    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true }
    })
    
    const visitIndex = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (visitIndex === -1) {
      res.status(404).json({message: "Booking not found"});
    } else {
      // Remove the booked visit
      user.bookedVisits.splice(visitIndex, 1);

      // Save the updated user record
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits
        },
      })

      res.send("Booking canceled successfully");
    }

  } catch(err) {
    console.error(err);
    res.status(500).json({message: 'Failed to cancel booking'});
  }
});

// Favourite user residency handler
export const toFav = asyncHandler(async(req, res) => {
  const {email} = req.body;
  const {resId} = req.params;

  try{

    const user = await prisma.user.findUnique({
      where: {email}
    })

    if (user.favResidenciesID.includes(resId)){
      // Remove from favourite list
      const updateUser = await prisma.user.update({
        where: {email},
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== resId)
          }
        }
      })

      res.send({message: "Removed from favorites", user: updateUser})
    } else {
      // Add to favourite list
      const updateUser = await prisma.user.update({
        where: {email},
        data: {
          favResidenciesID: {
            push: resId
          }
        }
      })

      res.send({message: "Updated favorites", user: updateUser})
    }

  } catch(err) {
    throw new Error(err.message);
  }
})

// All Favourite user residency handler
export const getAllFavorites = asyncHandler(async(req, res) => {
  const {email} = req.body;
  try{
    const favResd = await prisma.user.findUnique({
      where: {email},
      select: {favResidenciesID: true}
    })
    res.status(200).send(favResd)

  } catch(err) {
    throw new Error(err.message);
  }
})