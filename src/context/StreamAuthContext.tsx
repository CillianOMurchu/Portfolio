// Whether this visitor has unlocked the Streaming page. Checked once on load
// against the server; the session itself is an HttpOnly cookie.
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { checkSession, login as requestLogin } from "../services/streamAuth";

export type StreamAuthStatus = "checking" | "authed" | "anon";

interface StreamAuthValue {
  status: StreamAuthStatus;
  login: (password: string) => Promise<boolean>;
}

const StreamAuthContext = createContext<StreamAuthValue | null>(null);

export const StreamAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<StreamAuthStatus>("checking");

  useEffect(() => {
    let active = true;
    checkSession().then((ok) => active && setStatus(ok ? "authed" : "anon"));
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (password: string) => {
    const ok = await requestLogin(password);
    if (ok) setStatus("authed");
    return ok;
  }, []);

  return <StreamAuthContext.Provider value={{ status, login }}>{children}</StreamAuthContext.Provider>;
};

// Provider + hook share a file by convention; fast refresh just reloads this module.
// eslint-disable-next-line react-refresh/only-export-components
export function useStreamAuth(): StreamAuthValue {
  const ctx = useContext(StreamAuthContext);
  if (!ctx) throw new Error("useStreamAuth must be used within a StreamAuthProvider");
  return ctx;
}
