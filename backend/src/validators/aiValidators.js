const MAX_QUESTION_LENGTH = 500;

function validateQuestion(question) {
  if (typeof question !== "string") {
    return "question is required and must be a string";
  }

  if (!question.trim()) {
    return "question is required and must be a string";
  }

  if (question.trim().length > MAX_QUESTION_LENGTH) {
    return `question must be ${MAX_QUESTION_LENGTH} characters or fewer`;
  }

  return null;
}

module.exports = { validateQuestion, MAX_QUESTION_LENGTH };
