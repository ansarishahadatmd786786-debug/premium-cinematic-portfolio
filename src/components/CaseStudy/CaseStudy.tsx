import site from "../../data/site";
import {
  getOptionalSectionVisibility,
  getSectionIndices,
} from "../../lib/sections";
import "./CaseStudy.css";

const sectionVisibility = getOptionalSectionVisibility();
const sectionIndices = getSectionIndices(sectionVisibility);

const fields = [
  {
    label: "Problem",
    value: site.caseStudy.problem.trim() || "[TODO: problem]",
  },
  {
    label: "What I built",
    value: site.caseStudy.built.trim() || "[TODO: what was built]",
  },
  {
    label: "Result",
    value: site.caseStudy.result.trim() || "[TODO: measurable result]",
  },
];
const client =
  site.caseStudy.client.trim() || "[TODO: client]";

export default function CaseStudy() {
  if (!sectionVisibility.caseStudy) return null;

  return (
    <section
      className="case-study section"
      id="case-study"
      aria-labelledby="case-study-title"
    >
      <div className="wrap">
        <div className="label-row mono">
          <span className="label-index">{sectionIndices.caseStudy}</span>
          <span>Case study</span>
          <span className="label-note dim">Project details</span>
        </div>

        <p className="case-study-client mono dim">{client}</p>
        <h2 id="case-study-title" className="display display--md case-study-title">
          A project in context<span className="accent">.</span>
        </h2>

        <dl className="case-study-grid">
          {fields.map((field) => (
            <div key={field.label} className="case-study-item">
              <dt className="mono dim">{field.label}</dt>
              <dd>{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
