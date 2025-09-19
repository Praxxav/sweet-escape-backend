import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";
import { z } from "zod";

const prisma = new PrismaClient();
// Validation schemas
const addSweetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().nonnegative("Quantity must be 0 or more"),
});

const updateSweetSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().nonnegative().optional(),
});

const purchaseSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

const restockSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

/* ---------------------- CONTROLLERS ---------------------- */
export async function addSweet(req: AuthRequest, res: Response) {
  try {
    const data = addSweetSchema.parse(req.body); // ✅ validate input
    const sweet = await prisma.sweet.create({ data });
    res.status(201).json(sweet);
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ error: err.errors });
    res.status(400).json({ error: "Sweet already exists" });
  }
}

export async function listSweets(req: Request, res: Response) {
  const sweets = await prisma.sweet.findMany();
  res.json(sweets);
}

export async function searchSweets(req: Request, res: Response) {
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

export async function updateSweet(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = updateSweetSchema.parse(req.body); // ✅ validate input
    const sweet = await prisma.sweet.update({ where: { id }, data });
    res.json(sweet);
  } catch (err: any) {
    return res.status(400).json({ error: err.errors || "Update failed" });
  }
}

export async function deleteSweet(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  await prisma.sweet.delete({ where: { id } });
  res.json({ message: "Sweet deleted" });
}

export async function purchaseSweet(req: AuthRequest, res: Response) {
  try {
    const sweetId = Number(req.params.id);
    const { quantity } = purchaseSchema.parse(req.body); // ✅ validate input
    const userId = req.user!.id;

    const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });
    if (!sweet) return res.status(404).json({ error: "Sweet not found" });
    if (sweet.quantity < quantity) return res.status(400).json({ error: "Not enough stock" });

    const [updated, purchase] = await prisma.$transaction([
      prisma.sweet.update({ where: { id: sweetId }, data: { quantity: { decrement: quantity } } }),
      prisma.purchase.create({
        data: { userId, sweetId, quantity, priceAtPurchase: sweet.price },
      }),
    ]);

    res.json({ sweet: updated, purchase });
  } catch (err: any) {
    return res.status(400).json({ error: err.errors || "Purchase failed" });
  }
}

export async function restockSweet(req: AuthRequest, res: Response) {
  try {
    const sweetId = Number(req.params.id);
    const { quantity } = restockSchema.parse(req.body); // ✅ validate input

    const sweet = await prisma.sweet.update({
      where: { id: sweetId },
      data: { quantity: { increment: quantity } },
    });

    res.json(sweet);
  } catch (err: any) {
    return res.status(400).json({ error: err.errors || "Restock failed" });
  }
}
