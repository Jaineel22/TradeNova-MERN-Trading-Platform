module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  // err.status is only ever set on errors we deliberately threw with a
  // client-safe message (see makeError() in the services/controllers).
  // Anything without it is an unexpected error - possibly a raw DB/library
  // error whose .message could contain internal details (collection names,
  // connection strings, file paths) - so it gets a generic message instead.
  // Full detail is still logged above for debugging.
  const status = err.status || 500;
  const message = err.status ? err.message : "Something went wrong. Please try again.";

  res.status(status).json({ message });
};
