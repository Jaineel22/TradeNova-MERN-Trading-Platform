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

  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });
  if (existingUser) {
    throw makeError("Username or email is already in use", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });
  } catch (err) {
    // Closes the race between the uniqueness check above and this insert -
    // without this, a duplicate-key error would otherwise propagate as a
    // raw MongoDB error (leaking collection/index names) via the generic
    // error handler instead of a clean 400.
    if (err.code === 11000) {
      throw makeError("Username or email is already in use", 400);
    }
    throw err;
  }

  return { message: "User registered successfully" };
}

async function loginUser({ email, password }) {
  // Same generic message whether the account doesn't exist or the password
  // is wrong - distinguishing the two lets an attacker enumerate registered
  // emails.
  const invalidCredentials = () => makeError("Invalid credentials", 400);

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    throw invalidCredentials();
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw invalidCredentials();
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw invalidCredentials();
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, username: user.username };
}

module.exports = { registerUser, loginUser };
