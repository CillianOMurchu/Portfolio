import React from "react";
import { useNeonFlicker } from "../../hooks/useNeonFlicker";
import { useOrbOrigin } from "../../context/OrbOriginContext";

const PILL_WIDTH = 64;
const PILL_HEIGHT = 32;
const PILL_WIDTH_SM = 44;
const PILL_HEIGHT_SM = 22;

const ToggleSphere: React.FC = () => {
  const { showSphere, setShowSphere } = useOrbOrigin();
  const showTitle = useNeonFlicker(2000);

  const isSm = typeof window !== "undefined" && window.innerWidth < 500;
  const pillWidth = isSm ? PILL_WIDTH_SM : PILL_WIDTH;
  const pillHeight = isSm ? PILL_HEIGHT_SM : PILL_HEIGHT;

  return (
    <div className="sphere-toggle-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <button
        className="sphere-toggle-button"
        onClick={() => setShowSphere(!showSphere)}
        aria-label={showSphere ? "Hide Tech Sphere" : "Show Tech Sphere"}
        style={{
          width: pillWidth,
          height: pillHeight,
          borderRadius: pillHeight / 2,
          border: `2px solid var(--color-accent-primary)`,
          background: showSphere ? "var(--color-bg-primary)" : "var(--color-bg-surface)",
          boxShadow: showSphere ? `0 0 8px 2px var(--color-accent-primary)` : `var(--neon-glow-primary)`,
          display: "flex",
          alignItems: "center",
          position: "relative",
          transition: "border 0.3s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1)",
          cursor: "pointer",
          outline: "none",
          padding: "0 8px",
          overflow: "hidden",
        }}
      >
        <span
          className="sphere-toggle-knob"
          style={{
            position: "absolute",
            left: showSphere ? `calc(${pillWidth - pillHeight * 0.6 - 8}px)` : "4px",
            top: "50%",
            transform: "translateY(-50%)",
            width: pillHeight * 0.6,
            height: pillHeight * 0.6,
            borderRadius: "50%",
            background: showSphere ? "var(--color-accent-primary)" : "var(--color-accent-secondary)",
            boxShadow: showSphere ? `var(--neon-glow-primary)` : "var(--neon-glow-secondary)",
            border: `2px solid var(--color-accent-primary)`,
            transition: "left 0.3s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </button>
      <span
        className="sphere-toggle-label"
        style={{
          marginTop: "4px",
          fontSize: "0.65rem",
          fontFamily: "Orbitron, 'Montserrat', 'Segoe UI', sans-serif",
          fontWeight: 700,
          color: "var(--color-accent-primary)",
          letterSpacing: "0.04em",
          opacity: showTitle ? 1 : 0,
          transition: "opacity 0.18s cubic-bezier(.4,0,.2,1)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        core stack
      </span>
    </div>
  );
};

export default ToggleSphere;
