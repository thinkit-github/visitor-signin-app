import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const visitorId = parseInt(req.query.id as string);
        
        const updatedVisitor = await prisma.visitor.update({
            where: {
                id: visitorId,
            },
            data: {
                signOutTime: new Date(),
                isSignedOut: true,
            },
        });
        
        return res.status(200).json(updatedVisitor);
    } catch (error) {
        console.error('Error signing out visitor:', error);
        return res.status(500).json({ error: 'Failed to sign out visitor' });
    }
} 