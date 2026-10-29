import site from "../data/site";

export type OptionalSectionVisibility = {
  caseStudy: boolean;
  packages: boolean;
};

function isTodo(value: string) {
  return !value.trim() || value.startsWith("[TODO:");
}

export function getOptionalSectionVisibility(
  isDevelopment = import.meta.env.DEV,
): OptionalSectionVisibility {
  const caseStudyHasTodo = Object.values(site.caseStudy).some(isTodo);
  const packagesHaveTodo = site.packages.some(
    (item) => isTodo(item.price) || isTodo(item.delivery),
  );

  return {
    caseStudy: isDevelopment || !caseStudyHasTodo,
    packages: isDevelopment || !packagesHaveTodo,
  };
}

export function getSectionIndices(
  visibility: OptionalSectionVisibility = getOptionalSectionVisibility(),
) {
  const baseIndex = 7;
  const caseStudy = baseIndex;
  const packages = baseIndex + Number(visibility.caseStudy);
  const contact =
    baseIndex + Number(visibility.caseStudy) + Number(visibility.packages);

  return {
    caseStudy: String(caseStudy).padStart(2, "0"),
    packages: String(packages).padStart(2, "0"),
    contact: String(contact).padStart(2, "0"),
  };
}
