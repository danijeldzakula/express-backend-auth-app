import User from '@models/user.model';
import { Request, Response } from 'express';

/**
 * Get All Users
 * @param req
 * @param res
 */
export async function getAllUsers(_req: Request, res: Response) {
  try {
    const users = await User.find();

    res.json({ message: 'Success', data: users });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
