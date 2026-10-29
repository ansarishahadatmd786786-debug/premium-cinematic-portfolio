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

  it("skips TODO-backed production sections when calculating contact index", () => {
    const visibility = getOptionalSectionVisibility(false);

    expect(visibility).toEqual({ caseStudy: false, packages: false });
    expect(getSectionIndices(visibility)).toEqual({
      caseStudy: "07",
      packages: "07",
      contact: "07",
    });
  });
});
