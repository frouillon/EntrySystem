import { Router } from "express";
import { createUser, deleteUser, getUsers, updateUser, getUserCard} from "../controllers/users.controller.js";

const router = Router();

router.get('/users', getUsers);

router.get('/users/:codigo_card', getUserCard);

router.post('/users', createUser);

router.put('/users', updateUser);

router.delete('/users', deleteUser);



export default router;