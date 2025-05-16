import { Router } from "express";
import { gameController } from "./game.controller.js";

const router = Router();

router.get("/games", gameController.getAllGames);

export const gameRouter = router;
