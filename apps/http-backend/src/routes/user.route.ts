import express, { Request, Response } from "express";
import { signupUser, loginUser } from "../controllers/user.controller.js";
import {CreateUserSchema,LoginUserSchema} from "@repo/common/types"
const userRouter: express.Router = express.Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    const { username, password, email } = data.data;
    const user = await signupUser(username, password, email);
    const { password: _pw, ...safeUser } = (user as any) || {};
    return res.status(201).json({ user: safeUser });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Signup failed" });
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  const data = LoginUserSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const { email, password } = data.data;
    const { user, token } = await loginUser(email, password);
    const { password: _pw, ...safeUser } = (user as any) || {};
    return res.status(200).json({ user: safeUser, token });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Login failed" });
  }
});

userRouter.post("/logout", (req: Request, res: Response) => {
   req.headers["authorization"] = "";
   return res.status(200).json({ message: "Logged out successfully" });
});

export default userRouter;
