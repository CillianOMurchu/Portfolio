export interface ProjectedIcon {
  name: string;
  x2d: number;
  y2d: number;
  scaledIconSize: number;
  z: number;
}

export interface ItemSphereProps {
  onIconClick?: (name: string) => void;
  visible?: boolean;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface SphereState {
  rx: number;
  rz: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
}
