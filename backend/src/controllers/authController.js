const { registerUser, loginUser } = require("../services/authService");

async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
