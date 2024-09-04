import { Request, Response } from 'express';

/**
 * Get Hello World
 * @param req
 * @param res
 */
export async function getHelloWorld(_req: Request, res: Response) {
  try {
    res.json({ message: 'Hello World' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
