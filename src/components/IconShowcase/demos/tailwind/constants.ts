export interface UtilityToggle {
  /** The real classes applied to the preview card — spelled out in full so Tailwind generates them. */
  classes: string;
  isOnByDefault: boolean;
}

export const UTILITIES: UtilityToggle[] = [
  { classes: "rounded-2xl", isOnByDefault: true },
  { classes: "shadow-xl", isOnByDefault: true },
  { classes: "border", isOnByDefault: false },
  { classes: "ring-2 ring-success", isOnByDefault: false },
  { classes: "scale-105", isOnByDefault: false },
  { classes: "backdrop-blur-xs", isOnByDefault: false },
  { classes: "opacity-75", isOnByDefault: false },
  { classes: "rotate-1", isOnByDefault: false },
];

export const DEFAULT_UTILITIES = UTILITIES.filter(utility => utility.isOnByDefault).map(utility => utility.classes);
