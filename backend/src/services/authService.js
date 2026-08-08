const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { validateRegisterInput } = require("../validators/authValidators");

function makeError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function registerUser({ username, email, password }) {
  const validationError = validateRegisterInput({ username, email, password });
  if (validationError) {
    throw makeError(validationError, 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw makeError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return { message: "User registered successfully" };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw makeError("User not found", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw makeError("Invalid credentials", 400);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, username: user.username };
}

module.exports = { registerUser, loginUser };
