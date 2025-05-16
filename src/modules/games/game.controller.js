import { prisma } from "../../config/db.config.js";

class GameController {
  async rockNRollWithPrisma(req, res, next) {
    try {
      await prisma.game.create({ data: req.body });
    } catch (e) {
      console.log("ERROR--", e);
    }
    res.status(200).json({ party: true });
  }
  async getAllGames(req, res, next) {
    const games = await prisma.game.findMany();
    res.json(games || []);
  }
}
export const gameController = new GameController();
