const jwt = require("jsonwebtoken");

require("dotenv").config();

const verifyJWT = (req, res, next) => {
  let test = "fasfasf".startsWith;
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"]; // Bearer token
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authentication error from verifyJWT()" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Authentication error from verifyJWT()=> jwt.verify()", // invalid token
    });
  }
  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  //   if (err)
  //     return res.status(403).json({
  //       message: "Authentication error from verifyJWT()=> jwt.verify()", // invalid token
  //     });
  //   console.log({ decoded });
  //   req.user = decoded.username;
  //   next();
  // });
};

module.exports = verifyJWT;
