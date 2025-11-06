import { prisma } from "@repo/database/client";
import express from "express";
import userRouter from "./routes/user.route.js";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authenticateToken } from "./middleware/middleware.js";
import { CreateRoomSchema } from "@repo/common/types";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use(authenticateToken);

app.use("/api/v1/create-room", (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  prisma.room.create({
    data: {
      slug: data.data.name,
      adminId: req.userId as string,
    },
  });
  res.status(200).json({ message: "Create room endpoint - protected" });
});

app.get("/api/v1/rooms/:roomId/messages", async (req, res) => {
  const { roomId } = req.params;
  if (!roomId || roomId.trim() === "") {
    return res.status(400).json({ error: "Room ID is required" });
  }
  const { limit, before } = req.query;
  if (limit && isNaN(Number(limit))) {
    return res.status(400).json({ error: "Limit must be a number" });
  }
  const limitNumber = limit ? Number(limit) : 50;

  const messages = await prisma.chat.findMany({
    where: { roomId: Number(roomId) },
    orderBy: { createdAt: "desc" },
    take: limitNumber,
  });
});

app.listen(8000, () => {
  console.log("HTTP backend server is running on port 8000");
});
