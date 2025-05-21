import { PrismaClient } from '../../generated/prisma/client.js';
import auth from '../utils/auth.js';
import ApiResponse from '../utils/apiResponse.js';

const prisma = new PrismaClient();

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json(ApiResponse.error('Refresh token is required'));
        }

        // Verify refresh token and get user
        const decoded = auth.verifyRefreshToken(refreshToken);
        const user = await prisma.user.findUnique({
            where: { 
                id: decoded.id,
                refreshToken: refreshToken
            }
        });

        if (!user) {
            return res.status(401).json(ApiResponse.unauthorized('Invalid refresh token'));
        }

        // Generate new token pair
        const tokens = auth.generateTokenPair({ id: user.id });

        // Update refresh token in database
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: tokens.refreshToken }
        });

        return res.json(ApiResponse.success({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }, 'Tokens refreshed successfully'));
    } catch (error) {
        console.error('Token refresh error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(ApiResponse.unauthorized('Refresh token expired'));
        }
        return res.status(500).json(ApiResponse.error('Server error', 500, error.message));
    }
}; 