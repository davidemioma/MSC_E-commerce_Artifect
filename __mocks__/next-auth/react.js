module.exports = {
  signIn: jest.fn(),
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: "Test User",
        email: "test@example.com",
      },
    },
    status: "authenticated",
  })),
};
