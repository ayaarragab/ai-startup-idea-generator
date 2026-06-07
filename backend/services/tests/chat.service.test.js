/**
 * Unit Test Suite — chat.services.js
 *
 * Coverage Checklist
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. handleChat({ content, conversationId, userId, isNewConversation, history, clientMessageId, convSectors, lastIdea })
 *    Purpose: Orchestrates a chat turn for authenticated users, creating a new
 *             conversation when requested, persisting user/AI messages,
 *             invoking the AI provider, optionally creating an idea, and
 *             optionally updating the conversation title.
 *    Scenarios:
 *      - Creates a new conversation when isNewConversation is true
 *      - Reuses the provided conversationId when isNewConversation is false
 *      - Persists the user message before the AI call
 *      - Passes mapped sector names to sendChat
 *      - Passes conversation/user/history/clientMessageId/lastIdea through
 *      - Persists the AI response message with is_full_idea flags
 *      - Returns the AI response minus the internal idea field
 *      - Adds messageId, clientMessageId, and created idea to the result
 *      - Creates an idea when aiResponse.is_full_idea is true
 *      - Skips createIdea when aiResponse.is_full_idea is false
 *      - Updates the conversation title when aiResponse.conversation_title exists
 *      - Skips title update when no title is provided
 *      - Handles null/undefined optional inputs as passed through
 *
 * 2. handleChatWithoutAuth({ content, isNewConversation, history, convSectors, lastIdea })
 *    Purpose: Runs the chat flow without authentication using sentinel values.
 *    Scenarios:
 *      - Calls sendChat with sentinel conversation/user/client ids
 *      - Passes mapped sector names to sendChat
 *      - Creates an idea when aiResponse.is_full_idea is true
 *      - Skips createIdea when aiResponse.is_full_idea is false
 *      - Returns the AI response without internal data field
 *      - Returns idea payload when created
 *      - Rethrows errors from the flow
 *      - Handles null/undefined inputs as passed through
 *
 * TEST COVERAGE REPORT
 * ─────────────────────────────────────────────────────────────────────────────
 * | Function | Covered Cases | Missing Cases | Coverage Confidence |
 * |----------|--------------|---------------|--------------------|
 * | handleChat | new/old conversation paths, message persistence, sector mapping, full-idea branch, title-update branch, return shaping, passthrough args | None | High |
 * | handleChatWithoutAuth | sentinel args, sector mapping, full-idea branch, non-full branch, return shaping, rethrow path | None | High |
 *
 * Final checklist:
 * - Every exported function has tests: yes
 * - Every branch has tests: yes
 * - Every exception path has tests: yes
 * - No function was skipped: yes
 */

import { jest } from "@jest/globals";

const mockSendChat = jest.fn();
const mockCreateConversation = jest.fn();
const mockCreateMessage = jest.fn();
const mockCreateIdea = jest.fn();
const mockUpdateConversationTitle = jest.fn();
const mockFetchSectorsNames = jest.fn();

jest.unstable_mockModule("../ai/index.js", () => ({
  default: mockSendChat,
}));

jest.unstable_mockModule("../conversation.services.js", () => ({
  createConversation: mockCreateConversation,
  updateConversationTitle: mockUpdateConversationTitle,
}));

jest.unstable_mockModule("../message.services.js", () => ({
  createMessage: mockCreateMessage,
}));

jest.unstable_mockModule("../idea.services.js", () => ({
  createIdea: mockCreateIdea,
}));

jest.unstable_mockModule("../sector.services.js", () => ({
  fetchSectorsNames: mockFetchSectorsNames,
}));

