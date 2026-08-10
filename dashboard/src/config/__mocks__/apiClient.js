// Manual mock for the shared axios instance. Every dashboard test that
// touches a component making API calls must call jest.mock("../config/apiClient")
// (or the correct relative path) so no test ever depends on a live backend.
const apiClient = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
};

export default apiClient;
