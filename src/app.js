import express from "express";
import { gameRouter } from "./modules/games/game.route.js";

const app = express();

app.use(express.json());
app.use("/api/v1", gameRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export { app };
