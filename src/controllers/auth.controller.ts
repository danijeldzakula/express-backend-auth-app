import User from '@models/user.model';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const ACCESS_TOKEN_SECRET = 'your_access_token_secret';
export const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret';

/**
 * User login controller
 * @param req
 * @param res
 * @returns
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1m',
    });

    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: '3m',
    });

    await user.setRefreshToken(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'none',
      maxAge: 1 * 60 * 1000, // 45 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'none',
      maxAge: 3 * 60 * 1000, //7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * User Refresh Token controller
 * @param req
 * @param res
 * @returns
 */
export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    ) as JwtPayload;

    if (typeof decoded === 'string') {
      throw new Error('Invalid token');
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1m',
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 60 * 1000, // 45 minutes
    });

    res.json({ message: 'Access token refreshed' });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}

/**
 * User registration controller
 * @param req
 * @param res
 * @returns
 */
export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * User logout controller
 * @param req
 * @param res
 * @returns
 */
export async function logout(req: Request, res: Response) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.json({ message: 'Logged out successfully' });
}
