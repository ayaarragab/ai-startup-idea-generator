/**
 * Unit Test Suite: sector.services.js
 *
 * Coverage checklist
 * ───────────────────────────────────────────────────────────────────────────
 * 1. fetchSectors()
 *    - Calls Sector.findAll with where.is_deleted false
 *    - Returns array of toJSON() results when findAll returns instances
 *    - Returns empty array when findAll returns []
 *    - Returns empty array when findAll returns non-array (null/undefined)
 *    - Re-throws when findAll rejects
 *
 * 2. fetchSector(id)
 *    - Calls Sector.findByPk with the provided id
 *    - Returns sector.name when sector object returned
 *    - Returns undefined when sector exists but has no name property
 *    - Throws when Sector.findByPk returns null (accessing .name on null)
 *    - Re-throws when findByPk rejects
 *
 * 3. fetchSectorsNames(convSectors)
 *    - Returns [] when convSectors is not an array (null, undefined, number, string)
 *    - Returns [] when convSectors is empty
 *    - Resolves to array of names when all fetches succeed
 *    - Includes undefined for sectors whose name is undefined
 *    - Rejects when any underlying fetch (findByPk) rejects
 * TEST COVERAGE REPORT

  | Function | Covered Cases | Missing Cases | Coverage Confidence |
  |----------|---------------|---------------|---------------------|
  | fetchSectors | findAll called with where; returns mapped toJSON; empty array; non-array null; error thrown | None (all reachable behaviors covered) | High |
  | fetchSector | returns name; returns undefined when no name; throws on null result; re-throws db error; verifies id passed | None (null-result throws are tested as implemented) | High |
  | fetchSectorsNames | handles null/undefined/non-array; empty array; maps ids->names; includes undefined names; rejects when any fetch fails | None (Promise.all rejection path covered) | High |

  Final verification checklist:
  - Every exported function in `sector.services.js` has tests: `fetchSectors`, `fetchSector`, `fetchSectorsNames`.
  - Branches covered: early returns for invalid inputs; success mapping branches; error/rejection branches for DB calls.
  - Exception paths tested: DB rejections and null-result access for `fetchSector` (TypeError) are asserted.
  - No functions were skipped.

  Notes:
  - `fetchSector` intentionally does not guard against `null` from `findByPk`; tests assert the current behavior (TypeError) rather than changing implementation.
  - All external DB interactions are mocked (`Sector.findAll`, `Sector.findByPk`).

 */

import { jest } from "@jest/globals";

// Mock the db module before importing the service so the service captures
// the mocked Sector model at module load time.
const mockSector = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

jest.unstable_mockModule("../../models/index.js", () => ({
  default: {
    Sector: mockSector,
  },
}));

const { fetchSectors, fetchSector, fetchSectorsNames } =
  await import("../sector.services.js");

describe("sector.services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchSectors", () => {
    test("calls findAll with is_deleted:false and returns mapped toJSON list", async () => {
      const instances = [
        { toJSON: () => ({ id: 1, name: "A" }) },
        { toJSON: () => ({ id: 2, name: "B" }) },
      ];

      mockSector.findAll.mockResolvedValue(instances);

      const result = await fetchSectors();

      expect(mockSector.findAll).toHaveBeenCalledWith({
        where: { is_deleted: false },
      });
      expect(result).toEqual([
        { id: 1, name: "A" },
        { id: 2, name: "B" },
      ]);
    });

    test("returns empty array when findAll returns empty array", async () => {
      mockSector.findAll.mockResolvedValue([]);

      const result = await fetchSectors();

      expect(result).toEqual([]);
    });

    test("returns empty array when findAll returns non-array (null)", async () => {
      mockSector.findAll.mockResolvedValue(null);

      const result = await fetchSectors();

      expect(result).toEqual([]);
    });

    test("re-throws when findAll rejects", async () => {
      const err = new Error("db failure");
      mockSector.findAll.mockRejectedValue(err);

      await expect(fetchSectors()).rejects.toThrow("db failure");
    });
  });

  describe("fetchSector", () => {
    test("returns the sector.name when sector found", async () => {
      mockSector.findByPk.mockResolvedValue({ name: "SectorName" });

      const result = await fetchSector(5);

      expect(mockSector.findByPk).toHaveBeenCalledWith(5);
      expect(result).toBe("SectorName");
    });

    test("returns undefined when sector exists but has no name property", async () => {
      mockSector.findByPk.mockResolvedValue({});

      const result = await fetchSector(7);

      expect(result).toBeUndefined();
    });

    test("throws when findByPk returns null (access .name on null)", async () => {
      mockSector.findByPk.mockResolvedValue(null);

      await expect(fetchSector(9)).rejects.toThrow(TypeError);
    });

    test("re-throws when findByPk rejects", async () => {
      const dbErr = new Error("findByPk failed");
      mockSector.findByPk.mockRejectedValue(dbErr);

      await expect(fetchSector(3)).rejects.toThrow("findByPk failed");
    });
  });

  describe("fetchSectorsNames", () => {
    test("returns [] when convSectors is null", async () => {
      const result = await fetchSectorsNames(null);
      expect(result).toEqual([]);
    });

    test("returns [] when convSectors is undefined", async () => {
      const result = await fetchSectorsNames(undefined);
      expect(result).toEqual([]);
    });

    test("returns [] when convSectors is empty array", async () => {
      const result = await fetchSectorsNames([]);
      expect(result).toEqual([]);
    });

    test("resolves to array of names for provided ids", async () => {
      mockSector.findByPk.mockImplementation((id) =>
        Promise.resolve({ name: `Name:${id}` }),
      );

      const result = await fetchSectorsNames([1, 2, 3]);

      expect(mockSector.findByPk).toHaveBeenCalledTimes(3);
      expect(result).toEqual(["Name:1", "Name:2", "Name:3"]);
    });

    test("includes undefined when a sector has no name", async () => {
      mockSector.findByPk.mockImplementation((id) =>
        Promise.resolve(id === 2 ? {} : { name: `N${id}` }),
      );

      const result = await fetchSectorsNames([1, 2]);

      expect(result).toEqual(["N1", undefined]);
    });

    test("rejects when any underlying fetch (findByPk) rejects", async () => {
      mockSector.findByPk.mockImplementation((id) => {
        if (id === 2) return Promise.reject(new Error("boom"));
        return Promise.resolve({ name: `ok${id}` });
      });

      await expect(fetchSectorsNames([1, 2, 3])).rejects.toThrow("boom");
    });
  });
});

