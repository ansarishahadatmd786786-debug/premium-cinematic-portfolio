import { describe, expect, it } from "vitest";
import {
  getOptionalSectionVisibility,
  getSectionIndices,
} from "./sections";

describe("optional section numbering", () => {
  it("numbers all development sections consecutively", () => {
    const visibility = getOptionalSectionVisibility(true);

    expect(visibility).toEqual({ caseStudy: true, packages: true });
    expect(getSectionIndices(visibility)).toEqual({
      caseStudy: "07",
      packages: "08",
      contact: "09",
    });
  });

  it("hides the TODO-backed case study and shows completed packages in production", () => {
    const visibility = getOptionalSectionVisibility(false);

    expect(visibility).toEqual({ caseStudy: false, packages: true });
    expect(getSectionIndices(visibility)).toEqual({
      caseStudy: "07",
      packages: "07",
      contact: "08",
    });
  });
});
