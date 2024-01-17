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

const isAuth = expressJwt.expressjwt({
  secret: JWT_SECRET,
  credentialsRequired: false,
  algorithms: [JWT_ALGO],
  userProperty: "token",
  getToken: getTokenFromHeader,
});

export default isAuth;
