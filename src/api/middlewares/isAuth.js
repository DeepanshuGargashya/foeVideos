import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import { ErrorHandler } from "../../utility/index.js";

const getTokenFromHeader = (req) => {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  throw new ErrorHandler.BadError("You are not authenticated.");
};

const JWT_SECRET = "p4sta.w1th-b0logn3s3-s@uce";
const JWT_ALGO = "HS256";

const isAuth = (req, res, next) =>
  expressJwt.expressjwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
    algorithms: [JWT_ALGO],
    getToken: getTokenFromHeader,
  })(req, res, (err) => {
    if (err) {
      // return next(new ErrorHandler.BadError(err));
      // console.log({ ...err, data: {}, error: true });
      // console.log({
      //   ...err,
      //   code: {
      //     error: true,
      //     message: "invalid token",
      //   },
      // });
      return next(err);
    }

    // Set the decoded token on the request object
    if (req.auth) {
      req.token = req.auth;
    } else {
      throw new ErrorHandler.BadError("Invalid token");
    }

    next();
  });

export default isAuth;
