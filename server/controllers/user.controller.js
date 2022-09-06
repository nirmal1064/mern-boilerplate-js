const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_VALUE = Number(process.env.SALT_VALUE);

const register = async (req, res) => {
  const { name, username, password } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ msg: "Please enter all the fields" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password should be atleast 6 characters" });
  }
  try {
    const existingUser = await User.findOne({
      username: username.toString().trim()
    });
    if (existingUser) {
      return res.status(409).json({ msg: "Existing User. Please login" });
    }
    const hashedPassword = bcrypt.hashSync(password, SALT_VALUE);
    const newUser = new User({
      name,
      username,
      password: hashedPassword
    });
    const user = await newUser.save();
    console.log("User created successfully");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 86400
    });
    res
      .status(201)
      .cookie("token", token, { httpOnly: true, sameSite: "strict" })
      .json({
        id: user._id,
        name: user.name,
        username: user.username,
        auth: true
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all the fields" });
  }
  try {
    const user = await User.findOne({ username: username.toString().trim() });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: 86400
    });
    res
      .status(200)
      .cookie("token", token, { httpOnly: true, sameSite: "strict" })
      .json({
        id: user.id,
        username: user.username,
        name: user.name,
        auth: true
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

const home = (req, res) => {
  res.status(200).json({ msg: `Welcome ${userId}` });
};

const logOut = (req, res) => {
  res.clearCookie("token").json({ msg: "Logged out successfully" });
};

module.exports = { register, login, home, logOut };
