import { prisma } from "../prisma/client";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
export const checkUserExists = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    return user;
  } catch (error) {
    throw new Error("Error checking user existence");
  }
};

export const hashPassword = (password: string) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const generateToken = (userId: string | number) => {
  const token = jsonwebtoken.sign({ id: String(userId) }, "your_jwt_secret", {
    expiresIn: "1h",
  });
  return token;
};

export const verifyToken = (token: string): any => {
  try {
    const decoded = jsonwebtoken.verify(token, "your_jwt_secret");
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
