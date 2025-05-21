import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/user.controller.js';
import { authenticate} from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/users/register
router.post(
  '/register',
  // [
  //   body('email').isEmail().withMessage('Please include a valid email'),
  //   body('password')
  //     .isLength({ min: 6 })
  //     .withMessage('Password must be at least 6 characters long'),
  //   body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  // ],
  registerUser
);

// @route   POST /api/users/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  loginUser
);

// @route   GET /api/users/profile
router.get('/profile', authenticate, getUserProfile);

// @route   PUT /api/users/profile
router.put(
  '/profile',
  authenticate,
  [
    body('email').optional().isEmail().withMessage('Please include a valid email'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  ],
  updateUserProfile
);

export default router; 