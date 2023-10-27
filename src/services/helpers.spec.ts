import { describe, it, expect } from "vitest";
import { generatePoints } from "./helpers";

describe("generatePoints", () => {
  it("should generate points", () => {
    const points = generatePoints(0, 2, 0, 2);
    expect(points).toEqual([
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
  });
  it("should generate points", () => {
    const points = generatePoints(34, 38, 14, 15);
    expect(points).toEqual([
      [34, 14],
      [35, 14],
      [36, 14],
      [37, 14],
      [38, 14],
      [34, 15],
      [35, 15],
      [36, 15],
      [37, 15],
      [38, 15],
    ]);
  });
});
