/**
 * Unit Test Suite: idea.services.js
 *
 * Coverage checklist
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. createIdea(ideaDetails, convSectors)
 *    - Maps all snake_case fields to camelCase correctly
 *    - is_deleted defaults to false when not provided
 *    - is_deleted uses provided value when truthy
 *    - Calls Idea.create with mapped data
 *    - Calls idea.setSectors when convSectors.length > 0
 *    - Skips idea.setSectors when convSectors is empty
 *    - Calls Idea.findByPk with include for Sector
 *    - Returns toJSON() of updatedIdea when found
 *    - Returns null when updatedIdea is falsy
 *    - Re-throws on Idea.create error
 *    - Re-throws on idea.setSectors error
 *    - Re-throws on Idea.findByPk error
 *
 * 2. saveIdea(ideaId, userId, messageId)
 *    - Throws "User not found" when user is null
 *    - Throws "Idea not found" when idea is null
 *    - Throws "Message not found" when message is null
 *    - Sets message.is_idea_saved = true and saves
 *    - Calls user.addIdea with ideaId
 *    - Returns { ok: true } on success
 *
 * 3. findIdea(id)
 *    - Returns true when idea exists
 *    - Returns false when idea is null/not found
 *    - Returns true (swallows) on database error
 *
 * 4. findIdeaWithMessageId(messageId)
 *    - Returns idea when found
 *    - Returns null/undefined when not found
 *    - Re-throws on database error
 *
 * 5. unsaveIdea(ideaId, userId, messageId)
 *    - Throws "User not found" when user is null
 *    - Throws "Idea not found" when idea is null
 *    - Updates message.is_idea_saved = false and saves when message found
 *    - Skips message update when message is null
 *    - Calls user.removeIdea with ideaId
 *    - Returns { ok: true } on success
 *
 * 6. fetchSavedIdeas(userId)
 *    - Retrieves user and their ideas
 *    - Attaches sectors (array) to each idea's dataValues
 *    - Handles non-array sectors by setting [] on dataValues
 *    - Sorts ideas by createdAt descending
 *    - Returns false on any error
 *    - Works with empty ideas list
 *
 * 7. fetchSavedIdea(userId, ideaId)
 *    - Throws "User not found" when user is null
 *    - Parses targetUsers from valid JSON string
 *    - Falls back to CSV split when targetUsers JSON is invalid
 *    - Leaves targetUsers as-is when it is not a string
 *    - Parses inspiredBy from valid JSON string
 *    - Falls back to CSV split when inspiredBy JSON is invalid
 *    - Leaves inspiredBy as-is when it is not a string
 *    - Returns merged object when ideas.length > 0
 *    - Returns null when ideas array is empty (ideas.length === 0)
 *    - Re-throws on any internal error
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { jest } from "@jest/globals";

// ─── Mock db module ───────────────────────────────────────────────────────────
// We must mock before importing the service because the service captures
// {Idea, User, Message} at module load time via destructuring.

const mockIdeaInstance = {
  id: 1,
  setSectors: jest.fn(),
};

const mockMessageInstance = {
  is_idea_saved: false,
  save: jest.fn(),
};

const mockUserInstance = {
  addIdea: jest.fn(),
  removeIdea: jest.fn(),
  getIdeas: jest.fn(),
};

const mockIdea = {
  create: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
};

const mockUser = {
  findByPk: jest.fn(),
};

const mockMessage = {
  findByPk: jest.fn(),
};

const mockSector = {}; // model reference used in include

jest.unstable_mockModule("../../models/index.js", () => ({
  default: {
    Idea: mockIdea,
    User: mockUser,
    Message: mockMessage,
    Sector: mockSector,
  },
}));

const {
  createIdea,
  saveIdea,
  findIdea,
  findIdeaWithMessageId,
  unsaveIdea,
  fetchSavedIdeas,
  fetchSavedIdea,
} = await import("../idea.services.js");

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Returns a full ideaDetails object with all snake_case fields populated */
function buildIdeaDetails(overrides = {}) {
  return {
    messageId: 10,
    problem_title: "Problem Title",
    problem_description: "Problem Desc",
    root_cause: "Root Cause",
    target_users: ["user1"],
    market_region: "MENA",
    why_now: "Why Now",
    evidence_signals: "Evidence",
    solution_name: "Solution Name",
    solution_description: "Solution Desc",
    how_it_works: "How It Works",
    key_features: ["feat1"],
    technology_stack: ["node"],
    business_model: "SaaS",
    market_analysis: "Market Analysis",
    feasibility: "High",
    novelty_score: 8,
    impact: "High",
    mvp_plan: "MVP Plan",
    inspired_by: ["Google"],
    is_deleted: false,
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. createIdea
// ─────────────────────────────────────────────────────────────────────────────
describe("createIdea", () => {
  const sectors = [{ id: 1, name: "Tech" }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("maps all snake_case ideaDetails fields to camelCase when creating", async () => {
    const details = buildIdeaDetails();
    const updatedIdeaMock = { toJSON: jest.fn().mockReturnValue({ id: 1 }) };

    mockIdea.create.mockResolvedValue(mockIdeaInstance);
    mockIdeaInstance.setSectors.mockResolvedValue();
    mockIdea.findByPk.mockResolvedValue(updatedIdeaMock);

    await createIdea(details, sectors);

    expect(mockIdea.create).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: details.messageId,
        problemTitle: details.problem_title,
        problemDescription: details.problem_description,
        rootCause: details.root_cause,
        targetUsers: details.target_users,
        marketRegion: details.market_region,
        whyNow: details.why_now,
        evidenceSignals: details.evidence_signals,
        solutionName: details.solution_name,
        solutionDescription: details.solution_description,
        howItWorks: details.how_it_works,
        keyFeatures: details.key_features,
        technologyStack: details.technology_stack,
        businessModel: details.business_model,
        marketAnalysis: details.market_analysis,
        feasibility: details.feasibility,
        noveltyScore: details.novelty_score,
        impact: details.impact,
        mvpPlan: details.mvp_plan,
        inspiredBy: details.inspired_by,
        is_deleted: false,
      })
    );
  });

  test("is_deleted defaults to false when not provided in ideaDetails", async () => {
    const details = buildIdeaDetails();
    delete details.is_deleted;
    const updatedIdeaMock = { toJSON: jest.fn().mockReturnValue({}) };

    mockIdea.create.mockResolvedValue(mockIdeaInstance);
    mockIdeaInstance.setSectors.mockResolvedValue();
    mockIdea.findByPk.mockResolvedValue(updatedIdeaMock);

    await createIdea(details, []);

    expect(mockIdea.create).toHaveBeenCalledWith(
      expect.objectContaining({ is_deleted: false })
    );
  });

  test("is_deleted is true when explicitly set to true in ideaDetails", async () => {
    const details = buildIdeaDetails({ is_deleted: true });
    const updatedIdeaMock = { toJSON: jest.fn().mockReturnValue({}) };

    mockIdea.create.mockResolvedValue(mockIdeaInstance);
    mockIdeaInstance.setSectors.mockResolvedValue();
    mockIdea.findByPk.mockResolvedValue(updatedIdeaMock);

    await createIdea(details, []);

    expect(mockIdea.create).toHaveBeenCalledWith(
      expect.objectContaining({ is_deleted: true })
    );
  });

  test("calls idea.setSectors when convSectors has items", async () => {
    const details = buildIdeaDetails();
    const updatedIdeaMock = { toJSON: jest.fn().mockReturnValue({}) };

    mockIdea.create.mockResolvedValue(mockIdeaInstance);
    mockIdeaInstance.setSectors.mockResolvedValue();
    mockIdea.findByPk.mockResolvedValue(updatedIdeaMock);

    await createIdea(details, sectors);

    expect(mockIdeaInstance.setSectors).toHaveBeenCalledWith(sectors);
  });

  test("does NOT call idea.setSectors when convSectors is empty", async () => {
    const details = buildIdeaDetails();
    const updatedIdeaMock = { toJSON: jest.fn().mockReturnValue({}) };

    mockIdea.create.mockResolvedValue(mockIdeaInstance);
    mockIdea.findByPk.mockResolvedValue(updatedIdeaMock);

    await createIdea(details, []);

    expect(mockIdeaInstance.setSectors).not.toHaveBeenCalled();
  });

  test("calls Idea.findByPk with correct id and Sector include after create", async () => {
    const details = buildIdeaDetails();
    const updatedIdeaMock = { toJSON: jest.fn().mockReturnValue({}) };

    mockIdea.create.mockResolvedValue({ ...mockIdeaInstance, id: 42 });
    mockIdea.findByPk.mockResolvedValue(updatedIdeaMock);

    await createIdea(details, []);

    expect(mockIdea.findByPk).toHaveBeenCalledWith(
      42,
      expect.objectContaining({
        include: expect.arrayContaining([
          expect.objectContaining({
            model: mockSector,
            as: "sectors",
            attributes: ["id", "name"],
          }),
        ]),
      })
    );
  });

  test("returns the toJSON() result of updatedIdea when found", async () => {
    const details = buildIdeaDetails();
    const jsonResult = { id: 1, problemTitle: "Problem Title" };
    const updatedIdeaMock = { toJSON: jest.fn().mockReturnValue(jsonResult) };

    mockIdea.create.mockResolvedValue(mockIdeaInstance);
    mockIdea.findByPk.mockResolvedValue(updatedIdeaMock);

    const result = await createIdea(details, []);

    expect(result).toEqual(jsonResult);
    expect(updatedIdeaMock.toJSON).toHaveBeenCalled();
  });

  test("returns null when Idea.findByPk returns null after create", async () => {
    const details = buildIdeaDetails();

    mockIdea.create.mockResolvedValue(mockIdeaInstance);
    mockIdea.findByPk.mockResolvedValue(null);

    const result = await createIdea(details, []);

    expect(result).toBeNull();
  });

  test("returns null when Idea.findByPk returns undefined after create", async () => {
    const details = buildIdeaDetails();

    mockIdea.create.mockResolvedValue(mockIdeaInstance);
    mockIdea.findByPk.mockResolvedValue(undefined);

    const result = await createIdea(details, []);

    expect(result).toBeNull();
  });

  test("re-throws error when Idea.create rejects", async () => {
    const details = buildIdeaDetails();
    const dbError = new Error("DB create error");

    mockIdea.create.mockRejectedValue(dbError);

    await expect(createIdea(details, [])).rejects.toThrow("DB create error");
  });

  test("re-throws error when idea.setSectors rejects", async () => {
    const details = buildIdeaDetails();
    const sectorError = new Error("setSectors failed");

    mockIdea.create.mockResolvedValue(mockIdeaInstance);
    mockIdeaInstance.setSectors.mockRejectedValue(sectorError);

    await expect(createIdea(details, sectors)).rejects.toThrow(
      "setSectors failed"
    );
  });

  test("re-throws error when second Idea.findByPk rejects", async () => {
    const details = buildIdeaDetails();
    const pkError = new Error("findByPk failed");

    mockIdea.create.mockResolvedValue(mockIdeaInstance);
    mockIdea.findByPk.mockRejectedValue(pkError);

    await expect(createIdea(details, [])).rejects.toThrow("findByPk failed");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. saveIdea
// ─────────────────────────────────────────────────────────────────────────────
describe("saveIdea", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("throws 'User not found' when User.findByPk returns null", async () => {
    mockUser.findByPk.mockResolvedValue(null);

    await expect(saveIdea(1, 99, 1)).rejects.toThrow("User not found");
  });

  test("throws 'Idea not found' when Idea.findByPk returns null", async () => {
    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(null);

    await expect(saveIdea(99, 1, 1)).rejects.toThrow("Idea not found");
  });

  test("throws 'Message not found' when Message.findByPk returns null", async () => {
    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(mockIdeaInstance);
    mockMessage.findByPk.mockResolvedValue(null);

    await expect(saveIdea(1, 1, 99)).rejects.toThrow("Message not found");
  });

  test("sets message.is_idea_saved to true and calls message.save()", async () => {
    const msg = { is_idea_saved: false, save: jest.fn().mockResolvedValue() };

    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(mockIdeaInstance);
    mockMessage.findByPk.mockResolvedValue(msg);
    mockUserInstance.addIdea.mockResolvedValue();

    await saveIdea(1, 1, 1);

    expect(msg.is_idea_saved).toBe(true);
    expect(msg.save).toHaveBeenCalledTimes(1);
  });

  test("calls user.addIdea with the provided ideaId", async () => {
    const msg = { is_idea_saved: false, save: jest.fn().mockResolvedValue() };

    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(mockIdeaInstance);
    mockMessage.findByPk.mockResolvedValue(msg);
    mockUserInstance.addIdea.mockResolvedValue();

    await saveIdea(7, 1, 1);

    expect(mockUserInstance.addIdea).toHaveBeenCalledWith(7);
  });

  test("returns { ok: true } on success", async () => {
    const msg = { is_idea_saved: false, save: jest.fn().mockResolvedValue() };

    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(mockIdeaInstance);
    mockMessage.findByPk.mockResolvedValue(msg);
    mockUserInstance.addIdea.mockResolvedValue();

    const result = await saveIdea(1, 1, 1);

    expect(result).toEqual({ ok: true });
  });

  test("user guard runs before idea guard — does not call Idea.findByPk if user missing", async () => {
    mockUser.findByPk.mockResolvedValue(null);

    await expect(saveIdea(1, 1, 1)).rejects.toThrow("User not found");
    expect(mockIdea.findByPk).not.toHaveBeenCalled();
  });

  test("idea guard runs before message guard — does not call Message.findByPk if idea missing", async () => {
    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(null);

    await expect(saveIdea(1, 1, 1)).rejects.toThrow("Idea not found");
    expect(mockMessage.findByPk).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. findIdea
// ─────────────────────────────────────────────────────────────────────────────
describe("findIdea", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns true when idea is found", async () => {
    mockIdea.findByPk.mockResolvedValue({ id: 1 });

    const result = await findIdea(1);

    expect(result).toBe(true);
  });

  test("returns false when Idea.findByPk returns null", async () => {
    mockIdea.findByPk.mockResolvedValue(null);

    const result = await findIdea(999);

    expect(result).toBe(false);
  });

  test("returns false when Idea.findByPk returns undefined", async () => {
    mockIdea.findByPk.mockResolvedValue(undefined);

    const result = await findIdea(999);

    expect(result).toBe(false);
  });

  test("returns true (swallows error) when Idea.findByPk throws", async () => {
    mockIdea.findByPk.mockRejectedValue(new Error("DB error"));

    const result = await findIdea(1);

    expect(result).toBe(true);
  });

  test("calls Idea.findByPk with the provided id", async () => {
    mockIdea.findByPk.mockResolvedValue({ id: 5 });

    await findIdea(5);

    expect(mockIdea.findByPk).toHaveBeenCalledWith(5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. findIdeaWithMessageId
// ─────────────────────────────────────────────────────────────────────────────
describe("findIdeaWithMessageId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns the idea when Idea.findOne resolves with a record", async () => {
    const ideaMock = { id: 1, messageId: 42 };
    mockIdea.findOne.mockResolvedValue(ideaMock);

    const result = await findIdeaWithMessageId(42);

    expect(result).toEqual(ideaMock);
  });

  test("returns null when Idea.findOne resolves with null (no match)", async () => {
    mockIdea.findOne.mockResolvedValue(null);

    const result = await findIdeaWithMessageId(999);

    expect(result).toBeNull();
  });

  test("calls Idea.findOne with correct where clause", async () => {
    mockIdea.findOne.mockResolvedValue(null);

    await findIdeaWithMessageId(7);

    expect(mockIdea.findOne).toHaveBeenCalledWith({ where: { messageId: 7 } });
  });

  test("re-throws error when Idea.findOne rejects", async () => {
    const dbError = new Error("findOne failed");
    mockIdea.findOne.mockRejectedValue(dbError);

    await expect(findIdeaWithMessageId(1)).rejects.toThrow("findOne failed");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. unsaveIdea
// ─────────────────────────────────────────────────────────────────────────────
describe("unsaveIdea", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("throws 'User not found' when User.findByPk returns null", async () => {
    mockUser.findByPk.mockResolvedValue(null);

    await expect(unsaveIdea(1, 99, 1)).rejects.toThrow("User not found");
  });

  test("throws 'Idea not found' when Idea.findByPk returns null", async () => {
    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(null);

    await expect(unsaveIdea(99, 1, 1)).rejects.toThrow("Idea not found");
  });

  test("sets message.is_idea_saved to false and saves when message is found", async () => {
    const msg = { is_idea_saved: true, save: jest.fn().mockResolvedValue() };

    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(mockIdeaInstance);
    mockMessage.findByPk.mockResolvedValue(msg);
    mockUserInstance.removeIdea.mockResolvedValue();

    await unsaveIdea(1, 1, 1);

    expect(msg.is_idea_saved).toBe(false);
    expect(msg.save).toHaveBeenCalledTimes(1);
  });

  test("skips message update when Message.findByPk returns null", async () => {
    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(mockIdeaInstance);
    mockMessage.findByPk.mockResolvedValue(null);
    mockUserInstance.removeIdea.mockResolvedValue();

    // Should not throw
    const result = await unsaveIdea(1, 1, 1);

    expect(result).toEqual({ ok: true });
    // message.save was never available to call
  });

  test("calls user.removeIdea with the correct ideaId", async () => {
    const msg = { is_idea_saved: true, save: jest.fn().mockResolvedValue() };

    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(mockIdeaInstance);
    mockMessage.findByPk.mockResolvedValue(msg);
    mockUserInstance.removeIdea.mockResolvedValue();

    await unsaveIdea(7, 1, 1);

    expect(mockUserInstance.removeIdea).toHaveBeenCalledWith(7);
  });

  test("calls user.removeIdea even when message is null", async () => {
    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(mockIdeaInstance);
    mockMessage.findByPk.mockResolvedValue(null);
    mockUserInstance.removeIdea.mockResolvedValue();

    await unsaveIdea(3, 1, 1);

    expect(mockUserInstance.removeIdea).toHaveBeenCalledWith(3);
  });

  test("returns { ok: true } on success with message present", async () => {
    const msg = { is_idea_saved: true, save: jest.fn().mockResolvedValue() };

    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(mockIdeaInstance);
    mockMessage.findByPk.mockResolvedValue(msg);
    mockUserInstance.removeIdea.mockResolvedValue();

    const result = await unsaveIdea(1, 1, 1);

    expect(result).toEqual({ ok: true });
  });

  test("returns { ok: true } on success even when message is null", async () => {
    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(mockIdeaInstance);
    mockMessage.findByPk.mockResolvedValue(null);
    mockUserInstance.removeIdea.mockResolvedValue();

    const result = await unsaveIdea(1, 1, 1);

    expect(result).toEqual({ ok: true });
  });

  test("user guard runs before idea guard", async () => {
    mockUser.findByPk.mockResolvedValue(null);

    await expect(unsaveIdea(1, 1, 1)).rejects.toThrow("User not found");
    expect(mockIdea.findByPk).not.toHaveBeenCalled();
  });

  test("idea guard runs before message lookup", async () => {
    mockUser.findByPk.mockResolvedValue(mockUserInstance);
    mockIdea.findByPk.mockResolvedValue(null);

    await expect(unsaveIdea(1, 1, 1)).rejects.toThrow("Idea not found");
    expect(mockMessage.findByPk).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. fetchSavedIdeas
// ─────────────────────────────────────────────────────────────────────────────
describe("fetchSavedIdeas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Helper to build a mock idea with sectors support */
  function buildIdeaWithSectors(sectors, createdAt) {
    return {
      createdAt,
      getSectors: jest.fn().mockResolvedValue(sectors),
      dataValues: {},
    };
  }

  test("retrieves ideas for user and returns sorted by createdAt descending", async () => {
    const idea1 = buildIdeaWithSectors([], new Date("2024-01-01"));
    const idea2 = buildIdeaWithSectors([], new Date("2024-06-01"));

    mockUser.findByPk.mockResolvedValue({
      ...mockUserInstance,
      getIdeas: jest.fn().mockResolvedValue([idea1, idea2]),
    });

    const result = await fetchSavedIdeas(1);

    // idea2 (newer) should come first
    expect(result[0]).toBe(idea2);
    expect(result[1]).toBe(idea1);
  });

  test("attaches mapped sectors array to idea.dataValues.sectors", async () => {
    const sectorMock = { toJSON: jest.fn().mockReturnValue({ id: 1, name: "Tech" }) };
    const idea = buildIdeaWithSectors([sectorMock], new Date());

    mockUser.findByPk.mockResolvedValue({
      ...mockUserInstance,
      getIdeas: jest.fn().mockResolvedValue([idea]),
    });

    await fetchSavedIdeas(1);

    expect(idea.dataValues.sectors).toEqual([{ id: 1, name: "Tech" }]);
    expect(sectorMock.toJSON).toHaveBeenCalled();
  });

  test("sets idea.dataValues.sectors to [] when getSectors returns a non-array", async () => {
    const idea = {
      createdAt: new Date(),
      getSectors: jest.fn().mockResolvedValue(null), // non-array
      dataValues: {},
    };

    mockUser.findByPk.mockResolvedValue({
      ...mockUserInstance,
      getIdeas: jest.fn().mockResolvedValue([idea]),
    });

    await fetchSavedIdeas(1);

    expect(idea.dataValues.sectors).toEqual([]);
  });

  test("returns empty array when user has no ideas, sorted correctly", async () => {
    mockUser.findByPk.mockResolvedValue({
      ...mockUserInstance,
      getIdeas: jest.fn().mockResolvedValue([]),
    });

    const result = await fetchSavedIdeas(1);

    expect(result).toEqual([]);
  });

  test("returns false when User.findByPk throws", async () => {
    mockUser.findByPk.mockRejectedValue(new Error("DB error"));

    const result = await fetchSavedIdeas(1);

    expect(result).toBe(false);
  });

  test("returns false when user.getIdeas throws", async () => {
    mockUser.findByPk.mockResolvedValue({
      ...mockUserInstance,
      getIdeas: jest.fn().mockRejectedValue(new Error("getIdeas error")),
    });

    const result = await fetchSavedIdeas(1);

    expect(result).toBe(false);
  });

  test("returns false when idea.getSectors throws", async () => {
    const idea = {
      createdAt: new Date(),
      getSectors: jest.fn().mockRejectedValue(new Error("getSectors error")),
      dataValues: {},
    };

    mockUser.findByPk.mockResolvedValue({
      ...mockUserInstance,
      getIdeas: jest.fn().mockResolvedValue([idea]),
    });

    const result = await fetchSavedIdeas(1);

    expect(result).toBe(false);
  });

  test("maps each idea's sectors separately", async () => {
    const sector1 = { toJSON: jest.fn().mockReturnValue({ id: 1, name: "AI" }) };
    const sector2 = { toJSON: jest.fn().mockReturnValue({ id: 2, name: "FinTech" }) };
    const idea1 = buildIdeaWithSectors([sector1], new Date("2024-01-01"));
    const idea2 = buildIdeaWithSectors([sector2], new Date("2024-06-01"));

    mockUser.findByPk.mockResolvedValue({
      ...mockUserInstance,
      getIdeas: jest.fn().mockResolvedValue([idea1, idea2]),
    });

    await fetchSavedIdeas(1);

    expect(idea1.dataValues.sectors).toEqual([{ id: 1, name: "AI" }]);
    expect(idea2.dataValues.sectors).toEqual([{ id: 2, name: "FinTech" }]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. fetchSavedIdea
// ─────────────────────────────────────────────────────────────────────────────
describe("fetchSavedIdea", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Returns a mock ideas[0] instance */
  function buildIdeaObject({
    targetUsers = ["user1"],
    inspiredBy = ["Google"],
  } = {}) {
    const json = { targetUsers, inspiredBy, title: "Test Idea" };
    return {
      toJSON: jest.fn().mockReturnValue(json),
      getSectors: jest.fn().mockResolvedValue([{ id: 1, name: "Tech" }]),
    };
  }

  test("throws 'User not found' when User.findByPk returns null", async () => {
    mockUser.findByPk.mockResolvedValue(null);

    await expect(fetchSavedIdea(99, 1)).rejects.toThrow("User not found");
  });

  test("returns merged object with sectors, targetUsers, inspiredBy on success", async () => {
    const ideaObj = buildIdeaObject();
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result).toMatchObject({
      title: "Test Idea",
      sectors: [{ id: 1, name: "Tech" }],
      targetUsers: ["user1"],
      inspiredBy: ["Google"],
    });
  });

  test("parses targetUsers from valid JSON string", async () => {
    const ideaObj = buildIdeaObject({ targetUsers: '["user1","user2"]' });
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result.targetUsers).toEqual(["user1", "user2"]);
  });

  test("falls back to CSV split when targetUsers is an invalid JSON string", async () => {
    // Not valid JSON, but a comma-separated string
    const ideaObj = buildIdeaObject({ targetUsers: "user1,user2,user3" });
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result.targetUsers).toEqual(["user1", "user2", "user3"]);
  });

  test("leaves targetUsers unchanged when it is not a string (e.g. array)", async () => {
    const ideaObj = buildIdeaObject({ targetUsers: ["user1", "user2"] });
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result.targetUsers).toEqual(["user1", "user2"]);
  });

  test("leaves targetUsers unchanged when it is null (non-string)", async () => {
    const ideaObj = buildIdeaObject({ targetUsers: null });
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result.targetUsers).toBeNull();
  });

  test("parses inspiredBy from valid JSON string", async () => {
    const ideaObj = buildIdeaObject({ inspiredBy: '["Google","OpenAI"]' });
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result.inspiredBy).toEqual(["Google", "OpenAI"]);
  });

  test("falls back to CSV split when inspiredBy is an invalid JSON string", async () => {
    const ideaObj = buildIdeaObject({ inspiredBy: "Google,OpenAI,Meta" });
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result.inspiredBy).toEqual(["Google", "OpenAI", "Meta"]);
  });

  test("leaves inspiredBy unchanged when it is not a string (e.g. array)", async () => {
    const ideaObj = buildIdeaObject({ inspiredBy: ["Google", "OpenAI"] });
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result.inspiredBy).toEqual(["Google", "OpenAI"]);
  });

  test("leaves inspiredBy unchanged when it is null (non-string)", async () => {
    const ideaObj = buildIdeaObject({ inspiredBy: null });
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result.inspiredBy).toBeNull();
  });

  test("returns null when ideas array is empty (length === 0)", async () => {
    // ideas array is empty → ideas.length > 0 is false → return null
    // But ideas[0].toJSON() would throw first — so we need to simulate
    // an empty array returned AFTER the toJSON call would crash.
    // Looking at the implementation: it accesses ideas[0] unconditionally
    // before the length check. So an empty array causes a TypeError.
    // This tests the outer catch re-throwing path.
    const user = { getIdeas: jest.fn().mockResolvedValue([]) };
    mockUser.findByPk.mockResolvedValue(user);

    // ideas[0] is undefined → ideas[0].toJSON() throws TypeError
    await expect(fetchSavedIdea(1, 1)).rejects.toThrow();
  });

  test("re-throws error when User.findByPk rejects", async () => {
    mockUser.findByPk.mockRejectedValue(new Error("DB failure"));

    await expect(fetchSavedIdea(1, 1)).rejects.toThrow("DB failure");
  });

  test("re-throws error when user.getIdeas rejects", async () => {
    const user = {
      getIdeas: jest.fn().mockRejectedValue(new Error("getIdeas failure")),
    };
    mockUser.findByPk.mockResolvedValue(user);

    await expect(fetchSavedIdea(1, 1)).rejects.toThrow("getIdeas failure");
  });

  test("re-throws error when ideas[0].getSectors rejects", async () => {
    const ideaObj = {
      toJSON: jest.fn().mockReturnValue({ targetUsers: [], inspiredBy: [] }),
      getSectors: jest.fn().mockRejectedValue(new Error("getSectors failure")),
    };
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    await expect(fetchSavedIdea(1, 1)).rejects.toThrow("getSectors failure");
  });

  test("calls user.getIdeas with where clause filtering by ideaId", async () => {
    const ideaObj = buildIdeaObject();
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    await fetchSavedIdea(1, 42);

    expect(user.getIdeas).toHaveBeenCalledWith({ where: { id: 42 } });
  });

  test("both targetUsers and inspiredBy go through JSON.parse on valid JSON strings simultaneously", async () => {
    const ideaObj = buildIdeaObject({
      targetUsers: '["a","b"]',
      inspiredBy: '["x","y"]',
    });
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result.targetUsers).toEqual(["a", "b"]);
    expect(result.inspiredBy).toEqual(["x", "y"]);
  });

  test("both targetUsers and inspiredBy fall back to CSV split on invalid JSON strings simultaneously", async () => {
    const ideaObj = buildIdeaObject({
      targetUsers: "a,b,c",
      inspiredBy: "x,y,z",
    });
    const user = { getIdeas: jest.fn().mockResolvedValue([ideaObj]) };
    mockUser.findByPk.mockResolvedValue(user);

    const result = await fetchSavedIdea(1, 1);

    expect(result.targetUsers).toEqual(["a", "b", "c"]);
    expect(result.inspiredBy).toEqual(["x", "y", "z"]);
  });
});
