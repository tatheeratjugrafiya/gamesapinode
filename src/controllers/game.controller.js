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

    const { name, additionalInfo, categoryIds } = req.body;

    const game = await prisma.game.create({
      data: {
        name,
        additionalInfo,
        userId: req.user.id,
        categories: categoryIds ? {
          connect: categoryIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        categories: true
      }
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
      include: {
        categories: true
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
      include: {
        categories: true
      }
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
    const { name, additionalInfo, categoryIds } = req.body;

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
        categories: categoryIds ? {
          set: categoryIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        categories: true
      }
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

// @desc    Add categories to game
// @route   POST /api/games/:id/categories
// @access  Private
export const addCategoriesToGame = async (req, res) => {
  try {
    const { categoryIds } = req.body;
    const gameId = parseInt(req.params.id);

    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        userId: req.user.id,
      },
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const updatedGame = await prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        categories: {
          connect: categoryIds.map(id => ({ id }))
        }
      },
      include: {
        categories: true
      }
    });

    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Remove category from game
// @route   DELETE /api/games/:id/categories/:categoryId
// @access  Private
export const removeCategoryFromGame = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const { categoryId } = req.params;

    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        userId: req.user.id,
      },
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const updatedGame = await prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        categories: {
          disconnect: { id: categoryId }
        }
      },
      include: {
        categories: true
      }
    });

    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 