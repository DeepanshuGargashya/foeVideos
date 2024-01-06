import express from "express";
import bodyParser from "body-parser";
import foeVideosAuth from "./src/api/index.js";
import logger from "./src/loaders/logger.js";
import { ErrorHandler, APIResponse } from "./src/utility/index.js";
import celebrate from "celebrate";
import { OpticMiddleware } from "@useoptic/express-middleware";
import httpContext from "express-http-context";

import cors from "cors";
const app = express();
const port = 8080;

import db from "./db.js";
const specialCharsRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g;

app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "500mb" }));

app.use(cors());

app
  .listen(port, () => {
    console.log("server is running on port 4000");
  })
  .on("error", (err) => {
    logger.error(err);
    process.exit(1);
  });

app.use("/api", foeVideosAuth);

// for logger
app.use(httpContext.middleware);
// API Documentation
app.use(
  OpticMiddleware({
    enabled: process.env.NODE_ENV !== "production",
  })
);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err["status"] = 404;
  next(err);
});

/// error handlers
app.use((err, req, res, next) => {
  /**
   * Handle 401 thrown by express-jwt library
   */
  if (err.name === "UnauthorizedError") {
    return res.status(err.status).send({ message: err.message }).end();
  }
  return next(err);
});

app.use((err, req, res, next) => {
  logger.error("Instance of Bad error:", err);
  if (err instanceof ErrorHandler.BadError || err.name === "BadError") {
    return APIResponse.badRequest(res, err.message, {});
  } else if (err.status && err.status == 404) {
    return APIResponse.notFound(res, err.message, "");
  } else if (celebrate.isCelebrateError(err)) {
    const validationError = err.details.get("body");
    const errorMessage = validationError
      ? validationError.details
          .map((detail) => detail.message.replace(specialCharsRegex, ""))
          .join(", ")
      : "Validation error";

    return APIResponse.badRequest(res, errorMessage, {});
  } else {
    logger.info("error in else");
    logger.debug("error is %o ", err);
    logger.error(
      `Unhandled error\t${JSON.stringify(req.headers)}\t${JSON.stringify(
        req.path
      )}\t${JSON.stringify(req.body)}`
    );
    return APIResponse.internalServerError(
      res,
      `Oops! This shouldn't have happened. Please try this in some time. We sincerely apologise for the inconvenience caused.`,
      ""
    );
  }
});
