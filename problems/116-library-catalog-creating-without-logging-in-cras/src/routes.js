import { Router } from 'express';
import { requireAuth } from './middleware.js';
import { listItems, myItems, getItem, createItem, updateItem, deleteItem } from './controller.js';

const router = Router();

router.get('/', listItems);
router.get('/mine', requireAuth, myItems);
router.get('/:id', getItem);
router.post('/', createItem);
router.put('/:id', requireAuth, updateItem);
router.delete('/:id', requireAuth, deleteItem);

export default router;
