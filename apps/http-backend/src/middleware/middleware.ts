import { verifyToken } from "../helpers/user.helper.js";
import { Request, Response, NextFunction } from "express";

// Extend express Request to allow attaching a `user` property.
declare global {
  namespace Express {
    interface Request {
      userId?: any;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = (authHeader as string).split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const decoded = verifyToken(token);
    // decoded can be the payload used when signing. Attach it for downstream handlers.
    // If the payload contains an `id` field, attach that, otherwise attach full decoded payload.
    req.userId = (decoded as any)?.id ?? decoded;
    return next();
  } catch (error: any) {
    return res.status(403).json({ error: error.message || "Invalid token" });
  }
};
