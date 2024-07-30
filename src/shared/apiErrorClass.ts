import { HttpStatusCode } from "./constant/httpStatusCodes";

export enum ErrorTypes {
  // Client has sent a request which they should not send
  INVALID_REQUEST = "INVALID_REQUEST",
  // Client has sent a request that duplicates a unique resource
  DUPLICATE = "DUPLICATE",
  // Client has sent a request with invalid body
  INVALID_BODY = "INVALID_BODY",
  // Client has sent a request that utilizes a resource that does not exist
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  // Service has revieved valid request but failed
  SERVICE_ERROR = "SERVICE_ERROR",
  // User is not authorized to access the resource
  NOT_AUTHORIZED = "NOT_AUTHORIZED",
  // User registration is incomplete
  REGISTRATION_INCOMPLETE = "REGISTRATION_INCOMPLETE",
}

export interface IErrorField {
  field: string;
  message: string;
}

export interface IError {
  type: ErrorTypes;
  message: string;
  errorFields: IErrorField[];
}

export class ApiErrorClass extends Error {
  public type: ErrorTypes;
  public message: string;
  public errorFields: IErrorField[];
  public statusCode: HttpStatusCode;

  public constructor(
    type: ErrorTypes,
    message: string,
    statusCode: number,
    errorFields: IErrorField[] = []
  ) {
    super(message);
    this.type = type ?? ErrorTypes.SERVICE_ERROR;
    this.message = message ?? "Service error";
    this.statusCode = statusCode ?? HttpStatusCode.SERVICE_ERROR;
    this.errorFields = errorFields;
  }
}
