/**
 * Unit Test Suite — feedback.services.js
 *
 * Coverage Checklist
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. createFeedback({ userId, ideaId, rating, text = '' })
 *    Purpose: Create a feedback record and return its JSON representation.
 *    Scenarios:
 *      - Creates feedback with the provided payload
 *      - Uses the default empty-string text when omitted
 *      - Preserves an explicitly provided empty string text
 *      - Preserves null text when null is passed explicitly
 *      - Returns feedback.toJSON() when creation succeeds
 *      - Returns null when Feedback.create resolves to a nullish value
 *      - Propagates Feedback.create rejection
 *      - Propagates toJSON failures from the created feedback instance
 *      - Passes numeric/string ids and rating through unchanged
 *
 * TEST COVERAGE REPORT
 * ─────────────────────────────────────────────────────────────────────────────
 * | Function | Covered Cases | Missing Cases | Coverage Confidence |
 * |----------|--------------|---------------|--------------------|
 * | createFeedback | success, default text, explicit empty/null text, null return, create rejection, toJSON failure, payload passthrough | None | High |
 *
 * Final checklist:
 * - Every exported function has tests: yes
 * - Every branch has tests: yes
 * - Every exception path has tests: yes
 * - No function was skipped: yes
 */

import { jest } from "@jest/globals";

const mockFeedbackCreate = jest.fn();

jest.unstable_mockModule("../../models/index.js", () => ({
  default: {
    Feedback: {
      create: mockFeedbackCreate,
    },
  },
}));

const { createFeedback } = await import("../feedback.services.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("feedback.services", () => {
  describe("createFeedback", () => {
    test("creates feedback and returns its JSON representation", async () => {
      const feedbackRecord = {
        id: 1,
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          userId: 10,
          ideaId: 20,
          rating: 5,
          text: "Great idea",
        }),
      };
      mockFeedbackCreate.mockResolvedValue(feedbackRecord);

      const result = await createFeedback({
        userId: 10,
        ideaId: 20,
        rating: 5,
        text: "Great idea",
      });

      expect(mockFeedbackCreate).toHaveBeenCalledWith({
        userId: 10,
        ideaId: 20,
        rating: 5,
        text: "Great idea",
      });
      expect(feedbackRecord.toJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        id: 1,
        userId: 10,
        ideaId: 20,
        rating: 5,
        text: "Great idea",
      });
    });

    test("uses the default empty-string text when text is omitted", async () => {
      const feedbackRecord = {
        toJSON: jest.fn().mockReturnValue({ id: 2 }),
      };
      mockFeedbackCreate.mockResolvedValue(feedbackRecord);

      await createFeedback({
        userId: 11,
        ideaId: 21,
        rating: 4,
      });

      expect(mockFeedbackCreate).toHaveBeenCalledWith({
        userId: 11,
        ideaId: 21,
        rating: 4,
        text: "",
      });
    });

    test("preserves an explicitly provided empty string text", async () => {
      const feedbackRecord = {
        toJSON: jest.fn().mockReturnValue({ id: 3 }),
      };
      mockFeedbackCreate.mockResolvedValue(feedbackRecord);

      await createFeedback({
        userId: 12,
        ideaId: 22,
        rating: 3,
        text: "",
      });

      expect(mockFeedbackCreate).toHaveBeenCalledWith({
        userId: 12,
        ideaId: 22,
        rating: 3,
        text: "",
      });
    });

    test("preserves null text when null is provided explicitly", async () => {
      const feedbackRecord = {
        toJSON: jest.fn().mockReturnValue({ id: 4 }),
      };
      mockFeedbackCreate.mockResolvedValue(feedbackRecord);

      await createFeedback({
        userId: 13,
        ideaId: 23,
        rating: 2,
        text: null,
      });

      expect(mockFeedbackCreate).toHaveBeenCalledWith({
        userId: 13,
        ideaId: 23,
        rating: 2,
        text: null,
      });
    });

    test("returns null when Feedback.create resolves to null", async () => {
      mockFeedbackCreate.mockResolvedValue(null);

      const result = await createFeedback({
        userId: 14,
        ideaId: 24,
        rating: 1,
      });

      expect(result).toBeNull();
    });

    test("propagates Feedback.create rejection", async () => {
      const error = new Error("create failed");
      mockFeedbackCreate.mockRejectedValue(error);

      await expect(
        createFeedback({
          userId: 15,
          ideaId: 25,
          rating: 5,
        }),
      ).rejects.toThrow("create failed");
    });

    test("propagates toJSON failures from the created feedback instance", async () => {
      const error = new Error("toJSON failed");
      const feedbackRecord = {
        toJSON: jest.fn().mockImplementation(() => {
          throw error;
        }),
      };
      mockFeedbackCreate.mockResolvedValue(feedbackRecord);

      await expect(
        createFeedback({
          userId: 16,
          ideaId: 26,
          rating: 4,
          text: "Nice",
        }),
      ).rejects.toThrow("toJSON failed");
    });

    test("passes numeric and string ids and rating through unchanged", async () => {
      const feedbackRecord = {
        toJSON: jest.fn().mockReturnValue({ id: 5 }),
      };
      mockFeedbackCreate.mockResolvedValue(feedbackRecord);

      await createFeedback({
        userId: "user-1",
        ideaId: "idea-2",
        rating: "5",
        text: "Typed as strings",
      });

      expect(mockFeedbackCreate).toHaveBeenCalledWith({
        userId: "user-1",
        ideaId: "idea-2",
        rating: "5",
        text: "Typed as strings",
      });
    });

    test("returns null when Feedback.create resolves to undefined", async () => {
      mockFeedbackCreate.mockResolvedValue(undefined);

      const result = await createFeedback({
        userId: 30,
        ideaId: 40,
        rating: 2,
      });

      expect(result).toBeNull();
    });

    test("throws when created feedback instance does not have toJSON", async () => {
      // create returns an object without toJSON -> calling toJSON will throw
      mockFeedbackCreate.mockResolvedValue({});

      await expect(
        createFeedback({ userId: 31, ideaId: 41, rating: 3 }),
      ).rejects.toThrow();
    });

    test("throws when called with no argument (destructuring failure)", async () => {
      await expect(createFeedback()).rejects.toThrow();
    });

    test("accepts empty object and sends undefineds with default text", async () => {
      const feedbackRecord = { toJSON: jest.fn().mockReturnValue({ id: 99 }) };
      mockFeedbackCreate.mockResolvedValue(feedbackRecord);

      await createFeedback({});

      expect(mockFeedbackCreate).toHaveBeenCalledWith({
        userId: undefined,
        ideaId: undefined,
        rating: undefined,
        text: "",
      });
    });

    test("returns null when toJSON returns null", async () => {
      const feedbackRecord = { toJSON: jest.fn().mockReturnValue(null) };
      mockFeedbackCreate.mockResolvedValue(feedbackRecord);

      const result = await createFeedback({
        userId: 32,
        ideaId: 42,
        rating: 1,
      });

      expect(result).toBeNull();
    });
  });
});
