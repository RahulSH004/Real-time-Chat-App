import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET!;
if (!SECRET) throw new Error("JWT_SECRET is not set in environment variables");

export interface TokenPayload {
  userId: string;
  username: string;
}

export async function signToken(
  payload: TokenPayload,
  expiresIn: jwt.SignOptions["expiresIn"] = "1h"
): Promise<string> {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch {
    return null;
  }
}