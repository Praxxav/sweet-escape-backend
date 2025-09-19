"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSweet = addSweet;
exports.listSweets = listSweets;
exports.searchSweets = searchSweets;
exports.updateSweet = updateSweet;
exports.deleteSweet = deleteSweet;
exports.purchaseSweet = purchaseSweet;
exports.restockSweet = restockSweet;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function addSweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, category, price, quantity } = req.body;
        try {
            const sweet = yield prisma.sweet.create({ data: { name, category, price, quantity } });
            res.status(201).json(sweet);
        }
        catch (_a) {
            res.status(400).json({ error: "Sweet already exists" });
        }
    });
}
function listSweets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sweets = yield prisma.sweet.findMany();
        res.json(sweets);
    });
}
function searchSweets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, category, minPrice, maxPrice } = req.query;
        const sweets = yield prisma.sweet.findMany({
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
    });
}
function updateSweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        const data = req.body;
        const sweet = yield prisma.sweet.update({ where: { id }, data });
        res.json(sweet);
    });
}
function deleteSweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        yield prisma.sweet.delete({ where: { id } });
        res.json({ message: "Sweet deleted" });
    });
}
function purchaseSweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sweetId = Number(req.params.id);
        const { quantity } = req.body;
        const userId = req.user.id;
        const sweet = yield prisma.sweet.findUnique({ where: { id: sweetId } });
        if (!sweet)
            return res.status(404).json({ error: "Sweet not found" });
        if (sweet.quantity < quantity)
            return res.status(400).json({ error: "Not enough stock" });
        const [updated, purchase] = yield prisma.$transaction([
            prisma.sweet.update({ where: { id: sweetId }, data: { quantity: { decrement: quantity } } }),
            prisma.purchase.create({
                data: { userId, sweetId, quantity, priceAtPurchase: sweet.price },
            }),
        ]);
        res.json({ sweet: updated, purchase });
    });
}
function restockSweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sweetId = Number(req.params.id);
        const { quantity } = req.body;
        const sweet = yield prisma.sweet.update({
            where: { id: sweetId },
            data: { quantity: { increment: quantity } },
        });
        res.json(sweet);
    });
}
