import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { User } from "../entity/user";
import { SignUp } from "../model/signup";
import { Login } from "../model/login";
import { comparePassword, hashPassword } from "../service/password";
import {
  createVerifyToken,
  decodeVerifyToken,
  createAuthToken,
} from "../service/jwt";
import { sendSignUpEmail } from "../service/email";
import { CustomAPIError } from "../errors/custom-error";
import { StatusCodes } from "http-status-codes";
import { loginSchema, userSchema } from "../validate";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async signup(request: Request, response: Response) {
    const input: SignUp = request.body;

    userSchema.validateSync(input, { strict: true, abortEarly: false });

    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (user) {
      throw new CustomAPIError(
        "The user already exists!",
        StatusCodes.BAD_REQUEST
      );
    }

    const hash = await hashPassword(input.password);

    await AppDataSource.transaction(async (entityManager) => {
      const newUser = new User();

      newUser.email = input.email;
      newUser.hash = hash;
      newUser.firstName = input.firstName;
      newUser.lastName = input.lastName;

      await entityManager.save(newUser);

      const token = createVerifyToken(newUser);

      await sendSignUpEmail(newUser, token);
    });

    response
      .status(201)
      .json({ msg: "Check your email to verify your account" });
  }

  async verifyUser(request: Request, response: Response) {
    const token = request.query.token as string;

    if (!token) {
      throw new CustomAPIError("Missing verify token", StatusCodes.BAD_REQUEST);
    }

    const id = decodeVerifyToken(token);

    await this.userRepository.update({ id }, { verified: true });

    return response.status(200).json({ msg: "Account has been verified!" });
  }

  async login(request: Request, response: Response) {
    const input: Login = request.body;

    loginSchema.validateSync(input, { strict: true, abortEarly: false });

    const user = await this.userRepository.findOne({
      where: { email: input.email, verified: true },
    });

    if (!user) {
      throw new CustomAPIError(
        "Incorrect email or password",
        StatusCodes.BAD_REQUEST
      );
    }

    const passwordCorrect = await comparePassword(input.password, user.hash);

    if (!passwordCorrect) {
      throw new CustomAPIError(
        "Incorrect email or password",
        StatusCodes.BAD_REQUEST
      );
    }

    const token = createAuthToken(user);

    response.status(200).json({ token });
  }
}
