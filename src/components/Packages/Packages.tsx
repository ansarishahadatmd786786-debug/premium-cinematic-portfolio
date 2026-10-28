import site from "../../data/site";
import "./Packages.css";

const hasTodo = site.packages.some(
  (item) =>
    !item.price.trim() ||
    !item.delivery.trim() ||
    item.price.startsWith("[TODO:") ||
    item.delivery.startsWith("[TODO:"),
);

export default function Packages() {
  if (!import.meta.env.DEV && hasTodo) return null;

  return (
    <section className="packages section" id="packages" aria-labelledby="packages-title">
      <div className="wrap">
        <div className="label-row mono">
          <span className="label-index">09</span>
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
