import { Router } from "express";
import { pool } from '../db.js';
import { getCards , getFreeCards , getCard} from '../controllers/cards.controller.js';

const router = Router();

router.get('/cards', getCards);

//? obtener tarjeta relacionada al usuario
router.get('/card/:idUsuario', getCard);

router.get("/free-cards", getFreeCards);




export default router;