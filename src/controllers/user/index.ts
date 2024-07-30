import { NextFunction, Request, Response } from "express";
import User from "../../models/user/user";
import { ApiErrorClass, ErrorTypes } from "../../shared/apiErrorClass";
import { HttpStatusCode } from "../../shared/constant/httpStatusCodes";

// GET /users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find(
      {},
      {
        password: 0,
        email: 0,
      }
    );
    res.status(200).json({ success: true, content: users });
  } catch (error) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        `Service error`,
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};

// GET /users/:id
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id, {
      password: 0,
      email: 0,
    });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.status(200).json({ success: true, content: user });
  } catch (error) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        `Service error`,
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};

// GET /users/self
export const getAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.authenticatedUser;
    user.password = undefined;
    return res.status(HttpStatusCode.OK).json({
      success: true,
      content: {
        user: user,
      },
    });
  } catch (error: any) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        error.message,
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};

interface UpdateUserBody {
  email: string;
  name: string;
  positions: string[];
  // added subscription update to separate endpoint @ /users/:id/subscription
  // _authUser is added by the auth middleware
  _authUser: any;
}

export interface UpdateRequest extends Request {
  body: UpdateUserBody;
}

// PUT /users/:id
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.authenticatedUserId !== req.params.id) {
      return next(
        new ApiErrorClass(
          ErrorTypes.NOT_AUTHORIZED,
          "Unauthorized",
          HttpStatusCode.NOT_AUTHORIZED
        )
      );
    }

    // can't update email
    if (req.body.email) {
      return next(
        new ApiErrorClass(
          ErrorTypes.INVALID_REQUEST,
          "Email cannot be updated",
          HttpStatusCode.BAD_REQUEST
        )
      );
    }

    // remove password from update
    req.body.password = undefined;

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      return next(
        new ApiErrorClass(
          ErrorTypes.RESOURCE_NOT_FOUND,
          "User not found",
          HttpStatusCode.NOT_FOUND
        )
      );
    }

    user.password = undefined;

    res.status(200).json({ success: true, content: user });
  } catch (error: any) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        error.message,
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};

// DELETE /users/:id
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.authenticatedUserId !== req.params.id) {
      return next(
        new ApiErrorClass(
          ErrorTypes.NOT_AUTHORIZED,
          "Unauthorized",
          HttpStatusCode.NOT_AUTHORIZED
        )
      );
    }
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(
        new ApiErrorClass(
          ErrorTypes.RESOURCE_NOT_FOUND,
          "User not found",
          HttpStatusCode.NOT_FOUND
        )
      );
    }

    res.status(200).json({ success: true, content: user });
  } catch (error: any) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        error.message,
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};
