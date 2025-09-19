import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "super_secret";

export function generateToken(userId: number, role: string) {
  return jwt.sign({ userId, role }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as { userId: number; role: string };
}
