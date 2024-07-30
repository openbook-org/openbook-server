import jwt from "jsonwebtoken";
import conf from "../config";

export const generateJWTToken = (id: string) => {
  return jwt.sign({ id }, conf.JWT_SECRET!, {
    expiresIn: conf.JWT_EXPIRE,
  });
};
