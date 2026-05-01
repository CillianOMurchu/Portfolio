import  {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type OrbOrigin = { x: number; y: number } | null;
export type OCharPosition = { x: number; y: number } | null;

interface OrbOriginContextType {
  orbOrigin: OrbOrigin;
  setOrbOrigin: (pos: OrbOrigin) => void;
  oCharPosition: OCharPosition;
  setOCharPosition: (pos: OCharPosition) => void;
}

const OrbOriginContext = createContext<OrbOriginContextType | undefined>(
  undefined
);

export function OrbOriginProvider({ children }: { children: ReactNode }) {
  const [orbOrigin, setOrbOrigin] = useState<OrbOrigin>(null);
  const [oCharPosition, setOCharPosition] = useState<OCharPosition>(null);
  return (
    <OrbOriginContext.Provider value={{ orbOrigin, setOrbOrigin, oCharPosition, setOCharPosition }}>
      {children}
    </OrbOriginContext.Provider>
  );
}

export function useOrbOrigin() {
  const ctx = useContext(OrbOriginContext);
  if (!ctx)
    throw new Error("useOrbOrigin must be used within an OrbOriginProvider");
  return ctx;
}
