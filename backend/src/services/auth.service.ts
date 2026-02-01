import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../lib/prisma.js';

const SALT_ROUNDS = 10;

export interface JwtPayload {
  userId: string;
  username: string;
}

export interface AuthResult {
  user: {
    id: string;
    username: string;
    createdAt: Date;
  };
  token: string;
}

export class AuthService {
  /**
   * Hash a plain text password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a password against its hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a JWT token
   */
  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  }

  /**
   * Register a new user
   */
  async register(username: string, password: string): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error('Username already taken');
    }

    // Hash password and create user
    const hashedPassword = await this.hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Login a user
   */
  async login(username: string, password: string): Promise<AuthResult> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isValid = await this.verifyPassword(password, user.password);

    if (!isValid) {
      throw new Error('Invalid username or password');
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
  }
}

export const authService = new AuthService();
