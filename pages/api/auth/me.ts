import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

export default async function handler (
    req: NextApiRequest, 
    res: NextApiResponse
)  {
    if (req.method === "GET") {
        const bearerToken = req.headers['authorization'] as string

        const token = bearerToken.split(" ")[1]

        const payload = jwt.decode(token) as {email: string}

        if(!payload.email) {
            return res.status(401).json({
                errorMessage: "Unauthorized request"
            })
        }
        
        const user = await prisma.user.findUnique({
            where: {
                email: payload.email
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                city: true,
                phone: true
            }
        })

        if(!user) {
            return res.status(401).json({
                errorMessage: "User not found"
            })
        }

        return res.json({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            city: user.city
        })
    }

    return res.status(404).json("Unknown endpoint")
}