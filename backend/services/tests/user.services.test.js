/**
 * Unit Test Suite — user.services.js
 *
 * ─── Coverage Checklist ───────────────────────────────────────────────────────
 *
 * 1. updateUserData(id, updateValues)
 *    Purpose : Spreads updateValues into a User.update() call filtered by id.
 *              Returns true on success, false on any error (swallowed).
 *    Scenarios:
 *      ✓ Calls User.update with spread updateValues and correct where clause
 *      ✓ Returns true when User.update resolves
 *      ✓ Returns false when User.update rejects
 *      ✓ Works with a single-field updateValues object
 *      ✓ Works with a multi-field updateValues object
 *      ✓ Works with an empty updateValues object {}
 *      ✓ Works with various id types (number, string)
 *      ✓ Spread does NOT mutate the original updateValues reference
 *      ✓ Does NOT re-throw — error is swallowed, false is returned
 *
 * 2. updatePassword(id, newPassword)
 *    Purpose : Hashes newPassword via hashText(), then calls User.update()
 *              with { password: hashed }. Returns true on success, false on
 *              DB error. hashText errors propagate (not caught).
 *    Scenarios:
 *      ✓ Calls hashText with the provided newPassword
 *      ✓ Calls User.update with the hashed password and correct where clause
 *      ✓ Returns true when User.update resolves
 *      ✓ Returns false when User.update rejects
 *      ✓ Uses the hash returned by hashText (not the raw password)
 *      ✓ hashText is awaited before User.update is called
 *      ✓ Error from hashText propagates (is NOT caught by the inner try/catch)
 *      ✓ Does NOT re-throw DB errors — error is swallowed, false is returned
 *      ✓ Works with various id types (number, string)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { jest } from "@jest/globals";

// ─── Mock factories ───────────────────────────────────────────────────────────

const mockUserUpdate = jest.fn();

// jest.unstable_mockModule must be called before the dynamic import below.

jest.unstable_mockModule("../../models/index.js", () => ({
  default: {
    User: {
      update: mockUserUpdate,
    },
  },
}));

const mockHashText = jest.fn();

jest.unstable_mockModule("../../utils/hashing.utils.js", () => ({
  hashText: mockHashText,
}));

// ─── Import service under test (AFTER mocks are registered) ──────────────────

const { updateUserData, updatePassword } = await import(
  "../user.services.js"
);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Resets all mock state between tests */
beforeEach(() => {
  jest.clearAllMocks();
});

// ═════════════════════════════════════════════════════════════════════════════
// 1. updateUserData
// ═════════════════════════════════════════════════════════════════════════════

