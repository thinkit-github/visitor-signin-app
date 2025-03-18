import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid visit ID' });
      }
      
      const visitId = parseInt(id, 10);
      
      // Update the visit
      const updatedVisit = await prisma.visit.update({
        where: {
          id: visitId,
        },
        data: {
          signOutTime: new Date(),
        },
      });
      
      return res.status(200).json(updatedVisit);
    } catch (error) {
      console.error('Error signing out visitor:', error);
      return res.status(500).json({ error: 'Failed to sign out visitor' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 