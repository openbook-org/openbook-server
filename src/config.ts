import dotenv from "dotenv";

dotenv.config();

const conf = {
  ENV: process.env.ENVIRONMENT,
  MONGODB_URI: process.env.MONOGDB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  PORT: process.env.PORT,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
};

export default conf;
