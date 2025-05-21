import express from 'express';
import { refreshAccessToken } from '../controllers/auth.controller.js';
import { verifyRefreshToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', verifyRefreshToken, refreshAccessToken);

export default router; 