declare namespace Express {
  interface Request {
      authenticated: boolean;
      authenticatedUser: import("../models/user/IUser").IUser
      authenticatedUserId: string;
      bearerToken: string;
  }
}