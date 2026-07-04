import { Router, Request, Response } from "express";
import { signupUser, loginUser, isValidAvatarId } from "../services/authservice";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password, avatarId } = req.body;

    if (!username || !email || !password || !avatarId) {
      return res.status(400).json({ error: "username, email, password, and avatarId are required" });
    }

    if (!isValidAvatarId(avatarId)) {
      return res.status(400).json({ error: "Invalid avatarId" });
    }

    const result = await signupUser({ username, email, password, avatarId });
    return res.status(201).json(result);
  } catch (err: any) {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    if (status === 500) console.error("Signup error:", err);
    return res.status(status).json({ error: message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const result = await loginUser({ email, password });
    return res.status(200).json(result);
  } catch (err: any) {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    if (status === 500) console.error("Login error:", err);
    return res.status(status).json({ error: message });
  }
});

export default router;