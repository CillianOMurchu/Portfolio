import  {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type OrbOrigin = { x: number; y: number } | null;
export type OCharPosition = { x: number; y: number } | null;
export type HoveredIcon = { x: number; y: number; name: string } | null;
export type ClickedIcon = { name: string; screenX: number; screenY: number; svgUrl: string } | null;

interface OrbOriginContextType {
  orbOrigin: OrbOrigin;
  setOrbOrigin: (pos: OrbOrigin) => void;
  oCharPosition: OCharPosition;
  setOCharPosition: (pos: OCharPosition) => void;
  hoveredIcon: HoveredIcon;
  setHoveredIcon: (icon: HoveredIcon) => void;
  clickedIcon: ClickedIcon;
  setClickedIcon: (icon: ClickedIcon) => void;
  showSphere: boolean;
  setShowSphere: (show: boolean) => void;
}

const OrbOriginContext = createContext<OrbOriginContextType | undefined>(
  undefined
);

export function OrbOriginProvider({ children }: { children: ReactNode }) {
  const [orbOrigin, setOrbOrigin] = useState<OrbOrigin>(null);
  const [oCharPosition, setOCharPosition] = useState<OCharPosition>(null);
  const [hoveredIcon, setHoveredIcon] = useState<HoveredIcon>(null);
  const [clickedIcon, setClickedIcon] = useState<ClickedIcon>(null);
  const [showSphere, setShowSphere] = useState(true);
  return (
    <OrbOriginContext.Provider value={{ orbOrigin, setOrbOrigin, oCharPosition, setOCharPosition, hoveredIcon, setHoveredIcon, clickedIcon, setClickedIcon, showSphere, setShowSphere }}>
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
