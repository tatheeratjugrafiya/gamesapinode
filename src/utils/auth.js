import crypto from 'crypto'
import jwt from 'jsonwebtoken'

class Auth {
    constructor() {
        this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'your-access-secret-key';
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
        this.accessTokenExpiry = '15m';
        this.refreshTokenExpiry = '7d';
    }

    generateAccessToken(payload) {
        return jwt.sign(payload, this.accessTokenSecret, { expiresIn: this.accessTokenExpiry });
    }

    generateRefreshToken(payload) {
        return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: this.refreshTokenExpiry });
    }

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.accessTokenSecret);
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.refreshTokenSecret);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    generateTokenPair(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload)
        };
    }

    generateRandomToken() {
        return crypto.randomBytes(32).toString('hex');
    }
}

export const auth = new Auth(); 