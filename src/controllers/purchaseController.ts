import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();

export async function listAllPurchases(req: AuthRequest, res: Response) {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        sweet: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch purchase history." });
  }
}