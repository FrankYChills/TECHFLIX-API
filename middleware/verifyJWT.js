const jwt = require("jsonwebtoken");
// apply this middleware to the protected routes
// this ensures a user has a valid access token
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized | Token required" });
  }
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized | Invalid Access Token Format" });
  }

  const token = authHeader.split(" ")[1];

  // verify access token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({
          message: "Unauthorized | Invalid Access Expired! Please Login Again",
        });
    }
    // set req user as decoded data from jwt
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
