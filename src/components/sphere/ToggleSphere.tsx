import React from "react";
import { useNeonFlicker } from "../../hooks/useNeonFlicker";

type ToggleSphereProps = {
  toggled: boolean;
  setToggled: (next: boolean) => void;
};

const ToggleSphere: React.FC<ToggleSphereProps> = ({ toggled, setToggled }) => {
  const pillWidth =
    typeof window !== "undefined" && window.innerWidth < 500 ? 44 : 64;
  const pillHeight =
    typeof window !== "undefined" && window.innerWidth < 500 ? 22 : 32;

  const handleToggle = () => {
    setToggled(!toggled);
  };

  const showTitle = useNeonFlicker(2000);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200 && toggled) {
        setToggled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toggled, setToggled]);

  return (
    <div
      className="sphere-toggle absolute right-4 z-[9999] top-[75px]"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <button
        onClick={handleToggle}
        aria-label={toggled ? "Hide Tech Sphere" : "Show Tech Sphere"}
        style={{
          width: pillWidth + "px",
          height: pillHeight + "px",
          borderRadius: pillHeight / 2 + "px",
          border: `2px solid var(--color-accent-primary)`,
          background: toggled
            ? "var(--color-bg-surface)"
            : "var(--color-bg-primary)",
          boxShadow: toggled
            ? `var(--neon-glow-primary)`
            : `0 0 8px 2px var(--color-accent-primary)`,
          display: "flex",
          alignItems: "center",
          position: "relative",
          transition:
            "border 0.3s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1)",
          cursor: "pointer",
          outline: "none",
          padding: "0 8px",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: toggled
              ? `calc(${pillWidth - pillHeight * 0.6 - 8}px)`
              : "4px",
            top: "50%",
            transform: "translateY(-50%)",
            width: pillHeight * 0.6 + "px",
            height: pillHeight * 0.6 + "px",
            borderRadius: "50%",
            background: toggled
              ? "var(--color-accent-primary)"
              : "var(--color-accent-secondary)",
            boxShadow: toggled
              ? `var(--neon-glow-primary)`
              : "var(--neon-glow-secondary)",
            border: `2px solid var(--color-accent-primary)`,
            transition:
              "left 0.3s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </button>
      <span
        style={{
          marginTop: "6px",
          fontSize: "0.75rem",
          fontFamily: "Orbitron, 'Montserrat', 'Segoe UI', sans-serif",
          fontWeight: 700,
          color: "var(--color-accent-primary)",
          textShadow: "var(--neon-glow-primary)",
          letterSpacing: "0.04em",
          filter: "drop-shadow(0 0 4px var(--color-accent-primary))",
          opacity: showTitle ? 1 : 0,
          transition: "opacity 0.18s cubic-bezier(.4,0,.2,1)",
          pointerEvents: "none",
        }}
      >
        core stack
      </span>
    </div>
  );
};

export default ToggleSphere;
