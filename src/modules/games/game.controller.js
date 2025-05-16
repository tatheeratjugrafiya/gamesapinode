import { prisma } from "../../config/db.config.js";

class GameController {
  async getAllGames(req, res, next) {
    const games = await prisma.game.findMany();
    res.json(games || []);
  }
}
export const gameController = new GameController();
