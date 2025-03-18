import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, phone } = req.body;

        // Find the visitor
        const visitor = await prisma.visitor.findFirst({
            where: {
                name: name,
                phone: phone,
                isSignedOut: false
            },
            include: {
                visits: {
                    orderBy: {
                        signInTime: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!visitor) {
            return res.status(404).json({ error: 'No active visit found for this visitor' });
        }

        // Update both visitor and visit records
        const updatedVisitor = await prisma.visitor.update({
            where: {
                id: visitor.id
            },
            data: {
                isSignedOut: true,
                signOutTime: new Date(),
                visits: {
                    update: {
                        where: {
                            id: visitor.visits[0].id
                        },
                        data: {
                            signOutTime: new Date()
                        }
                    }
                }
            },
            include: {
                visits: true
            }
        });

        return res.status(200).json(updatedVisitor);
    } catch (error) {
        console.error('Error processing sign-out:', error);
        return res.status(500).json({ 
            error: 'Failed to process sign-out',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
} 