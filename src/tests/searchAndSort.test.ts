import { describe, it, expect } from "vitest";
import {
  searchEntities,
  matchesSearch,
  searchEntitiesMultiTerm,
} from "../features/entity-table/utils/search";
import {
  sortByName,
  sortByDate,
  sortByValue,
  getTypedSorter,
} from "../features/entity-table/utils/sorters";
import type { EntityItem } from "../features/entity-table/types/entity";

const mockEntities: EntityItem[] = [
  {
    id: "1",
    name: "Apple",
    date: "2023-01-15T00:00:00.000Z",
    value: 100,
  },
  {
    id: "2",
    name: "Banana",
    date: "2023-02-10T00:00:00.000Z",
    value: 200,
  },
  {
    id: "3",
    name: "Cherry",
    date: "2023-03-05T00:00:00.000Z",
    value: 150,
  },
];

describe("Search Utilities", () => {
  describe("matchesSearch", () => {
    it("matches by name (case insensitive)", () => {
      expect(matchesSearch(mockEntities[0]!, "apple")).toBe(true);
      expect(matchesSearch(mockEntities[0]!, "APPLE")).toBe(true);
      expect(matchesSearch(mockEntities[0]!, "ApPlE")).toBe(true);
    });

    it("matches by partial name", () => {
      expect(matchesSearch(mockEntities[0]!, "app")).toBe(true);
      expect(matchesSearch(mockEntities[1]!, "ban")).toBe(true);
    });

    it("matches by date", () => {
      // Date is stored as ISO format, so search for parts of it
      expect(matchesSearch(mockEntities[0]!, "2023-01-15")).toBe(true);
      expect(matchesSearch(mockEntities[1]!, "2023")).toBe(true);
    });

    it("matches by value", () => {
      expect(matchesSearch(mockEntities[0]!, "100")).toBe(true);
      expect(matchesSearch(mockEntities[1]!, "200")).toBe(true);
    });

    it("matches by id", () => {
      expect(matchesSearch(mockEntities[0]!, "1")).toBe(true);
      expect(matchesSearch(mockEntities[2]!, "3")).toBe(true);
    });

    it("returns false for non-matching query", () => {
      expect(matchesSearch(mockEntities[0]!, "xyz")).toBe(false);
    });

    it("handles empty query", () => {
      expect(matchesSearch(mockEntities[0]!, "")).toBe(false);
    });
  });

  describe("searchEntities", () => {
    it("returns all entities for empty search term", () => {
      const result = searchEntities(mockEntities, "");
      expect(result).toEqual(mockEntities);
    });

    it("filters entities by name", () => {
      const result = searchEntities(mockEntities, "apple");
      expect(result).toHaveLength(1);
      expect(result[0]!.name).toBe("Apple");
    });

    it("filters entities case insensitively", () => {
      const result = searchEntities(mockEntities, "BANANA");
      expect(result).toHaveLength(1);
      expect(result[0]!.name).toBe("Banana");
    });

    it("returns empty array for no matches", () => {
      const result = searchEntities(mockEntities, "nonexistent");
      expect(result).toHaveLength(0);
    });
  });

  describe("searchEntitiesMultiTerm", () => {
    it("searches with multiple terms", () => {
      const entities: EntityItem[] = [
        {
          id: "1",
          name: "Apple Red",
          date: "2023-01-01T00:00:00.000Z",
          value: 100,
        },
        {
          id: "2",
          name: "Apple Green",
          date: "2023-01-02T00:00:00.000Z",
          value: 150,
        },
        {
          id: "3",
          name: "Banana Yellow",
          date: "2023-01-03T00:00:00.000Z",
          value: 200,
        },
      ];

      const result = searchEntitiesMultiTerm(entities, "apple red");
      expect(result).toHaveLength(1);
      expect(result[0]!.name).toBe("Apple Red");
    });

    it("handles single term", () => {
      const result = searchEntitiesMultiTerm(mockEntities, "apple");
      expect(result).toHaveLength(1);
    });

    it("returns all for empty query", () => {
      const result = searchEntitiesMultiTerm(mockEntities, "");
      expect(result).toEqual(mockEntities);
    });
  });
});

describe("Sort Utilities", () => {
  describe("sortByName", () => {
    it("sorts names in ascending order", () => {
      const sorted = [...mockEntities].sort((a, b) => sortByName(a, b, "asc"));
      expect(sorted[0]!.name).toBe("Apple");
      expect(sorted[1]!.name).toBe("Banana");
      expect(sorted[2]!.name).toBe("Cherry");
    });

    it("sorts names in descending order", () => {
      const sorted = [...mockEntities].sort((a, b) => sortByName(a, b, "desc"));
      expect(sorted[0]!.name).toBe("Cherry");
      expect(sorted[1]!.name).toBe("Banana");
      expect(sorted[2]!.name).toBe("Apple");
    });
  });

  describe("sortByDate", () => {
    it("sorts dates in ascending order", () => {
      const sorted = [...mockEntities].sort((a, b) => sortByDate(a, b, "asc"));
      expect(sorted[0]!.date).toBe("2023-01-15T00:00:00.000Z");
      expect(sorted[1]!.date).toBe("2023-02-10T00:00:00.000Z");
      expect(sorted[2]!.date).toBe("2023-03-05T00:00:00.000Z");
    });

    it("sorts dates in descending order", () => {
      const sorted = [...mockEntities].sort((a, b) => sortByDate(a, b, "desc"));
      expect(sorted[0]!.date).toBe("2023-03-05T00:00:00.000Z");
      expect(sorted[1]!.date).toBe("2023-02-10T00:00:00.000Z");
      expect(sorted[2]!.date).toBe("2023-01-15T00:00:00.000Z");
    });
  });

  describe("sortByValue", () => {
    it("sorts values in ascending order", () => {
      const sorted = [...mockEntities].sort((a, b) => sortByValue(a, b, "asc"));
      expect(sorted[0]!.value).toBe(100);
      expect(sorted[1]!.value).toBe(150);
      expect(sorted[2]!.value).toBe(200);
    });

    it("sorts values in descending order", () => {
      const sorted = [...mockEntities].sort((a, b) =>
        sortByValue(a, b, "desc"),
      );
      expect(sorted[0]!.value).toBe(200);
      expect(sorted[1]!.value).toBe(150);
      expect(sorted[2]!.value).toBe(100);
    });
  });

  describe("getTypedSorter", () => {
    it("returns sorter for name field", () => {
      const sorter = getTypedSorter("name");
      const sorted = [...mockEntities].sort(sorter);
      expect(sorted[0]!.name).toBe("Apple");
    });

    it("returns sorter for date field", () => {
      const sorter = getTypedSorter("date");
      const sorted = [...mockEntities].sort(sorter);
      expect(sorted[0]!.date).toBe("2023-01-15T00:00:00.000Z");
    });

    it("returns sorter for value field", () => {
      const sorter = getTypedSorter("value");
      const sorted = [...mockEntities].sort(sorter);
      expect(sorted[0]!.value).toBe(100);
    });

    it("returns sorter for id field", () => {
      const sorter = getTypedSorter("id");
      const sorted = [...mockEntities].sort(sorter);
      expect(sorted[0]!.id).toBe("1");
    });
  });
});
