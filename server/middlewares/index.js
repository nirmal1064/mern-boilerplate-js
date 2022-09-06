const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const sanitizeUserInput = () => {
  return [body("username").trim().escape(), body("password").trim().escape()];
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).send({ auth: false, msg: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: `Invalid Token ${err.message}` });
  }
};

module.exports = { verifyToken, sanitizeUserInput };
