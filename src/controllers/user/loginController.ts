import { NextFunction, Request, Response } from "express";
import { ApiErrorClass, ErrorTypes } from "../../shared/apiErrorClass";
import { HttpStatusCode } from "../../shared/constant/httpStatusCodes";
import User from "../../models/user/user";
import { comparePassword } from "../../utils/password";
import { generateJWTToken } from "../../utils/jwt";

interface LoginUserBody {
  email: string;
  password: string;
}

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as LoginUserBody;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return next(
        new ApiErrorClass(
          ErrorTypes.NOT_AUTHORIZED,
          "Invalid Credentials",
          HttpStatusCode.NOT_AUTHORIZED
        )
      );
    }

    // check password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return next(
        new ApiErrorClass(
          ErrorTypes.NOT_AUTHORIZED,
          "Invalid Credentials",
          HttpStatusCode.NOT_AUTHORIZED
        )
      );
    }

    // generate token
    const token = generateJWTToken(user._id.toString());

    // remove password from response
    user.password = undefined;

    return res.status(HttpStatusCode.OK).json({
      success: true,
      content: {
        token,
        user,
      },
    });
  } catch (err: any) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        err.message,
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};
