const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.header("Authorization");

  if (!header) {
    return res.status(401).json({ message: "Access denied" });
  }

  const token = header.replace("Bearer ", "");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired. Please login again." });
  }
};