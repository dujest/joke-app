import { Router } from "express";
import { UserController } from "../controller/user";

export const publicRouter = Router();

publicRouter.route("/signup").post((req, res) => {
  const userController = new UserController();
  return userController.signup(req, res);
});

publicRouter.route("/login").post((req, res) => {
  const userController = new UserController();
  return userController.login(req, res);
});

publicRouter.route("/verify").get((req, res) => {
  const userController = new UserController();
  return userController.verifyUser(req, res);
});
