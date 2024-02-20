import express from 'express';
import { GetTodo, AddTodo, PostAddTodo, DeleteTodo } from '../controller/todo';

const router = express.Router();

router.get('/', GetTodo);
router.get('/add', AddTodo);
router.post('/add', PostAddTodo);
router.get('/delete:id', DeleteTodo)
router.delete('/delete:id', DeleteTodo);

export default router;
