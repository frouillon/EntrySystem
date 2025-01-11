import { Router } from "express";
import { createRegister, getRegister } from '../controllers/records.controller.js';

const router = Router();


router.get('/registros', getRegister);
router.post('/createRegister', createRegister);


export default router;
