import dotenv from "dotenv";

dotenv.config();

const conf = {
  environment: process.env.ENVIRONMENT,
  mongodbURI: process.env.MONOGDB_URI,
  PORT: process.env.PORT,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
};

export default conf;
