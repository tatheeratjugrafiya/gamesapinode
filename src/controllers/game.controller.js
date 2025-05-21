import { PrismaClient } from '../../generated/prisma/client.js';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// @desc    Create a new game
// @route   POST /api/games
// @access  Private
export const createGame = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, additionalInfo } = req.body;

    const game = await prisma.game.create({
      data: {
        name,
        additionalInfo,
        userId: req.user.id,
      },
    });

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all games for a user
// @route   GET /api/games
// @access  Private
export const getUserGames = async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get game by ID
// @route   GET /api/games/:id
// @access  Private
export const getGameById = async (req, res) => {
  try {
    const game = await prisma.game.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update game
// @route   PUT /api/games/:id
// @access  Private
export const updateGame = async (req, res) => {
  try {
    const { name, additionalInfo } = req.body;

    const game = await prisma.game.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const updatedGame = await prisma.game.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name,
        additionalInfo,
      },
    });

    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete game
// @route   DELETE /api/games/:id
// @access  Private
export const deleteGame = async (req, res) => {
  try {
    const game = await prisma.game.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    await prisma.game.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.json({ message: 'Game removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 