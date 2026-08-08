const { askPortfolioAssistant } = require("../services/aiService");
const { validateQuestion } = require("../validators/aiValidators");

async function ask(req, res, next) {
  try {
    const validationError = validateQuestion(req.body.question);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const question = req.body.question.trim();
    const result = await askPortfolioAssistant(req.user.id, question);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { ask };
