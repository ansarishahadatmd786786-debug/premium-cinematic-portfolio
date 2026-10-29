import { useState } from "react";
import projects from "../../data/projects";
import ProjectCard from "./ProjectCard";
import "./Work.css";

export default function Work() {
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll
    ? projects
    : projects.filter((project) => project.featured);

  return (
    <section className="work" id="work" aria-label="Selected work">
      <div className="wrap">
        <div className="work-controls">
          <span className="mono dim">
            Showing {visibleProjects.length} of {projects.length}
          </span>
          <button
            type="button"
            className="btn btn--ghost"
            aria-controls="project-list"
            aria-expanded={showAll}
            onClick={() => setShowAll((value) => !value)}
          >
            {showAll ? "Show featured projects" : "Show all projects"}
          </button>
        </div>

        <div id="project-list">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              flip={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}