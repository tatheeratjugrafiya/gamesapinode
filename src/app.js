import express from "express";
import { gameRouter } from "./modules/games/game.route.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import ApiResponse from "./utils/apiResponse.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/games", gameRouter);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json(ApiResponse.notFound("Route not found"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(ApiResponse.error("Internal Server Error", 500, err.message));
});

export { app };
