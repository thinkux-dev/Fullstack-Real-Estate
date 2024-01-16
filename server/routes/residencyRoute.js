import express from 'express';
const router = express.Router();
import { createResidency } from '../controllers/residencyCntrl.js';
import { getAllResidencies } from '../controllers/residencyCntrl.js';
import { getResidency } from '../controllers/residencyCntrl.js';
import jwtCheck from '../config/auth0Config.js';

router.post("/create", jwtCheck, createResidency);
router.get("/allresd", getAllResidencies);
router.get("/:id", getResidency);

export {router as residencyRoute}