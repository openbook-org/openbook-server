import { RequestHandler } from "express";

export const logger = (message: String) => {
  const currentDate = new Date();
  const dateTime =
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds();

  console.log(dateTime, message);
};


export const requestUriLoggerMiddlware: RequestHandler = (req, res, next) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  const requestMethod = req.method
  const currentDate = new Date();
  const dateTime = currentDate.getHours() + ":"  
  + currentDate.getMinutes() + ":" 
  + currentDate.getSeconds();

  console.log(requestMethod, dateTime, fullUrl);


  next()
}