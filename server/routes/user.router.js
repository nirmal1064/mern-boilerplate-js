const userRouter = require("express").Router();
const {
  register,
  login,
  home,
  logOut
} = require("../controllers/user.controller");
const { verifyToken, sanitizeUserInput } = require("../middlewares");

userRouter.post("/register", sanitizeUserInput(), register);
userRouter.post("/login", sanitizeUserInput(), login);
userRouter.get("/home", verifyToken, home);
userRouter.post("/logout", logOut);

module.exports = userRouter;
