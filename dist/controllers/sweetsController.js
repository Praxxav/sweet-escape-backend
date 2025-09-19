"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSweet = addSweet;
exports.listSweets = listSweets;
exports.searchSweets = searchSweets;
exports.updateSweet = updateSweet;
exports.deleteSweet = deleteSweet;
exports.purchaseSweet = purchaseSweet;
exports.restockSweet = restockSweet;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas
const addSweetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    category: zod_1.z.string().min(1, "Category is required"),
    price: zod_1.z.number().positive("Price must be positive"),
    quantity: zod_1.z.number().int().nonnegative("Quantity must be 0 or more"),
});
const updateSweetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    category: zod_1.z.string().min(1).optional(),
    price: zod_1.z.number().positive().optional(),
    quantity: zod_1.z.number().int().nonnegative().optional(),
});
const purchaseSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive("Quantity must be at least 1"),
});
const restockSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive("Quantity must be at least 1"),
});
/* ---------------------- CONTROLLERS ---------------------- */
async function addSweet(req, res) {
    try {
        const data = addSweetSchema.parse(req.body); // ✅ validate input
        const sweet = await prisma.sweet.create({ data });
        res.status(201).json(sweet);
    }
    catch (err) {
        if (err.errors)
            return res.status(400).json({ error: err.errors });
        res.status(400).json({ error: "Sweet already exists" });
    }
}
async function listSweets(req, res) {
    const sweets = await prisma.sweet.findMany();
    res.json(sweets);
}
async function searchSweets(req, res) {
    const { name, category, minPrice, maxPrice } = req.query;
    const sweets = await prisma.sweet.findMany({
        where: {
            name: name ? { contains: String(name), mode: "insensitive" } : undefined,
            category: category ? { equals: String(category), mode: "insensitive" } : undefined,
            price: {
                gte: minPrice ? Number(minPrice) : undefined,
                lte: maxPrice ? Number(maxPrice) : undefined,
            },
        },
    });
    res.json(sweets);
}
async function updateSweet(req, res) {
    try {
        const id = Number(req.params.id);
        const data = updateSweetSchema.parse(req.body); // ✅ validate input
        const sweet = await prisma.sweet.update({ where: { id }, data });
        res.json(sweet);
    }
    catch (err) {
        return res.status(400).json({ error: err.errors || "Update failed" });
    }
}
async function deleteSweet(req, res) {
    const id = Number(req.params.id);
    await prisma.sweet.delete({ where: { id } });
    res.json({ message: "Sweet deleted" });
}
async function purchaseSweet(req, res) {
    try {
        const sweetId = Number(req.params.id);
        const { quantity } = purchaseSchema.parse(req.body); // ✅ validate input
        const userId = req.user.id;
        const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });
        if (!sweet)
            return res.status(404).json({ error: "Sweet not found" });
        if (sweet.quantity < quantity)
            return res.status(400).json({ error: "Not enough stock" });
        const [updated, purchase] = await prisma.$transaction([
            prisma.sweet.update({ where: { id: sweetId }, data: { quantity: { decrement: quantity } } }),
            prisma.purchase.create({
                data: { userId, sweetId, quantity, priceAtPurchase: sweet.price },
            }),
        ]);
        res.json({ sweet: updated, purchase });
    }
    catch (err) {
        return res.status(400).json({ error: err.errors || "Purchase failed" });
    }
}
async function restockSweet(req, res) {
    try {
        const sweetId = Number(req.params.id);
        const { quantity } = restockSchema.parse(req.body); // ✅ validate input
        const sweet = await prisma.sweet.update({
            where: { id: sweetId },
            data: { quantity: { increment: quantity } },
        });
        res.json(sweet);
    }
    catch (err) {
        return res.status(400).json({ error: err.errors || "Restock failed" });
    }
}
