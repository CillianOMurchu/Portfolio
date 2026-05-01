import React from "react";

interface OrbTraceProps {
  isHovered: boolean;
  orbStart: { x: number; y: number };
}

const OrbTrace: React.FC<OrbTraceProps> = ({ isHovered, orbStart }) =>
  isHovered ? (
    <div
      className="orb orb-trace"
      style={{ left: `${orbStart.x}%`, top: `${orbStart.y}%` }}
    />
  ) : null;

export default OrbTrace;
