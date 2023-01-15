import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../data-source";
import { User } from "../entity/user";
import { CustomAPIError } from "../errors/custom-error";
import { decodeAuthToken } from "../service/jwt";

export async function authenticate(
  request: Request,
  respones: Response,
  next: NextFunction
) {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new CustomAPIError(
      "Missing authorization header token",
      StatusCodes.UNAUTHORIZED
    );
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw new CustomAPIError(
      "Authorization header token should be Bearer token",
      StatusCodes.UNAUTHORIZED
    );
  }

  if (!token) {
    throw new CustomAPIError(
      "Missing JWT Bearer token",
      StatusCodes.UNAUTHORIZED
    );
  }

  const userId = decodeAuthToken(token);

  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new CustomAPIError(
      `Missing user from token with ID: ${userId}`,
      StatusCodes.NOT_FOUND
    );
  }

  (request as any).user = user;

  next();
}
