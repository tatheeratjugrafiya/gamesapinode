import { PrismaClient } from '../../generated/prisma/client.js';
import {auth} from '../utils/auth.js';
import ApiResponse from '../utils/apiResponse.js';

const prisma = new PrismaClient();

/**
 * Middleware to authenticate users using access token
 * Used for protecting routes that require authentication
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(ApiResponse.unauthorized('No token provided'));
        }

        const token = authHeader.split(' ')[1];
        const decoded = auth.verifyAccessToken(token);
        
        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true
            }
        });

        if (!user) {
            return res.status(401).json(ApiResponse.unauthorized('User not found'));
        }
        
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(ApiResponse.unauthorized('Token expired'));
        }
        return res.status(401).json(ApiResponse.unauthorized('Invalid token'));
    }
};

/**
 * Middleware to verify refresh token
 * Used for token refresh operations
 */
const verifyRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json(ApiResponse.error('Refresh token is required'));
        }

        const decoded = auth.verifyRefreshToken(refreshToken);
        
        // Verify user exists and has matching refresh token
        const user = await prisma.user.findUnique({
            where: { 
                id: decoded.id,
                refreshToken: refreshToken
            }
        });

        if (!user) {
            return res.status(401).json(ApiResponse.unauthorized('Invalid refresh token'));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(ApiResponse.unauthorized('Refresh token expired'));
        }
        return res.status(401).json(ApiResponse.unauthorized('Invalid refresh token'));
    }
};

/**
 * Optional authentication middleware
 * Allows the route to proceed even if no token is provided
 * Sets req.user if a valid token is provided
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        const decoded = auth.verifyAccessToken(token);
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true
            }
        });

        if (user) {
            req.user = user;
        }
        
        next();
    } catch (error) {
        // Continue without setting req.user
        next();
    }
};

export {
    authenticate,
    verifyRefreshToken,
    optionalAuth
}; 