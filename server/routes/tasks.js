import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  applyToTask,
  assignHelper,
  completeTask,
} from '../controllers/taskController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/tasks - Get all tasks (public)
router.get('/', getAllTasks);

// POST /api/tasks - Create a new task (owner only)
router.post('/', verifyToken, requireRole('owner'), createTask);

// IMPORTANT: Specific routes must come before parameterized routes
// POST /api/tasks/:id/apply - Apply to task (helper only)
router.post('/:id/apply', verifyToken, requireRole('helper'), applyToTask);

// POST /api/tasks/:id/assign - Assign helper to task (owner only)
router.post('/:id/assign', verifyToken, requireRole('owner'), assignHelper);

// POST /api/tasks/:id/complete - Complete task (owner only)
router.post('/:id/complete', verifyToken, requireRole('owner'), completeTask);

// GET /api/tasks/:id - Get a single task by ID (public)
router.get('/:id', getTaskById);

export default router;
