import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  const body = req.body;
  if (!body.email || !body.password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const {name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name,email, password: hashed, role: role || "USER" },
    });
    const token = generateToken(user.id, user.role);
    return res.status(201).json({ token });
  } catch {
    return res.status(400).json({ error: "Email already exists" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken(user.id, user.role);
  return res.json({ token });
}
