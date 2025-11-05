import express, { Request, Response } from "express";
import { signupUser, loginUser } from "../controllers/user.controller.js";

const userRouter: express.Router = express.Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const user = await signupUser(username, password, email);
    const { password: _pw, ...safeUser } = (user as any) || {};
    return res.status(201).json({ user: safeUser });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Signup failed" });
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
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
