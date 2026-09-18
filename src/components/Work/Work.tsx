import projects from "../../data/projects";
import ProjectCard from "./ProjectCard";
import "./Work.css";

export default function Work() {
  return (
    <section className="work" id="work" aria-label="Project gallery">
      <div className="wrap">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
