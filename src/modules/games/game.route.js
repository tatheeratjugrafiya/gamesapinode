import { Router } from "express";
import { gameController } from "./game.controller.js";

const router = Router();

router.get("/games", gameController.getAllGames);
router.post("/games/rocknrole", gameController.rockNRollWithPrisma);

export const gameRouter = router;
