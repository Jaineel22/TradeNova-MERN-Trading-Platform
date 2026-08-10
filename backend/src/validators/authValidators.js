const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_-]{3,30}$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

function validateRegisterInput({ username, email, password } = {}) {
  if (!username || !email || !password) {
    return "All fields required";
  }

  if (typeof username !== "string" || !USERNAME_PATTERN.test(username.trim())) {
    return "Username must be 3-30 characters and contain only letters, numbers, underscores or hyphens";
  }

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return "Enter a valid email address";
  }

  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer`;
  }

  return null;
}

module.exports = { validateRegisterInput };
