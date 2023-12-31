// import jwt from "express-jwt";
// import config from "@/config";
// import { ErrorHandler } from "@/utility";

// /**
//  * We are assuming that the JWT will come in a header with the form
//  *
//  * Authorization: Bearer ${JWT}
//  *
//  * But it could come in a query parameter with the name that you want like
//  * GET https://my-bulletproof-api.com/stats?apiKey=${JWT}
//  * Luckily this API follow _common sense_ ergo a _good design_ and don't allow that ugly stuff
//  */
// const getTokenFromHeader = (req) => {
//   /**
//    * @TODO Edge and Internet Explorer do some weird things with the headers
//    * So I believe that this should handle more 'edge' cases ;)
//    */

//   console.log("Algorithem:", config.jwtAlgorithm);
//   if (
//     (req.headers.authorization &&
//       req.headers.authorization.split(" ")[0] === "Token") ||
//     (req.headers.authorization &&
//       req.headers.authorization.split(" ")[0] === "Bearer")
//   ) {
//     return req.headers.authorization.split(" ")[1];
//   }
//   throw new ErrorHandler.BadError("You are not authenticated.");
// };

// const isAuth = jwt({
//   secret: config.jwtSecret, // The _secret_ to sign the JWTs
//   credentialsRequired: false,
//   algorithms: [config.jwtAlgorithm], // JWT Algorithm
//   userProperty: "token", // Use req.token to store the JWT
//   getToken: getTokenFromHeader, // How to extract the JWT from the request
// });

// export default isAuth;
