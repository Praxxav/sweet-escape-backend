"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllPurchases = listAllPurchases;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function listAllPurchases(req, res) {
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
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch purchase history." });
    }
}
