export type Tone = "success" | "warning" | "muted" | "react";

export interface ButtonArgs { variant: "primary" | "secondary"; label: string; disabled?: boolean; loading?: boolean }
export interface BadgeArgs { label: string; tone: Tone }
export interface CardArgs { title: string; subtitle: string; tone: Tone }

interface Story<Args> {
  id: string;
  label: string;
  args: Args;
}

export type StoryComponent =
  | { kind: "button"; name: "Button"; stories: Story<ButtonArgs>[] }
  | { kind: "badge"; name: "Badge"; stories: Story<BadgeArgs>[] }
  | { kind: "card"; name: "Card"; stories: Story<CardArgs>[] };

export const COMPONENTS: StoryComponent[] = [
  {
    kind: "button",
    name: "Button",
    stories: [
      { id: "primary", label: "Primary", args: { variant: "primary", label: "View Portfolio", disabled: false } },
      { id: "secondary", label: "Secondary", args: { variant: "secondary", label: "Download CV", disabled: false } },
      { id: "loading", label: "Loading", args: { variant: "primary", label: "Saving…", loading: true } },
      { id: "disabled", label: "Disabled", args: { variant: "primary", label: "Unavailable", disabled: true } },
    ],
  },
  {
    kind: "badge",
    name: "Badge",
    stories: [
      { id: "available", label: "Available", args: { label: "Available for work", tone: "success" } },
      { id: "busy", label: "Busy", args: { label: "Deep in flow state", tone: "warning" } },
      { id: "offline", label: "Offline", args: { label: "Probably sleeping", tone: "muted" } },
    ],
  },
  {
    kind: "card",
    name: "Card",
    stories: [
      { id: "default", label: "Default", args: { title: "Cillian Ó Murchú", subtitle: "Senior Frontend Dev", tone: "success" } },
      { id: "featured", label: "Featured", args: { title: "Portfolio Project", subtitle: "React + TypeScript", tone: "react" } },
    ],
  },
];
