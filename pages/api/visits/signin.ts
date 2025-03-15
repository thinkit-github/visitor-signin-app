import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { 
        name, 
        company, 
        email, 
        phone, 
        visitPurpose, 
        type, 
        hostName, 
        notes,
        signature 
      } = req.body;
      
      // Validate required fields
      if (!name || !phone || !visitPurpose || !type || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Check if visitor already exists by name and phone
      let visitor = await prisma.visitor.findFirst({
        where: {
          name: name,
          phone: phone,
        },
      });
      
      // If visitor doesn't exist, create a new one
      if (!visitor) {
        visitor = await prisma.visitor.create({
          data: {
            name,
            company,
            email,
            phone,
            visitPurpose,
            type,
          },
        });
      } else {
        // Update visitor information if they already exist
        visitor = await prisma.visitor.update({
          where: {
            id: visitor.id,
          },
          data: {
            company,
            email,
            visitPurpose,
            type,
          },
        });
      }
      
      // Create a new visit record
      const visit = await prisma.visit.create({
        data: {
          visitorId: visitor.id,
          hostName,
          notes,
          // We're not storing the signature in the database for this example
          // In a real application, you might want to store it in a secure way
          // or in a separate table
        },
      });
      
      return res.status(201).json({ 
        message: 'Sign-in successful',
        visit,
        visitor,
      });
    } catch (error) {
      console.error('Error during sign-in:', error);
      return res.status(500).json({ error: 'Failed to process sign-in' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
} 