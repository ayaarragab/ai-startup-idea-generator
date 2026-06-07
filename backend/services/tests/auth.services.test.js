/**
 * Unit Test Suite — auth.services.js
 *
 * Coverage Checklist
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. findUser(email)
 *    Purpose: Look up a user by email and return the plain JSON record.
 *    Scenarios:
 *      - Returns user JSON when User.findOne finds a record
 *      - Returns undefined when no user is found
 *      - Passes the correct email filter to User.findOne
 *      - Propagates User.findOne rejection
 *      - Propagates toJSON errors from the returned user instance
 *
 * 2. findUserById(id)
 *    Purpose: Look up a user by id and return the plain JSON record.
 *    Scenarios:
 *      - Returns user JSON when User.findByPk finds a record
 *      - Returns undefined when no user is found
 *      - Passes the correct id to User.findByPk
 *      - Propagates User.findByPk rejection
 *      - Propagates toJSON errors from the returned user instance
 *
 * 3. handleExistingUser(user, password, res)
 *    Purpose: Verify an existing user, issue cookies, and return a login response.
 *    Scenarios:
 *      - Returns 200 JSON when password comparison succeeds
 *      - Returns 401 JSON when password comparison fails
 *      - Generates both access and refresh tokens for the authenticated user
 *      - Sets both cookies with the expected security options
 *      - Uses user id/username payload for token generation
 *      - Does not set cookies or tokens when the password is incorrect
 *      - Propagates compareTexts rejection
 *
 * 4. handleNewUser(fullName, email, password, res)
 *    Purpose: Register a new user, generate OTP, issue cookies, and send email.
 *    Scenarios:
 *      - Hashes password and OTP before creation
 *      - Creates the user with the expected payload and verification defaults
 *      - Issues access and refresh cookies with the expected options
 *      - Sends verification email with the generated OTP
 *      - Returns 200 JSON with the new user payload
 *      - Uses Date.now() to compute otpExpires
 *      - Propagates hashText rejection for password or OTP hashing
 *      - Propagates User.create rejection
 *      - Propagates sendVerificationEmail rejection
 *      - Uses generated tokens from the created user id/username
 *
 * 5. handleOAuthSignup(payload)
 *    Purpose: Generate access and refresh tokens for an OAuth payload.
 *    Scenarios:
 *      - Returns both tokens for a valid payload
 *      - Passes the payload to both token generators
 *      - Works with minimal payloads
 *
 * TEST COVERAGE REPORT
 * ─────────────────────────────────────────────────────────────────────────────
 * | Function | Covered Cases | Missing Cases | Coverage Confidence |
 * |----------|--------------|---------------|--------------------|
 * | findUser | lookup success, not-found, call args, rejection, toJSON failure | None | High |
 * | findUserById | lookup success, not-found, call args, rejection, toJSON failure | None | High |
 * | handleExistingUser | success path, failure path, cookie side effects, token generation, compare rejection | None | High |
 * | handleNewUser | hash/create/email/token/cookie success, Date.now use, rejection propagation | None | High |
 * | handleOAuthSignup | token generation and return shape | None | High |
 *
 * Final checklist:
 * - Every exported function has tests: yes
 * - Every branch has tests: yes
 * - Every exception path has tests: yes
 * - No function was skipped: yes
 */

import { jest } from "@jest/globals";

const mockHashText = jest.fn();
const mockCompareTexts = jest.fn();
const mockGenerateOTP = jest.fn();
const mockSendVerificationEmail = jest.fn();
const mockGenerateAccessToken = jest.fn();
const mockGenerateRefreshToken = jest.fn();
const mockUserFindOne = jest.fn();
const mockUserFindByPk = jest.fn();
const mockUserCreate = jest.fn();

jest.unstable_mockModule("../../utils/hashing.utils.js", () => ({
  hashText: mockHashText,
  compareTexts: mockCompareTexts,
}));

