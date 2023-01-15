import { Router } from "express";
import { JokeController } from "../controller/joke";
import { authenticate } from "../middleware/auth";

export const privateRouter = Router();

privateRouter.use(authenticate);

privateRouter.route("/joke").get((req, res) => {
  const jokeController = new JokeController();
  return jokeController.getJoke(req, res);
});
