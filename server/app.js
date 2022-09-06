require("dotenv").config();
require("./config/db").connect();
const express = require("express");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/user.router");

const origins = process.env.ALLOWED_ORIGINS?.split(",");
const corsOptions = { origin: origins, credentials: true };

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", userRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Hello World!" });
});

module.exports = app;
