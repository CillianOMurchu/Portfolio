// Renders its children only for logged-in visitors; everyone else gets the
// password form. Nothing renders while the session check is in flight.
import React from "react";
import { useStreamAuth } from "../../context/StreamAuthContext";
import StreamLogin from "./StreamLogin";

const StreamGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useStreamAuth();
  if (status === "checking") return null;
  return status === "authed" ? <>{children}</> : <StreamLogin />;
};

export default StreamGate;
