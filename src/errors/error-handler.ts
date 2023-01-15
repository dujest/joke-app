import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError } from "jsonwebtoken";
import { ValidationError } from "yup";
import { CustomAPIError } from "./custom-error";

export const errorHandlerMiddleware = (
  err: CustomAPIError | ValidationError | JsonWebTokenError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Juka je kralj");
  console.log(err.constructor.name);
  console.error(err);

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ msg: err.errors });
  }
  if (err instanceof JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: err.message });
  }
  return res.status(500).json({ msg: "Something went wrong, try again!" });
};
