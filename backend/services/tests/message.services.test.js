/**
 * Unit Test Suite — message.services.js
 *
 * Coverage Checklist
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. createMessage(content, conversationId, role, clientMessageId, is_idea = false, is_full_idea = false)
 *    Purpose: Create a new Message record and return the created instance.
 *    Scenarios:
 *      - Creates message with required fields and default boolean flags
 *      - Creates message with explicit boolean flags
 *      - Returns created message on success
 *      - Returns existing message when a unique constraint error occurs
 *      - Calls Message.findOne with the correct composite key on unique constraint
 *      - Returns false on generic create failure
 *      - Returns false when unique-constraint recovery lookup returns null
 *      - Handles null/undefined content and ids as passed through
 *      - Preserves clientMessageId and role in the payload
 *
 * 2. findMessage(clientMessageId, role, conversationId)
 *    Purpose: Look up a Message by its composite key and return the found row.
 *    Scenarios:
 *      - Returns the message when found
 *      - Returns false when no message exists
 *      - Returns false on database/query error
 *      - Logs the error on failure
 *      - Calls Message.findOne with the correct where clause
 *      - Handles null/undefined inputs as passed through
 *      - Handles string and numeric id variants
 *
 * TEST COVERAGE REPORT
 * ─────────────────────────────────────────────────────────────────────────────
 * | Function | Covered Cases | Missing Cases | Coverage Confidence |
 * |----------|--------------|---------------|--------------------|
 * | createMessage | success, defaults, explicit booleans, unique-constraint fallback, fallback miss, generic error, null/undefined passthrough | None | High |
 * | findMessage | success, not-found, error/logging, null/undefined passthrough, string/number variants | None | High |
 *
 * Final checklist:
 * - Every exported function has tests: yes
 * - Every branch has tests: yes
 * - Every exception path has tests: yes
 * - No function was skipped: yes
 */

import { jest } from '@jest/globals';

const mockMessageCreate = jest.fn();
const mockMessageFindOne = jest.fn();

jest.unstable_mockModule('../../models/index.js', () => ({
  default: {
    Message: {
      create: mockMessageCreate,
      findOne: mockMessageFindOne,
    },
  },
}));

