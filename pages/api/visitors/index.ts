import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const visitors = await prisma.visitor.findMany({
        orderBy: {
          signInTime: 'desc',
        },
      });
      
      return res.status(200).json(visitors);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      return res.status(500).json({ error: 'Failed to fetch visitors' });
    }
  } else if (req.method === 'POST') {
    try {
      const visitorData = req.body;
      const visitor = await prisma.visitor.create({
        data: visitorData,
      });
      
      return res.status(201).json(visitor);
    } catch (error) {
      console.error('Error creating visitor:', error);
      return res.status(500).json({ error: 'Failed to create visitor' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 