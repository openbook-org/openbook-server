import { NextFunction, Request, Response } from "express";
import { ApiErrorClass, ErrorTypes } from "../../shared/apiErrorClass";
import { HttpStatusCode } from "../../shared/constant/httpStatusCodes";
import User from "../../models/user/user";
import { encryptPassword } from "../../utils/password";

interface RegisterUserBody {
  email: string;
  name: string;
  password: string;
}

export interface RegisterRequest extends Request {
  body: RegisterUserBody;
}

// POST /users
export const registerUser = async (
  req: RegisterRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, name } = req.body;
  try {
    // encrypt password
    const password = await encryptPassword(req.body.password);

    // create user
    const user = new User({
      email,
      name,
      password,
    });

    const registerContent = await user.save();

    // remove password from response
    registerContent.password = undefined;

    return res.status(HttpStatusCode.OK).json({
      success: true,
      content: {
        user: registerContent,
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
