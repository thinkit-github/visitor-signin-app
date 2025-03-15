import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid visit ID' });
      }
      
      const visitId = parseInt(id, 10);
      
      if (isNaN(visitId)) {
        return res.status(400).json({ error: 'Invalid visit ID format' });
      }
      
      // Find the visit
      const visit = await prisma.visit.findUnique({
        where: {
          id: visitId,
        },
      });
      
      if (!visit) {
        return res.status(404).json({ error: 'Visit not found' });
      }
      
      if (visit.signOutTime) {
        return res.status(400).json({ error: 'Visit already signed out' });
      }
      
      // Update the visit with sign-out time
      const updatedVisit = await prisma.visit.update({
        where: {
          id: visitId,
        },
        data: {
          signOutTime: new Date(),
        },
      });
      
      return res.status(200).json({ 
        message: 'Manual sign-out successful',
        visit: updatedVisit,
      });
    } catch (error) {
      console.error('Error during manual sign-out:', error);
      return res.status(500).json({ error: 'Failed to process manual sign-out' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
} 