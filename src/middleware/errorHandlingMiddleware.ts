import { ErrorRequestHandler } from "express";
import { ApiErrorClass, ErrorTypes, IError } from "../shared/apiErrorClass";

/**
 * Error handling middleware.
 */
export const errorHandlingMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let error: IError = {
    type: ErrorTypes.SERVICE_ERROR,
    message: "Service error",
    errorFields: [],
  };
  if (err instanceof ApiErrorClass) {
    error.type = err.type;
    error.message = err.message;
    error.errorFields = err.errorFields;
    statusCode = err.statusCode;
  }

  return res.status(statusCode).json({ success: false, ...error });
};
