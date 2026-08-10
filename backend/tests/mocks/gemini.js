// Mocks @google/genai so AI assistant tests never make a real (paid,
// network-dependent) call to Gemini. Must be required BEFORE aiService.
const mockGenerateContent = jest.fn();

class MockApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: { generateContent: mockGenerateContent },
  })),
  ApiError: MockApiError,
}));

module.exports = { mockGenerateContent, MockApiError };
