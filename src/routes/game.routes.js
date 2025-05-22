import express from 'express';
import { body } from 'express-validator';
import {
  createGame,
  getUserGames,
  getGameById,
  updateGame,
  deleteGame,
  addCategoriesToGame,
  removeCategoryFromGame,
} from '../controllers/game.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the game
 *         name:
 *           type: string
 *           description: The name of the game
 *         additionalInfo:
 *           type: object
 *           description: Additional information about the game
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who owns the game
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the game was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the game was last updated
 */

// All routes are protected
router.use(authenticate);

/**
 * @swagger
 * /api/v1/games:
 *   post:
 *     summary: Create a new game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               additionalInfo:
 *                 type: object
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: The game was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Game name is required'),
    body('additionalInfo').optional().isObject().withMessage('Additional info must be an object'),
    body('categoryIds').optional().isArray().withMessage('Category IDs must be an array'),
  ],
  createGame
);

/**
 * @swagger
 * /api/v1/games:
 *   get:
 *     summary: Returns all games for the authenticated user
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
router.get('/', getUserGames);

/**
 * @swagger
 * /api/v1/games/{id}:
 *   get:
 *     summary: Get a game by id
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The game id
 *     responses:
 *       200:
 *         description: The game description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: The game was not found
 */
router.get('/:id', getGameById);

/**
 * @swagger
 * /api/v1/games/{id}:
 *   put:
 *     summary: Update a game by id
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The game id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               additionalInfo:
 *                 type: object
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: The game was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: The game was not found
 */
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Game name cannot be empty'),
    body('additionalInfo').optional().isObject().withMessage('Additional info must be an object'),
    body('categoryIds').optional().isArray().withMessage('Category IDs must be an array'),
  ],
  updateGame
);

/**
 * @swagger
 * /api/v1/games/{id}:
 *   delete:
 *     summary: Delete a game by id
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The game id
 *     responses:
 *       200:
 *         description: The game was deleted
 *       404:
 *         description: The game was not found
 */
router.delete('/:id', deleteGame);

/**
 * @swagger
 * /api/v1/games/{id}/categories:
 *   post:
 *     summary: Add categories to a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The game id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryIds
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Categories were added to the game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: The game was not found
 */
router.post(
  '/:id/categories',
  [
    body('categoryIds').isArray().withMessage('Category IDs must be an array'),
  ],
  addCategoriesToGame
);

/**
 * @swagger
 * /api/v1/games/{id}/categories/{categoryId}:
 *   delete:
 *     summary: Remove a category from a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The game id
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category id
 *     responses:
 *       200:
 *         description: The category was removed from the game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: The game was not found
 */
router.delete('/:id/categories/:categoryId', removeCategoryFromGame);

export default router; 