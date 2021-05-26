const jwt = require("jsonwebtoken");
const config = require("config");

const jwtPrivateKey = process.env.JWTPRIVATEKEY;
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  console.log(token);
  if (!token) return res.status(401).send("Access Denied! Please login First.");

  try {
    const decode = jwt.verify(token, jwtPrivateKey);
    console.log(decode);
    req.user = decode;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
