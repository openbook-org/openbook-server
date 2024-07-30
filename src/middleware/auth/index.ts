import { NextFunction, Request, Response } from "express";
import User from "../../models/user/user";
import { HttpStatusCode } from "../../shared/constant/httpStatusCodes";
import { ApiErrorClass, ErrorTypes } from "../../shared/apiErrorClass";
import conf from "../../config";
import jwt from "jsonwebtoken";

export const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers.authorization;
    const token = bearerToken?.split(" ")[1];
    req.authenticated = false; // Assume false
    req.authenticatedUser = null;

    if (token) {
      jwt.verify(token, conf.JWT_SECRET, async (err, decoded: any) => {
        if (err) {
          return next(
            new ApiErrorClass(
              ErrorTypes.NOT_AUTHORIZED,
              "User is not allowed to perform this operation",
              HttpStatusCode.NOT_AUTHORIZED
            )
          );
        }
        const authenticatedUser = await User.findById(decoded.id);
        if (authenticatedUser) {
          req.authenticated = true;
          req.authenticatedUser = authenticatedUser;
          req.authenticatedUserId = authenticatedUser._id.toString();
          return next();
        }
        console.log("User not found");
        return next(
          new ApiErrorClass(
            ErrorTypes.REGISTRATION_INCOMPLETE,
            "Email is not registered, please register first",
            HttpStatusCode.BAD_REQUEST
          )
        );
      });
      return;
    }
    console.log("Token not found");
    return next(
      new ApiErrorClass(
        ErrorTypes.REGISTRATION_INCOMPLETE,
        "Email is not registered, please register first",
        HttpStatusCode.BAD_REQUEST
      )
    );
  } catch (error) {
    return next(
      new ApiErrorClass(
        ErrorTypes.NOT_AUTHORIZED,
        "User is not allowed to perform this operation",
        HttpStatusCode.NOT_AUTHORIZED
      )
    );
  }
};
