import { useNavigate } from "react-router-dom";

const accent = "#e73e7f";
const accentDim = "rgba(231,62,127,0.15)";
const accentBorder = "rgba(231,62,127,0.25)";

interface Project {
  title: string;
  company: string;
  period: string;
  tags: string[];
  placeholderGradient: string;
  shapes: React.ReactNode;
}

const projects: Project[] = [
  {
    title: "AI Companion Platform",
    company: "Maslo",
    period: "2023 – 2024",
    tags: ["React", "TypeScript", "Design System", "Figma"],
    placeholderGradient: "linear-gradient(135deg, #2d0d4e 0%, #6b1635 100%)",
    shapes: (
      <>
        <div style={{ position: "absolute", top: 24, left: 24, width: 72, height: 72, borderRadius: "50%", border: "1px solid rgba(231,62,127,0.35)" }} />
        <div style={{ position: "absolute", top: 44, left: 44, width: 32, height: 32, borderRadius: "50%", background: "rgba(231,62,127,0.15)" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 100, height: 1, background: "rgba(231,62,127,0.3)" }} />
        <div style={{ position: "absolute", bottom: 36, right: 24, width: 60, height: 1, background: "rgba(231,62,127,0.2)" }} />
      </>
    ),
  },
  {
    title: "Employee Gamification Platform",
    company: "Roadoo",
    period: "2021 – 2023",
    tags: ["Angular", "SCSS", "Component Library", "Theme Engine"],
    placeholderGradient: "linear-gradient(135deg, #1a0d2e 0%, #4a1260 100%)",
    shapes: (
      <>
        {[0, 1, 2, 3, 4].map((col) =>
          [0, 1, 2, 3].map((row) => (
            <div key={`${col}-${row}`} style={{ position: "absolute", left: 24 + col * 22, top: 24 + row * 22, width: 6, height: 6, borderRadius: "50%", background: "rgba(231,62,127,0.25)" }} />
          ))
        )}
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, height: 2, background: "rgba(231,62,127,0.2)", borderRadius: 4 }} />
      </>
    ),
  },
  {
    title: "Portfolio & Motion Experiments",
    company: "Personal",
    period: "2024 –",
    tags: ["React", "Framer Motion", "Tailwind", "Canvas"],
    placeholderGradient: "linear-gradient(135deg, #0d0d1a 0%, #1a1635 100%)",
    shapes: (
      <>
        <div style={{ position: "absolute", top: 20, left: 20, right: 20, height: 1, background: "rgba(231,62,127,0.2)" }} />
        <div style={{ position: "absolute", top: 36, left: 20, width: "55%", height: 1, background: "rgba(231,62,127,0.15)" }} />
        <div style={{ position: "absolute", top: 52, left: 20, width: "35%", height: 1, background: "rgba(231,62,127,0.1)" }} />
        <div style={{ position: "absolute", bottom: 28, right: 20, width: 48, height: 48, borderRadius: 8, border: "1px solid rgba(231,62,127,0.3)" }} />
      </>
    ),
  },
];

const ProjectCard = ({ project }: { project: Project }) => (
  <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accentBorder}`, borderRadius: 16, overflow: "hidden" }}>
    <div className="relative" style={{ height: 180, background: project.placeholderGradient }}>
      {project.shapes}
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ color: "rgba(231,62,127,0.35)", fontSize: 10, letterSpacing: "0.25em", fontFamily: "monospace" }}>PROJECT PREVIEW</span>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-semibold text-white mb-1" style={{ fontSize: 16 }}>{project.title}</h3>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 12 }}>{project.company} · {project.period}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} style={{ background: accentDim, border: `1px solid ${accentBorder}`, color: accent, fontSize: 11, padding: "2px 8px", borderRadius: 20 }}>{tag}</span>
        ))}
      </div>
    </div>
  </div>
);

export default function Sass() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen pt-16" style={{ background: "linear-gradient(160deg, #0d0609 0%, #1a0a12 50%, #0d0609 100%)" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="pt-16 pb-24 flex flex-col justify-center" style={{ minHeight: "75vh" }}>
          <button onClick={() => navigate("/")} style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 40, display: "flex", alignItems: "center", gap: 6, width: "fit-content", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
            ← Home
          </button>
          <p style={{ color: accent, fontSize: 12, letterSpacing: "0.2em", marginBottom: 16, fontFamily: "monospace" }}>SASS / SAAS</p>
          <h1 style={{ fontSize: "clamp(3rem, 10vw, 7rem)", fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Styling<br /><span style={{ color: accent }}>Excellence.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, maxWidth: 540, lineHeight: 1.7 }}>
            Product-first UI across SaaS platforms — from design systems and theme engines to complex animations and component libraries.
          </p>
        </div>

        <div className="pb-24">
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, letterSpacing: "0.2em", marginBottom: 32, fontFamily: "monospace" }}>SELECTED WORK</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p) => <ProjectCard key={p.title} project={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
