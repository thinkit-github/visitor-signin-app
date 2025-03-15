import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { name, phone } = req.body;
      
      // Validate required fields
      if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
      }
      
      // Find the visitor by name and phone
      const visitor = await prisma.visitor.findFirst({
        where: {
          name: name,
          phone: phone,
        },
      });
      
      if (!visitor) {
        return res.status(404).json({ error: 'Visitor not found' });
      }
      
      // Find the most recent active visit for this visitor
      const activeVisit = await prisma.visit.findFirst({
        where: {
          visitorId: visitor.id,
          signOutTime: null,
        },
        orderBy: {
          signInTime: 'desc',
        },
      });
      
      if (!activeVisit) {
        return res.status(404).json({ error: 'No active visit found for this visitor' });
      }
      
      // Update the visit with sign-out time
      const updatedVisit = await prisma.visit.update({
        where: {
          id: activeVisit.id,
        },
        data: {
          signOutTime: new Date(),
        },
      });
      
      return res.status(200).json({ 
        message: 'Sign-out successful',
        visit: updatedVisit,
      });
    } catch (error) {
      console.error('Error during sign-out:', error);
      return res.status(500).json({ error: 'Failed to process sign-out' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
} 