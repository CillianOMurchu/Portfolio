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
    <div className="flex flex-col items-center">
      <button
        onClick={() => setShowSphere(!showSphere)}
        aria-label={showSphere ? "Hide Tech Sphere" : "Show Tech Sphere"}
        style={{
          width: pillWidth,
          height: pillHeight,
          borderRadius: pillHeight / 2,
          border: "2px solid var(--primary)",
          background: showSphere ? "var(--background)" : "var(--secondary)",
          boxShadow: showSphere ? "0 0 8px 2px var(--primary)" : "var(--glow-primary)",
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
          style={{
            position: "absolute",
            left: showSphere ? `calc(${pillWidth - pillHeight * 0.6 - 8}px)` : "4px",
            top: "50%",
            transform: "translateY(-50%)",
            width: pillHeight * 0.6,
            height: pillHeight * 0.6,
            borderRadius: "50%",
            background: showSphere ? "var(--primary)" : "var(--accent-secondary)",
            boxShadow: showSphere ? "var(--glow-primary)" : "var(--glow-secondary)",
            border: "2px solid var(--primary)",
            pointerEvents: "none",
            transition: "left 0.3s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </button>
      <span
        className="mt-1 text-xs font-bold tracking-wide text-primary"
        style={{
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
