import site from "../../data/site";
import {
  getOptionalSectionVisibility,
  getSectionIndices,
} from "../../lib/sections";
import "./Packages.css";

const sectionVisibility = getOptionalSectionVisibility();
const sectionIndices = getSectionIndices(sectionVisibility);

export default function Packages() {
  if (!sectionVisibility.packages) return null;

  return (
    <section className="packages section" id="packages" aria-labelledby="packages-title">
      <div className="wrap">
        <div className="label-row mono">
          <span className="label-index">{sectionIndices.packages}</span>
          <span>Packages</span>
          <span className="label-note dim">Scope and timing</span>
        </div>

        <h2 id="packages-title" className="display display--md packages-title">
          Choose a starting point<span className="accent">.</span>
        </h2>

        <ul className="packages-grid">
          {site.packages.map((item) => (
            <li className="package-card" key={item.name}>
              <h3 className="display package-name">{item.name}</h3>
              <dl className="package-details">
                <div>
                  <dt className="mono dim">Price</dt>
                  <dd>{item.price.trim() || "[TODO: price]"}</dd>
                </div>
                <div>
                  <dt className="mono dim">Delivery</dt>
                  <dd>{item.delivery.trim() || "[TODO: delivery time]"}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
