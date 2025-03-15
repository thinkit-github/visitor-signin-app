import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const visits = await prisma.visit.findMany({
        include: {
          visitor: true,
        },
        orderBy: {
          signInTime: 'desc',
        },
      });
      
      return res.status(200).json(visits);
    } catch (error) {
      console.error('Error fetching visits:', error);
      return res.status(500).json({ error: 'Failed to fetch visits' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
} 