import express from 'express';
import { body } from 'express-validator';
import {
  createGame,
  getUserGames,
  getGameById,
  updateGame,
  deleteGame,
} from '../controllers/game.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// @route   POST /api/games
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Game name is required'),
    body('additionalInfo').optional().isObject().withMessage('Additional info must be an object'),
  ],
  createGame
);

// @route   GET /api/games
router.get('/', getUserGames);

// @route   GET /api/games/:id
router.get('/:id', getGameById);

// @route   PUT /api/games/:id
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Game name cannot be empty'),
    body('additionalInfo').optional().isObject().withMessage('Additional info must be an object'),
  ],
  updateGame
);

// @route   DELETE /api/games/:id
router.delete('/:id', deleteGame);

export default router; 