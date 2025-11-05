import express from "express";
import userRouter from "./routes/user.route.js";

import { authenticateToken } from "./middleware/middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use(authenticateToken);
app.use("/api/v1/create-room", (req, res) => {
  res.status(200).json({ message: "Create room endpoint - protected" });
});

app.listen(8000, () => {
  console.log("HTTP backend server is running on port 8000");
});
