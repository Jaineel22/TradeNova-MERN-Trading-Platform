function validateRegisterInput({ username, email, password } = {}) {
  if (!username || !email || !password) {
    return "All fields required";
  }
  return null;
}

module.exports = { validateRegisterInput };
