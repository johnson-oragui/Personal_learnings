import express from 'express';
import { GetTodo } from '../controller/todo';

const router = express.Router();

router.get('/', GetTodo);

export default router;
