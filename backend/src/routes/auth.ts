import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { z } from 'zod';

const router = express.Router();

const DemoLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3)
});

// Demo login endpoint as per problem statement
router.post('/demo-login', async (req, res, next) => {
  try {
    const { email, password } = DemoLoginSchema.parse(req.body);

    // Demo authentication - only accept demo@esahayak.com
    if (email !== 'demo@esahayak.com' || password.length < 3) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Use demo@esahayak.com with any password (3+ characters)'
      });
    }

    // Find or create demo user
    let user = await prisma.user.findUnique({
      where: { email: 'demo@esahayak.com' }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo@esahayak.com',
          name: 'Demo User',
          isAdmin: false
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

export default router;
