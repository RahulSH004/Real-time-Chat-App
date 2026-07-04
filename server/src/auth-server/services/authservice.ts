import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { signToken } from "../../shared/jwt";

const VALID_AVATARS = ["ONE", "TWO", "THREE", "FOUR", "FIVE"] as const;
type AvatarId = (typeof VALID_AVATARS)[number];

export function isValidAvatarId(value: unknown): value is AvatarId {
  return typeof value === "string" && VALID_AVATARS.includes(value as AvatarId);
}

interface SignupInput {
  username: string;
  email: string;
  password: string;
  avatarId: string;
}

export async function signupUser({ username, email, password, avatarId }: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw { status: 409, message: "Email already in use" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      avatarId: avatarId as AvatarId
    }
  });

  const token = signToken({ userId: user.id, username: user.username });

  return {
    token,
    user: { id: user.id, username: user.username, avatarId: user.avatarId }
  };
}

interface LoginInput {
  email: string;
  password: string;
}

export async function loginUser({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const token = signToken({ userId: user.id, username: user.username });

  return {
    token,
    user: { id: user.id, username: user.username, avatarId: user.avatarId }
  };
}