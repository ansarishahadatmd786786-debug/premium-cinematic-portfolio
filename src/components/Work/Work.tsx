import projects from "../../data/projects";
import ProjectCard from "./ProjectCard";
import "./Work.css";

export default function Work() {
  return (
    <section className="work" id="work" aria-label="Selected work">
      <div className="wrap">
        <header className="workintro">
          <div className="workintro-pin">
            <div className="workintro-head">
              <span className="workintro-title display">
                SELECTED WORK
              </span>

              <span className="workintro-count mono">
                <span className="accent">01</span>
                <span className="dim"> / {String(projects.length).padStart(2, "0")}</span>
              </span>
            </div>

            <div className="workintro-projects">
              <span className="workintro-num display">
                {String(projects.length).padStart(2, "0")}
              </span>

              <div className="workintro-line">
                <span className="accent" />
              </div>
            </div>

            <div className="workintro-note">
              <p className="mono dim">
                PREMIUM DIGITAL EXPERIENCES
              </p>

              <h2 className="workintro-statement display">
                I BUILD DIGITAL EXPERIENCES
                <br />
                FOR BUSINESSES.
              </h2>

              <p className="mono dim">
                A collection of websites crafted for brands,
                <br />
                businesses and ambitious ideas.
              </p>
            </div>
          </div>
        </header>

        {projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            flip={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}