jest.unstable_mockModule("../../utils/email.utils.js", () => ({
  generateOTP: mockGenerateOTP,
  sendVerificationEmail: mockSendVerificationEmail,
}));

jest.unstable_mockModule("../../utils/jwt.utils.js", () => ({
  generateAccessToken: mockGenerateAccessToken,
  generateRefreshToken: mockGenerateRefreshToken,
}));

jest.unstable_mockModule("../../models/index.js", () => ({
  default: {
    User: {
      findOne: mockUserFindOne,
      findByPk: mockUserFindByPk,
      create: mockUserCreate,
    },
  },
}));

const {
  findUser,
  findUserById,
  handleExistingUser,
  handleNewUser,
  handleOAuthSignup,
} = await import("../auth.services.js");

const createResMock = () => {
  const res = {
    cookie: jest.fn(),
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("auth.services", () => {
  describe("findUser", () => {
    test("returns the JSON representation of the found user", async () => {
      const user = {
        toJSON: jest.fn().mockReturnValue({ id: 1, email: "a@test.com" }),
      };
      mockUserFindOne.mockResolvedValue(user);

      const result = await findUser("a@test.com");

      expect(mockUserFindOne).toHaveBeenCalledWith({
        where: { email: "a@test.com" },
      });
      expect(user.toJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 1, email: "a@test.com" });
    });

    test("returns undefined when no user is found", async () => {
      mockUserFindOne.mockResolvedValue(null);

      const result = await findUser("missing@test.com");

      expect(result).toBeUndefined();
    });

    test("propagates findOne rejection", async () => {
      const error = new Error("lookup failed");
      mockUserFindOne.mockRejectedValue(error);

      await expect(findUser("fail@test.com")).rejects.toThrow("lookup failed");
    });

    test("propagates toJSON failures from the user instance", async () => {
      const error = new Error("toJSON failed");
      const user = {
        toJSON: jest.fn().mockImplementation(() => {
          throw error;
        }),
      };
      mockUserFindOne.mockResolvedValue(user);

      await expect(findUser("a@test.com")).rejects.toThrow("toJSON failed");
    });
  });

  describe("findUserById", () => {
    test("returns the JSON representation of the found user", async () => {
      const user = {
        toJSON: jest.fn().mockReturnValue({ id: 42, email: "b@test.com" }),
      };
      mockUserFindByPk.mockResolvedValue(user);

      const result = await findUserById(42);

      expect(mockUserFindByPk).toHaveBeenCalledWith(42);
      expect(user.toJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 42, email: "b@test.com" });
    });

    test("returns undefined when no user is found", async () => {
      mockUserFindByPk.mockResolvedValue(null);

      const result = await findUserById(404);

      expect(result).toBeUndefined();
    });

    test("propagates findByPk rejection", async () => {
      const error = new Error("findByPk failed");
      mockUserFindByPk.mockRejectedValue(error);

      await expect(findUserById(10)).rejects.toThrow("findByPk failed");
    });

    test("propagates toJSON failures from the user instance", async () => {
      const error = new Error("toJSON failed");
      const user = {
        toJSON: jest.fn().mockImplementation(() => {
          throw error;
        }),
      };
      mockUserFindByPk.mockResolvedValue(user);

      await expect(findUserById(10)).rejects.toThrow("toJSON failed");
    });
  });

  describe("handleExistingUser", () => {
    test("returns 200 and sets cookies when the password matches", async () => {
      const res = createResMock();
      const user = { id: 7, username: "alice", password: "hashed-pass" };
      mockCompareTexts.mockResolvedValue(true);
      mockGenerateAccessToken.mockReturnValue("access-token");
      mockGenerateRefreshToken.mockReturnValue("refresh-token");

      const result = await handleExistingUser(user, "plain-pass", res);

      expect(mockCompareTexts).toHaveBeenCalledWith(
        "plain-pass",
        "hashed-pass",
      );
      expect(mockGenerateAccessToken).toHaveBeenCalledWith({
        id: 7,
        username: "alice",
      });
      expect(mockGenerateRefreshToken).toHaveBeenCalledWith({
        id: 7,
        username: "alice",
      });
      expect(res.cookie).toHaveBeenCalledWith("accessToken", "access-token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 15 * 60 * 1000,
      });
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", "refresh-token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 60 * 60 * 24 * 1000,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User logged in successfully",
      });
      expect(result).toBe(res);
    });

    test("returns 401 when the password does not match", async () => {
      const res = createResMock();
      const user = { id: 7, username: "alice", password: "hashed-pass" };
      mockCompareTexts.mockResolvedValue(false);

      const result = await handleExistingUser(user, "wrong-pass", res);

      expect(mockGenerateAccessToken).not.toHaveBeenCalled();
      expect(mockGenerateRefreshToken).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Incorrect password" });
      expect(result).toBe(res);
    });

    test("propagates compareTexts rejection", async () => {
      const res = createResMock();
      const error = new Error("compare failed");
      mockCompareTexts.mockRejectedValue(error);

      await expect(
        handleExistingUser({ password: "x" }, "y", res),
      ).rejects.toThrow("compare failed");
    });
  });

  describe("handleNewUser", () => {
    test("creates a user, issues cookies, sends email, and returns the registration response", async () => {
      const res = createResMock();
      const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
      mockHashText
        .mockResolvedValueOnce("hashed-password")
        .mockResolvedValueOnce("hashed-otp");
      mockGenerateOTP.mockReturnValue("123456");
      mockUserCreate.mockResolvedValue({
        id: 55,
        fullName: "Alice Example",
        email: "alice@test.com",
        username: "alice",
      });
      mockGenerateAccessToken.mockReturnValue("access-token-new");
      mockGenerateRefreshToken.mockReturnValue("refresh-token-new");
      mockSendVerificationEmail.mockResolvedValue(undefined);

      const result = await handleNewUser(
        "Alice Example",
        "alice@test.com",
        "plain-pass",
        res,
      );

      expect(mockHashText).toHaveBeenNthCalledWith(1, "plain-pass");
      expect(mockGenerateOTP).toHaveBeenCalledTimes(1);
      expect(mockHashText).toHaveBeenNthCalledWith(2, "123456");
      expect(mockUserCreate).toHaveBeenCalledWith({
        fullName: "Alice Example",
        email: "alice@test.com",
        otp: "hashed-otp",
        password: "hashed-password",
        otpExpires: 1_700_000_000_000 + 10 * 60 * 1000,
        isVerified: false,
      });
      expect(mockGenerateAccessToken).toHaveBeenCalledWith({
        id: 55,
        username: "alice",
      });
      expect(mockGenerateRefreshToken).toHaveBeenCalledWith({
        id: 55,
        username: "alice",
      });
      expect(res.cookie).toHaveBeenCalledWith(
        "accessToken",
        "access-token-new",
        {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 60 * 15 * 1000,
        },
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "refresh-token-new",
        {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 60 * 60 * 24 * 1000,
        },
      );
      expect(mockSendVerificationEmail).toHaveBeenCalledWith(
        "alice@test.com",
        "123456",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: {
          id: 55,
          fullName: "Alice Example",
          email: "alice@test.com",
        },
      });
      expect(result).toBe(res);
      nowSpy.mockRestore();
    });

    test("propagates hashText rejection for the password hash", async () => {
      const res = createResMock();
      mockHashText.mockRejectedValueOnce(new Error("hash failed"));

      await expect(handleNewUser("A", "a@test.com", "pw", res)).rejects.toThrow(
        "hash failed",
      );
      expect(mockGenerateOTP).not.toHaveBeenCalled();
      expect(mockUserCreate).not.toHaveBeenCalled();
    });

    test("propagates hashText rejection for the OTP hash", async () => {
      const res = createResMock();
      mockHashText
        .mockResolvedValueOnce("hashed-password")
        .mockRejectedValueOnce(new Error("otp hash failed"));
      mockGenerateOTP.mockReturnValue("654321");

      await expect(handleNewUser("A", "a@test.com", "pw", res)).rejects.toThrow(
        "otp hash failed",
      );
      expect(mockUserCreate).not.toHaveBeenCalled();
    });

    test("propagates User.create rejection", async () => {
      const res = createResMock();
      const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
      mockHashText
        .mockResolvedValueOnce("hashed-password")
        .mockResolvedValueOnce("hashed-otp");
      mockGenerateOTP.mockReturnValue("123456");
      mockUserCreate.mockRejectedValue(new Error("create failed"));

      await expect(
        handleNewUser("Alice Example", "alice@test.com", "plain-pass", res),
      ).rejects.toThrow("create failed");
      nowSpy.mockRestore();
    });

    test("propagates sendVerificationEmail rejection after user creation", async () => {
      const res = createResMock();
      const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
      mockHashText
        .mockResolvedValueOnce("hashed-password")
        .mockResolvedValueOnce("hashed-otp");
      mockGenerateOTP.mockReturnValue("123456");
      mockUserCreate.mockResolvedValue({
        id: 55,
        fullName: "Alice Example",
        email: "alice@test.com",
        username: "alice",
      });
      mockGenerateAccessToken.mockReturnValue("access-token-new");
      mockGenerateRefreshToken.mockReturnValue("refresh-token-new");
      mockSendVerificationEmail.mockRejectedValue(new Error("email failed"));

      await expect(
        handleNewUser("Alice Example", "alice@test.com", "plain-pass", res),
      ).rejects.toThrow("email failed");
      nowSpy.mockRestore();
    });

    test("uses the generated OTP value and hashes it before create", async () => {
      const res = createResMock();
      const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
      mockHashText
        .mockResolvedValueOnce("hashed-password")
        .mockResolvedValueOnce("hashed-otp");
      mockGenerateOTP.mockReturnValue("999999");
      mockUserCreate.mockResolvedValue({
        id: 10,
        fullName: "Test User",
        email: "test@test.com",
        username: "testuser",
      });
      mockGenerateAccessToken.mockReturnValue("access-token-new");
      mockGenerateRefreshToken.mockReturnValue("refresh-token-new");
      mockSendVerificationEmail.mockResolvedValue(undefined);

      await handleNewUser("Test User", "test@test.com", "pw", res);

      expect(mockSendVerificationEmail).toHaveBeenCalledWith(
        "test@test.com",
        "999999",
      );
      expect(mockUserCreate).toHaveBeenCalledWith(
        expect.objectContaining({ otp: "hashed-otp" }),
      );
      nowSpy.mockRestore();
    });
  });

  describe("handleOAuthSignup", () => {
    test("returns both tokens generated from the payload", () => {
      mockGenerateAccessToken.mockReturnValue("oauth-access");
      mockGenerateRefreshToken.mockReturnValue("oauth-refresh");

      const payload = {
        id: 1,
        username: "oauth-user",
        email: "oauth@test.com",
      };
      const result = handleOAuthSignup(payload);

      expect(mockGenerateAccessToken).toHaveBeenCalledWith(payload);
      expect(mockGenerateRefreshToken).toHaveBeenCalledWith(payload);
      expect(result).toEqual({
        accessToken: "oauth-access",
        refreshToken: "oauth-refresh",
      });
    });

    test("works with a minimal payload", () => {
      mockGenerateAccessToken.mockReturnValue("access-only");
      mockGenerateRefreshToken.mockReturnValue("refresh-only");

      const result = handleOAuthSignup({ id: 9 });

      expect(result).toEqual({
        accessToken: "access-only",
        refreshToken: "refresh-only",
      });
    });
  });
});
