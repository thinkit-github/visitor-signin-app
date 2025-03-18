import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const visitors = await prisma.visitor.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          visits: true,
        },
      });
      
      return res.status(200).json(visitors);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      return res.status(500).json({ error: 'Failed to fetch visitors' });
    }
  } else if (req.method === 'POST') {
    try {
      const { 
        name, 
        email, 
        phone, 
        company, 
        hostName, 
        purpose,
        signature,
        notes,
        visitorType 
      } = req.body;

      const visitor = await prisma.visitor.create({
        data: {
          name,
          email,
          phone,
          company: company || '',
          hostName,
          visitPurpose: purpose,
          signature: signature || '',
          notes: notes || '',
          type: visitorType,
          signInTime: new Date(),
          isSignedOut: false,
          visits: {
            create: {
              hostName,
              notes: notes || '',
              signInTime: new Date(),
            }
          }
        },
        include: {
          visits: true,
        }
      });
      
      return res.status(201).json(visitor);
    } catch (error) {
      console.error('Error creating visitor:', error);
      return res.status(500).json({ 
        error: 'Failed to create visitor',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 