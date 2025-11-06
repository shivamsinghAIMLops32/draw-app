import { prisma } from "@repo/database/client";
import {
  checkUserExists,
  comparePassword,
  generateToken,
  hashPassword,
} from "../helpers/user.helper.js";

export const signupUser = async (
  name: string,
  password: string,
  email: string
) => {
  if (!name || !password || !email) {
    throw new Error("All fields are required");
  }

  if (password.length < 6 || email.length < 6 || !email.includes("@")) {
    throw new Error(
      "Password must be at least 6 characters long and email must be valid"
    );
  }

  const existing = await checkUserExists(email);
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      name,
      password: hashedPassword,
      email,
    },
  });

  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await checkUserExists(email);
  if (!user) {
    throw new Error("User does not exist");
  }

  const isValidPassword = comparePassword(password, (user as any).password);

  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken((user as any).id);

  return { user, token };
};
