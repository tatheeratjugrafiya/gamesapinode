import { PrismaClient } from '../../generated/prisma/client.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import {auth} from '../utils/auth.js';
import ApiResponse from '../utils/apiResponse.js';

const prisma = new PrismaClient();

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(ApiResponse.validationError(errors.array()));
    }

    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json(ApiResponse.error('Email and password are required'));
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json(ApiResponse.error('User already exists'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    // Generate tokens
    const tokens = auth.generateTokenPair({ id: user.id });

    // Store refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    return res.status(201).json(ApiResponse.success({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      ...tokens
    }, 'User registered successfully'));
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json(ApiResponse.error('Server error', 500, error.message));
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json(ApiResponse.unauthorized('Invalid credentials'));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json(ApiResponse.unauthorized('Invalid credentials'));
    }

    // Generate tokens
    const tokens = auth.generateTokenPair({ id: user.id });

    // Update refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    return res.json(ApiResponse.success({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      ...tokens
    }, 'Login successful'));
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json(ApiResponse.error('Server error', 500, error.message));
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = async (req, res) => {
  try {
    // Remove refresh token from database
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null }
    });

    return res.json(ApiResponse.success(null, 'Logged out successfully'));
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json(ApiResponse.error('Server error', 500, error.message));
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json(ApiResponse.notFound('User not found'));
    }

    return res.json(ApiResponse.success(user));
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json(ApiResponse.error('Server error', 500, error.message));
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json(ApiResponse.notFound('User not found'));
    }

    // Update fields
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(ApiResponse.success(updatedUser, 'Profile updated successfully'));
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json(ApiResponse.error('Server error', 500, error.message));
  }
}; 