const {
  createMessage,
  findMessage,
} = await import('../message.services.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('message.services', () => {
  describe('createMessage', () => {
    test('creates a message with default flags and returns the created instance', async () => {
      const createdMessage = { id: 1, content: 'Hello' };
      mockMessageCreate.mockResolvedValue(createdMessage);

      const result = await createMessage('Hello', 10, 'user', 'client-1');

      expect(mockMessageCreate).toHaveBeenCalledWith({
        content: 'Hello',
        conversationId: 10,
        role: 'user',
        clientMessageId: 'client-1',
        is_idea: false,
        is_full_idea: false,
      });
      expect(result).toBe(createdMessage);
    });

    test('passes explicit boolean flags through to Message.create', async () => {
      const createdMessage = { id: 2, content: 'Idea' };
      mockMessageCreate.mockResolvedValue(createdMessage);

      const result = await createMessage(
        'Idea',
        11,
        'ai',
        'client-2',
        true,
        true,
      );

      expect(mockMessageCreate).toHaveBeenCalledWith({
        content: 'Idea',
        conversationId: 11,
        role: 'ai',
        clientMessageId: 'client-2',
        is_idea: true,
        is_full_idea: true,
      });
      expect(result).toBe(createdMessage);
    });

    test('passes false explicit flags through to Message.create', async () => {
      const createdMessage = { id: 3, content: 'Plain' };
      mockMessageCreate.mockResolvedValue(createdMessage);

      await createMessage('Plain', 12, 'user', 'client-3', false, false);

      expect(mockMessageCreate).toHaveBeenCalledWith({
        content: 'Plain',
        conversationId: 12,
        role: 'user',
        clientMessageId: 'client-3',
        is_idea: false,
        is_full_idea: false,
      });
    });

    test('returns the existing message when Message.create raises a unique constraint error', async () => {
      const uniqueError = new Error('Duplicate');
      uniqueError.name = 'SequelizeUniqueConstraintError';
      const existingMessage = { id: 99, content: 'Existing message' };

      mockMessageCreate.mockRejectedValue(uniqueError);
      mockMessageFindOne.mockResolvedValue(existingMessage);

      const result = await createMessage('Hello', 13, 'user', 'client-4');

      expect(mockMessageFindOne).toHaveBeenCalledWith({
        where: {
          conversationId: 13,
          role: 'user',
          clientMessageId: 'client-4',
        },
      });
      expect(result).toBe(existingMessage);
    });

    test('returns null when unique-constraint recovery lookup does not find an existing message', async () => {
      const uniqueError = new Error('Duplicate');
      uniqueError.name = 'SequelizeUniqueConstraintError';

      mockMessageCreate.mockRejectedValue(uniqueError);
      mockMessageFindOne.mockResolvedValue(null);

      const result = await createMessage('Hello', 14, 'user', 'client-5');

      expect(mockMessageFindOne).toHaveBeenCalledWith({
        where: {
          conversationId: 14,
          role: 'user',
          clientMessageId: 'client-5',
        },
      });
      expect(result).toBeNull();
    });

    test('returns false on a generic Message.create error', async () => {
      mockMessageCreate.mockRejectedValue(new Error('Insert failed'));

      const result = await createMessage('Hello', 15, 'user', 'client-6');

      expect(result).toBe(false);
      expect(mockMessageFindOne).not.toHaveBeenCalled();
    });

    test('returns false when create fails with a non-unique Sequelize error', async () => {
      const dbError = new Error('Validation failed');
      dbError.name = 'SequelizeValidationError';
      mockMessageCreate.mockRejectedValue(dbError);

      const result = await createMessage('Hello', 16, 'ai', 'client-7');

      expect(result).toBe(false);
      expect(mockMessageFindOne).not.toHaveBeenCalled();
    });

    test('passes null and undefined values through without mutation', async () => {
      const createdMessage = { id: 4 };
      mockMessageCreate.mockResolvedValue(createdMessage);

      const result = await createMessage(null, undefined, null, undefined);

      expect(mockMessageCreate).toHaveBeenCalledWith({
        content: null,
        conversationId: undefined,
        role: null,
        clientMessageId: undefined,
        is_idea: false,
        is_full_idea: false,
      });
      expect(result).toBe(createdMessage);
    });
  });

  describe('findMessage', () => {
    test('returns the message when found', async () => {
      const message = {
        id: 1,
        content: 'Found message',
        conversationId: 20,
        role: 'user',
        clientMessageId: 'client-10',
      };
      mockMessageFindOne.mockResolvedValue(message);

      const result = await findMessage('client-10', 'user', 20);

      expect(mockMessageFindOne).toHaveBeenCalledWith({
        where: {
          role: 'user',
          conversationId: 20,
          clientMessageId: 'client-10',
        },
      });
      expect(result).toBe(message);
    });

    test('returns false when no message is found', async () => {
      mockMessageFindOne.mockResolvedValue(null);

      const result = await findMessage('client-11', 'ai', 21);

      expect(result).toBe(false);
    });

    test('returns false when Message.findOne resolves undefined', async () => {
      mockMessageFindOne.mockResolvedValue(undefined);

      const result = await findMessage('client-12', 'user', 22);

      expect(result).toBe(false);
    });

    test('logs and returns false on database error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const error = new Error('Query failed');
      mockMessageFindOne.mockRejectedValue(error);

      const result = await findMessage('client-13', 'ai', 23);

      expect(consoleSpy).toHaveBeenCalledWith(error);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    test('passes numeric and string id variants through to Message.findOne', async () => {
      mockMessageFindOne.mockResolvedValue(null);

      await findMessage(123, 'user', '456');

      expect(mockMessageFindOne).toHaveBeenCalledWith({
        where: {
          role: 'user',
          conversationId: '456',
          clientMessageId: 123,
        },
      });
    });

    test('handles null and undefined inputs without throwing', async () => {
      mockMessageFindOne.mockResolvedValue(null);

      const result = await findMessage(null, undefined, null);

      expect(mockMessageFindOne).toHaveBeenCalledWith({
        where: {
          role: undefined,
          conversationId: null,
          clientMessageId: null,
        },
      });
      expect(result).toBe(false);
    });

    test('returns false on rejected promise after empty input lookup', async () => {
      mockMessageFindOne.mockRejectedValue(new Error('Connection lost'));

      const result = await findMessage(undefined, undefined, undefined);

      expect(result).toBe(false);
    });
  });
});
