import { useNavigate } from "react-router-dom";

const accent = "#5d9d7a";
const accentDim = "rgba(93,157,122,0.12)";
const accentBorder = "rgba(93,157,122,0.22)";

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
    title: "Sports Betting Platform",
    company: "Betsson",
    period: "2019 – 2021",
    tags: ["Angular", "RxJS", "WebSocket", "Performance"],
    placeholderGradient: "linear-gradient(135deg, #061209 0%, #0d2e18 100%)",
    shapes: (
      <>
        <div style={{ position: "absolute", top: 24, left: 24, right: 24, height: 20, borderRadius: 4, background: "rgba(93,157,122,0.15)", border: "1px solid rgba(93,157,122,0.25)" }} />
        <div style={{ position: "absolute", top: 54, left: 24, width: "40%", height: 12, borderRadius: 3, background: "rgba(93,157,122,0.1)" }} />
        <div style={{ position: "absolute", top: 54, right: 24, width: "30%", height: 12, borderRadius: 3, background: "rgba(93,157,122,0.08)" }} />
        <div style={{ position: "absolute", top: 76, left: 24, right: 24, height: 1, background: "rgba(93,157,122,0.15)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24, width: 8, height: 8, borderRadius: "50%", background: accent }} />
        <div style={{ position: "absolute", bottom: 18, left: 40, width: 50, height: 12, borderRadius: 3, background: "rgba(93,157,122,0.2)" }} />
      </>
    ),
  },
  {
    title: "Poker Client & Lobby",
    company: "PokerStars",
    period: "2021 – 2022",
    tags: ["React", "WebGL", "Animations", "Real-time"],
    placeholderGradient: "linear-gradient(135deg, #120609 0%, #2e0d18 100%)",
    shapes: (
      <>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", width: 90, height: 90, borderRadius: 12, border: "1px solid rgba(93,157,122,0.3)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", width: 60, height: 60, borderRadius: 8, background: "rgba(93,157,122,0.08)", border: "1px solid rgba(93,157,122,0.2)" }} />
        <div style={{ position: "absolute", top: 20, right: 20, fontSize: 24, color: "rgba(93,157,122,0.2)" }}>♠</div>
        <div style={{ position: "absolute", bottom: 20, left: 20, fontSize: 24, color: "rgba(93,157,122,0.2)" }}>♣</div>
      </>
    ),
  },
  {
    title: "Player Analytics Engine",
    company: "Betsson",
    period: "2020",
    tags: ["Node.js", "MongoDB", "Dashboard", "Real-time"],
    placeholderGradient: "linear-gradient(135deg, #060d0a 0%, #0d2420 100%)",
    shapes: (
      <>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} style={{ position: "absolute", bottom: 20, left: 20 + i * 20, width: 12, height: 20 + Math.sin(i * 0.9) * 40 + 40, background: `rgba(93,157,122,${0.1 + i * 0.03})`, borderRadius: "3px 3px 0 0" }} />
        ))}
        <div style={{ position: "absolute", top: 20, right: 20, width: 60, height: 60, borderRadius: "50%", border: "1px solid rgba(93,157,122,0.25)" }} />
        <div style={{ position: "absolute", top: 35, right: 35, width: 30, height: 30, borderRadius: "50%", background: "rgba(93,157,122,0.12)" }} />
      </>
    ),
  },
];

const ProjectCard = ({ project }: { project: Project }) => (
  <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accentBorder}`, borderRadius: 16, overflow: "hidden" }}>
    <div className="relative" style={{ height: 180, background: project.placeholderGradient }}>
      {project.shapes}
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ color: "rgba(93,157,122,0.3)", fontSize: 10, letterSpacing: "0.25em", fontFamily: "monospace" }}>PROJECT PREVIEW</span>
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

export default function IGaming() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen pt-16" style={{ background: "linear-gradient(160deg, #06100a 0%, #0a1a10 50%, #06100a 100%)" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="pt-16 pb-24 flex flex-col justify-center" style={{ minHeight: "75vh" }}>
          <button onClick={() => navigate("/")} style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 40, display: "flex", alignItems: "center", gap: 6, width: "fit-content", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
            ← Home
          </button>
          <p style={{ color: accent, fontSize: 12, letterSpacing: "0.2em", marginBottom: 16, fontFamily: "monospace" }}>IGAMING</p>
          <h1 style={{ fontSize: "clamp(3rem, 10vw, 7rem)", fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Real-Time<br /><span style={{ color: accent }}>Platforms.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, maxWidth: 540, lineHeight: 1.7 }}>
            Four years building sports betting, poker, and casino platforms at scale — where milliseconds matter and uptime is non-negotiable.
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