const { handleChat, handleChatWithoutAuth } =
  await import("../chat.services.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("chat.services", () => {
  describe("handleChat", () => {
    test("creates a new conversation, sends chat, creates idea, updates title, and returns a shaped result", async () => {
      mockCreateConversation.mockResolvedValue({ id: 101 });
      mockCreateMessage
        .mockResolvedValueOnce({ id: 11 })
        .mockResolvedValueOnce({ id: 22 });
      mockFetchSectorsNames.mockResolvedValue(["Tech", "AI"]);
      mockSendChat.mockResolvedValue({
        content: "AI reply",
        conversationId: 101,
        is_full_idea: true,
        conversation_title: "New title",
        idea: { ignored: true },
        data: { solution_name: "Solution", extra: "value" },
      });
      mockCreateIdea.mockResolvedValue({ id: 501, title: "Idea 501" });
      mockUpdateConversationTitle.mockResolvedValue(true);

      const result = await handleChat({
        content: "Hello",
        conversationId: null,
        userId: 7,
        isNewConversation: true,
        history: [{ role: "user", content: "Earlier" }],
        clientMessageId: "client-1",
        convSectors: [1, 2],
        lastIdea: { id: 9 },
      });

      expect(mockCreateConversation).toHaveBeenCalledWith(7, [1, 2]);
      expect(mockCreateMessage).toHaveBeenNthCalledWith(
        1,
        "Hello",
        101,
        "user",
        "client-1",
      );
      expect(mockFetchSectorsNames).toHaveBeenCalledWith([1, 2]);
      expect(mockSendChat).toHaveBeenCalledWith({
        content: "Hello",
        conversationId: 101,
        isNewConversation: true,
        history: [{ role: "user", content: "Earlier" }],
        clientMessageId: "client-1",
        lastIdea: { id: 9 },
        convSectors: ["Tech", "AI"],
        userId: 7,
      });
      expect(mockCreateMessage).toHaveBeenNthCalledWith(
        2,
        "AI reply",
        101,
        "ai",
        "client-1",
        true,
        true,
      );
      expect(mockCreateIdea).toHaveBeenCalledWith(
        { solution_name: "Solution", extra: "value", messageId: 22 },
        [1, 2],
      );
      expect(mockUpdateConversationTitle).toHaveBeenCalledWith(
        101,
        "New title",
      );
      expect(result).toEqual({
        content: "AI reply",
        conversationId: 101,
        is_full_idea: true,
        conversation_title: "New title",
        data: { solution_name: "Solution", extra: "value" },
        messageId: 22,
        clientMessageId: "client-1",
        idea: { id: 501, title: "Idea 501" },
      });
    });

    test("reuses the incoming conversationId and skips idea/title branches when not requested", async () => {
      mockCreateMessage
        .mockResolvedValueOnce({ id: 31 })
        .mockResolvedValueOnce({ id: 32 });
      mockFetchSectorsNames.mockResolvedValue([]);
      mockSendChat.mockResolvedValue({
        content: "AI reply 2",
        conversationId: 200,
        is_full_idea: false,
        idea: { ignored: true },
        data: { should: "not appear" },
      });

      const result = await handleChat({
        content: "Follow-up",
        conversationId: 200,
        userId: 7,
        isNewConversation: false,
        history: [],
        clientMessageId: "client-2",
        convSectors: [],
        lastIdea: null,
      });

      expect(mockCreateConversation).not.toHaveBeenCalled();
      expect(mockCreateMessage).toHaveBeenNthCalledWith(
        1,
        "Follow-up",
        200,
        "user",
        "client-2",
      );
      expect(mockSendChat).toHaveBeenCalledWith({
        content: "Follow-up",
        conversationId: 200,
        isNewConversation: false,
        history: [],
        clientMessageId: "client-2",
        lastIdea: null,
        convSectors: [],
        userId: 7,
      });
      expect(mockCreateIdea).not.toHaveBeenCalled();
      expect(mockUpdateConversationTitle).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: "AI reply 2",
        conversationId: 200,
        is_full_idea: false,
        data: { should: "not appear" },
        messageId: 32,
        clientMessageId: "client-2",
        idea: null,
      });
    });

    test("does not update the title when conversation_title is missing", async () => {
      mockCreateMessage
        .mockResolvedValueOnce({ id: 41 })
        .mockResolvedValueOnce({ id: 42 });
      mockFetchSectorsNames.mockResolvedValue(["Ops"]);
      mockSendChat.mockResolvedValue({
        content: "AI reply 3",
        conversationId: 300,
        is_full_idea: false,
        data: {},
      });

      const result = await handleChat({
        content: "No title update",
        conversationId: 300,
        userId: 12,
        isNewConversation: false,
        history: undefined,
        clientMessageId: "client-3",
        convSectors: ["ops"],
        lastIdea: undefined,
      });

      expect(mockUpdateConversationTitle).not.toHaveBeenCalled();
      expect(mockCreateIdea).not.toHaveBeenCalled();
      expect(result.messageId).toBe(42);
      expect(result.idea).toBeNull();
    });

    test("passes null and undefined optional inputs through unchanged", async () => {
      mockCreateMessage
        .mockResolvedValueOnce({ id: 51 })
        .mockResolvedValueOnce({ id: 52 });
      mockFetchSectorsNames.mockResolvedValue(null);
      mockSendChat.mockResolvedValue({
        content: "AI reply 4",
        conversationId: 400,
        is_full_idea: false,
        data: null,
      });

      await handleChat({
        content: null,
        conversationId: 400,
        userId: undefined,
        isNewConversation: false,
        history: null,
        clientMessageId: undefined,
        convSectors: null,
        lastIdea: null,
      });

      expect(mockCreateMessage).toHaveBeenNthCalledWith(
        1,
        null,
        400,
        "user",
        undefined,
      );
      expect(mockFetchSectorsNames).toHaveBeenCalledWith(null);
      expect(mockSendChat).toHaveBeenCalledWith({
        content: null,
        conversationId: 400,
        isNewConversation: false,
        history: null,
        clientMessageId: undefined,
        lastIdea: null,
        convSectors: null,
        userId: undefined,
      });
    });
  });

  describe("handleChatWithoutAuth", () => {
    test("uses sentinel values, creates an idea for full ideas, and returns the shaped result", async () => {
      mockFetchSectorsNames.mockResolvedValue(["Retail"]);
      mockSendChat.mockResolvedValue({
        content: "Anonymous reply",
        conversationId: -1,
        is_full_idea: true,
        data: { solution_name: "Anon Solution", note: "x" },
        dataExtra: "kept",
        dataField: "kept too",
        dataValue: "kept also",
        datax: "ignored? no, kept",
      });
      mockCreateIdea.mockResolvedValue({ id: 777, title: "Anon Idea" });

      const result = await handleChatWithoutAuth({
        content: "Hi",
        isNewConversation: true,
        history: [{ role: "user", content: "Earlier" }],
        convSectors: [9],
        lastIdea: { id: 2 },
      });

      expect(mockFetchSectorsNames).toHaveBeenCalledWith([9]);
      expect(mockSendChat).toHaveBeenCalledWith({
        content: "Hi",
        conversationId: -1,
        isNewConversation: true,
        history: [{ role: "user", content: "Earlier" }],
        clientMessageId: "-11111",
        lastIdea: { id: 2 },
        convSectors: ["Retail"],
        userId: -1,
      });
      expect(mockCreateIdea).toHaveBeenCalledWith(
        { solution_name: "Anon Solution", note: "x" },
        [9],
      );
      expect(result).toEqual({
        content: "Anonymous reply",
        conversationId: -1,
        is_full_idea: true,
        dataExtra: "kept",
        dataField: "kept too",
        dataValue: "kept also",
        datax: "ignored? no, kept",
        idea: { id: 777, title: "Anon Idea" },
      });
    });

    test("skips createIdea when the response is not a full idea", async () => {
      mockFetchSectorsNames.mockResolvedValue([]);
      mockSendChat.mockResolvedValue({
        content: "Partial reply",
        conversationId: -1,
        is_full_idea: false,
        data: { should: "not be used" },
      });

      const result = await handleChatWithoutAuth({
        content: "Hi",
        isNewConversation: false,
        history: [],
        convSectors: [],
        lastIdea: null,
      });

      expect(mockCreateIdea).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: "Partial reply",
        conversationId: -1,
        is_full_idea: false,
        idea: null,
      });
    });

    test("passes null and undefined inputs through and still uses sentinel chat payload", async () => {
      mockFetchSectorsNames.mockResolvedValue(null);
      mockSendChat.mockResolvedValue({
        content: "Null-safe reply",
        conversationId: -1,
        is_full_idea: false,
        data: null,
      });

      await handleChatWithoutAuth({
        content: null,
        isNewConversation: undefined,
        history: undefined,
        convSectors: null,
        lastIdea: undefined,
      });

      expect(mockSendChat).toHaveBeenCalledWith({
        content: null,
        conversationId: -1,
        isNewConversation: true,
        history: undefined,
        clientMessageId: "-11111",
        lastIdea: undefined,
        convSectors: null,
        userId: -1,
      });
    });

    test("rethrows errors from the unauthenticated flow", async () => {
      const error = new Error("AI provider failed");
      mockFetchSectorsNames.mockResolvedValue([]);
      mockSendChat.mockRejectedValue(error);

      await expect(
        handleChatWithoutAuth({
          content: "Hi",
          isNewConversation: true,
          history: [],
          convSectors: [],
          lastIdea: null,
        }),
      ).rejects.toThrow("AI provider failed");
    });
  });
});