describe("updateUserData", () => {
  // ── Return values ──────────────────────────────────────────────────────────

  test("returns true when User.update resolves successfully", async () => {
    // Arrange
    mockUserUpdate.mockResolvedValue([1]); // Sequelize returns [affectedRows]

    // Act
    const result = await updateUserData(1, { name: "Alice" });

    // Assert
    expect(result).toBe(true);
  });

  test("returns false when User.update rejects", async () => {
    // Arrange
    mockUserUpdate.mockRejectedValue(new Error("DB connection lost"));

    // Act
    const result = await updateUserData(1, { name: "Alice" });

    // Assert
    expect(result).toBe(false);
  });

  // ── Correct arguments forwarded to User.update ─────────────────────────────

  test("calls User.update with spread updateValues as first argument", async () => {
    // Arrange
    const updateValues = { name: "Alice", email: "alice@example.com" };
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updateUserData(42, updateValues);

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      { name: "Alice", email: "alice@example.com" },
      expect.anything()
    );
  });

  test("calls User.update with correct where: { id } as second argument", async () => {
    // Arrange
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updateUserData(42, { name: "Alice" });

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.anything(),
      { where: { id: 42 } }
    );
  });

  test("calls User.update exactly once per invocation", async () => {
    // Arrange
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updateUserData(1, { name: "Alice" });

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledTimes(1);
  });

  // ── Various updateValues shapes ────────────────────────────────────────────

  test("works with a single-field updateValues object", async () => {
    // Arrange
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    const result = await updateUserData(1, { name: "Bob" });

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      { name: "Bob" },
      { where: { id: 1 } }
    );
    expect(result).toBe(true);
  });

  test("works with a multi-field updateValues object", async () => {
    // Arrange
    const updateValues = {
      name: "Carol",
      email: "carol@test.com",
      bio: "Hello",
      avatar: "url",
    };
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    const result = await updateUserData(7, updateValues);

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      updateValues,
      { where: { id: 7 } }
    );
    expect(result).toBe(true);
  });

  test("works with an empty updateValues object {}", async () => {
    // Arrange
    mockUserUpdate.mockResolvedValue([0]);

    // Act
    const result = await updateUserData(1, {});

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith({}, { where: { id: 1 } });
    expect(result).toBe(true);
  });

  // ── id variations ──────────────────────────────────────────────────────────

  test("forwards a numeric id correctly in the where clause", async () => {
    // Arrange
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updateUserData(99, { name: "Dave" });

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.anything(),
      { where: { id: 99 } }
    );
  });

  test("forwards a string id correctly in the where clause", async () => {
    // Arrange
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updateUserData("abc-uuid", { name: "Eve" });

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.anything(),
      { where: { id: "abc-uuid" } }
    );
  });

  // ── Spread behaviour ───────────────────────────────────────────────────────

  test("spread operator does not mutate the original updateValues reference", async () => {
    // Arrange
    const updateValues = { name: "Frank" };
    const originalRef = updateValues;
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updateUserData(1, updateValues);

    // Assert — the object passed to User.update is a spread copy, but since
    // Sequelize receives it internally we verify the original is untouched.
    expect(updateValues).toBe(originalRef);
    expect(updateValues).toEqual({ name: "Frank" });
  });

  // ── Error handling ─────────────────────────────────────────────────────────

  test("swallows the error and does NOT re-throw when User.update rejects", async () => {
    // Arrange
    mockUserUpdate.mockRejectedValue(new Error("Unexpected DB failure"));

    // Act + Assert — must NOT reject
    await expect(updateUserData(1, { name: "Ghost" })).resolves.toBe(false);
  });

  test("returns false for any DB error type (non-Error thrown value)", async () => {
    // Arrange — some drivers throw strings or plain objects
    mockUserUpdate.mockRejectedValue("string error");

    // Act
    const result = await updateUserData(1, { name: "Test" });

    // Assert
    expect(result).toBe(false);
  });

  test("does not call hashText — updateUserData has no dependency on hashing", async () => {
    // Arrange
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updateUserData(1, { name: "Alice" });

    // Assert
    expect(mockHashText).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. updatePassword
// ═════════════════════════════════════════════════════════════════════════════

describe("updatePassword", () => {
  // ── Return values ──────────────────────────────────────────────────────────

  test("returns true when hashing and User.update both succeed", async () => {
    // Arrange
    mockHashText.mockResolvedValue("hashed_secret");
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    const result = await updatePassword(1, "plaintext");

    // Assert
    expect(result).toBe(true);
  });

  test("returns false when User.update rejects (DB error)", async () => {
    // Arrange
    mockHashText.mockResolvedValue("hashed_secret");
    mockUserUpdate.mockRejectedValue(new Error("DB error"));

    // Act
    const result = await updatePassword(1, "plaintext");

    // Assert
    expect(result).toBe(false);
  });

  // ── hashText integration ───────────────────────────────────────────────────

  test("calls hashText with the provided newPassword", async () => {
    // Arrange
    mockHashText.mockResolvedValue("hashed_secret");
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updatePassword(5, "myP@ssw0rd");

    // Assert
    expect(mockHashText).toHaveBeenCalledWith("myP@ssw0rd");
  });

  test("calls hashText exactly once per invocation", async () => {
    // Arrange
    mockHashText.mockResolvedValue("hashed_secret");
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updatePassword(1, "pass");

    // Assert
    expect(mockHashText).toHaveBeenCalledTimes(1);
  });

  test("passes the hashed value (not the raw password) to User.update", async () => {
    // Arrange
    mockHashText.mockResolvedValue("$2b$10$hashedOutput");
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updatePassword(3, "rawPassword");

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      { password: "$2b$10$hashedOutput" },
      expect.anything()
    );
    // Raw password must never reach the DB layer
    expect(mockUserUpdate).not.toHaveBeenCalledWith(
      { password: "rawPassword" },
      expect.anything()
    );
  });

  // ── Correct arguments forwarded to User.update ─────────────────────────────

  test("calls User.update with { password: hashed } as first argument", async () => {
    // Arrange
    mockHashText.mockResolvedValue("hashed_pw");
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updatePassword(10, "secret");

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      { password: "hashed_pw" },
      expect.anything()
    );
  });

  test("calls User.update with correct where: { id } as second argument", async () => {
    // Arrange
    mockHashText.mockResolvedValue("hashed_pw");
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updatePassword(10, "secret");

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.anything(),
      { where: { id: 10 } }
    );
  });

  test("calls User.update exactly once per invocation", async () => {
    // Arrange
    mockHashText.mockResolvedValue("hashed_pw");
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updatePassword(1, "pass");

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledTimes(1);
  });

  // ── Ordering guarantee: hashText is awaited before User.update ─────────────

  test("hashText is called before User.update (ordering guarantee)", async () => {
    // Arrange — track call order
    const callOrder = [];
    mockHashText.mockImplementation(async () => {
      callOrder.push("hashText");
      return "hashed";
    });
    mockUserUpdate.mockImplementation(async () => {
      callOrder.push("userUpdate");
      return [1];
    });

    // Act
    await updatePassword(1, "pw");

    // Assert
    expect(callOrder).toEqual(["hashText", "userUpdate"]);
  });

  // ── id variations ──────────────────────────────────────────────────────────

  test("forwards a numeric id correctly in the where clause", async () => {
    // Arrange
    mockHashText.mockResolvedValue("h");
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updatePassword(77, "pw");

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.anything(),
      { where: { id: 77 } }
    );
  });

  test("forwards a string id correctly in the where clause", async () => {
    // Arrange
    mockHashText.mockResolvedValue("h");
    mockUserUpdate.mockResolvedValue([1]);

    // Act
    await updatePassword("uuid-string", "pw");

    // Assert
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.anything(),
      { where: { id: "uuid-string" } }
    );
  });

  // ── Error handling — DB error is swallowed ─────────────────────────────────

  test("swallows DB error and does NOT re-throw when User.update rejects", async () => {
    // Arrange
    mockHashText.mockResolvedValue("hashed");
    mockUserUpdate.mockRejectedValue(new Error("Constraint violation"));

    // Act + Assert — must NOT reject
    await expect(updatePassword(1, "pw")).resolves.toBe(false);
  });

  test("returns false for any DB error type (non-Error thrown value)", async () => {
    // Arrange
    mockHashText.mockResolvedValue("hashed");
    mockUserUpdate.mockRejectedValue("string error");

    // Act
    const result = await updatePassword(1, "pw");

    // Assert
    expect(result).toBe(false);
  });

  // ── Error handling — hashText error is NOT caught ──────────────────────────

  test("propagates error thrown by hashText (not caught by inner try/catch)", async () => {
    // Arrange
    // hashText is called BEFORE the try block, so its rejection
    // will escape to the caller unhandled.
    mockHashText.mockRejectedValue(new Error("Hashing service unavailable"));

    // Act + Assert — must reject with the original error
    await expect(updatePassword(1, "pw")).rejects.toThrow(
      "Hashing service unavailable"
    );

    // User.update must never have been called
    expect(mockUserUpdate).not.toHaveBeenCalled();
  });

  test("does not call User.update when hashText throws", async () => {
    // Arrange
    mockHashText.mockRejectedValue(new Error("bcrypt failure"));

    // Act — ignore the rejection for this assertion
    try {
      await updatePassword(1, "pw");
    } catch (_) {
      // expected
    }

    // Assert
    expect(mockUserUpdate).not.toHaveBeenCalled();
  });
});
