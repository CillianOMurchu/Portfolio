import { useNavigate } from "react-router-dom";

const accent = "#6ba3d1";
const accentDim = "rgba(107,163,209,0.12)";
const accentBorder = "rgba(107,163,209,0.22)";

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
    title: "Property Management System",
    company: "Lighthouse",
    period: "2021 – 2022",
    tags: ["React", "Node.js", "PostgreSQL", "Real-time"],
    placeholderGradient: "linear-gradient(135deg, #0d1a2e 0%, #1a3a5c 100%)",
    shapes: (
      <>
        <div style={{ position: "absolute", top: 24, left: 24, right: 24, height: 1, background: "rgba(107,163,209,0.3)" }} />
        <div style={{ position: "absolute", top: 40, left: 24, right: 60, height: 1, background: "rgba(107,163,209,0.2)" }} />
        <div style={{ position: "absolute", top: 56, left: 24, right: 80, height: 1, background: "rgba(107,163,209,0.15)" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 44, height: 44, borderRadius: 8, border: "1px solid rgba(107,163,209,0.3)" }} />
        <div style={{ position: "absolute", bottom: 24, left: 80, width: 64, height: 44, borderRadius: 8, border: "1px solid rgba(107,163,209,0.2)" }} />
        <div style={{ position: "absolute", bottom: 24, left: 156, width: 44, height: 44, borderRadius: 8, border: "1px solid rgba(107,163,209,0.15)" }} />
      </>
    ),
  },
  {
    title: "Competitive Rate Intelligence",
    company: "Lighthouse",
    period: "2022",
    tags: ["Angular", "D3.js", "WebSocket", "APIs"],
    placeholderGradient: "linear-gradient(135deg, #0a1a1f 0%, #1a3d4a 100%)",
    shapes: (
      <>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ position: "absolute", bottom: 24 + i * 14, left: 24 + i * 12, width: 8, height: 8 + i * 8, background: `rgba(107,163,209,${0.1 + i * 0.04})`, borderRadius: 2 }} />
        ))}
        <div style={{ position: "absolute", top: 20, right: 20, width: 80, height: 80, borderRadius: "50%", border: "1px solid rgba(107,163,209,0.2)" }} />
      </>
    ),
  },
  {
    title: "Guest Intelligence Platform",
    company: "Lighthouse",
    period: "2022",
    tags: ["React", "TypeScript", "Charts", "Multi-property"],
    placeholderGradient: "linear-gradient(135deg, #060e1a 0%, #0d2240 100%)",
    shapes: (
      <>
        <div style={{ position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)", width: 80, height: 80, borderRadius: "50%", border: "1px solid rgba(107,163,209,0.25)" }} />
        <div style={{ position: "absolute", top: 44, left: "50%", transform: "translateX(-50%)", width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(107,163,209,0.2)" }} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <div key={i} style={{ position: "absolute", top: 64 + Math.sin(angle) * 55, left: "50%", marginLeft: Math.cos(angle) * 55, width: 5, height: 5, borderRadius: "50%", background: "rgba(107,163,209,0.4)" }} />
          );
        })}
      </>
    ),
  },
];

const ProjectCard = ({ project }: { project: Project }) => (
  <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accentBorder}`, borderRadius: 16, overflow: "hidden" }}>
    <div className="relative" style={{ height: 180, background: project.placeholderGradient }}>
      {project.shapes}
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ color: "rgba(107,163,209,0.3)", fontSize: 10, letterSpacing: "0.25em", fontFamily: "monospace" }}>PROJECT PREVIEW</span>
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

export default function Hospitality() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen pt-16" style={{ background: "linear-gradient(160deg, #060b12 0%, #0d1820 50%, #060b12 100%)" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="pt-16 pb-24 flex flex-col justify-center" style={{ minHeight: "75vh" }}>
          <button onClick={() => navigate("/")} style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 40, display: "flex", alignItems: "center", gap: 6, width: "fit-content", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
            ← Home
          </button>
          <p style={{ color: accent, fontSize: 12, letterSpacing: "0.2em", marginBottom: 16, fontFamily: "monospace" }}>HOSPITALITY</p>
          <h1 style={{ fontSize: "clamp(3rem, 10vw, 7rem)", fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Guest<br /><span style={{ color: accent }}>Experience.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, maxWidth: 540, lineHeight: 1.7 }}>
            Three years building property management systems, pricing intelligence, and analytics platforms that power hotels worldwide.
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
