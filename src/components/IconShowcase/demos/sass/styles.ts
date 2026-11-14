export const SASS_COLOR = "var(--color-sass)";

export const CONTROL_LABEL = "text-sm tracking-wider text-muted uppercase";
export const SWATCH = "size-7 rounded-full border-2 bg-(--sass-swatch) transition-transform";
export const SWATCH_ACTIVE = `${SWATCH} scale-120 border-strong`;
export const SWATCH_IDLE = `${SWATCH} border-transparent`;
/** Readable in both themes: the deeper shade on light, the bright shade on dark. */
export const SWATCH_TEXT = "text-(--sass-secondary) dark:text-(--sass-primary)";
export const SLIDER = "w-full accent-(--sass-primary)";

export const PREVIEW_CARD =
  "flex flex-col gap-3 rounded-(--sass-radius) border border-(--sass-primary)/30 bg-card p-5 transition-all duration-300";
export const PREVIEW_TITLE = "font-semibold text-strong text-(length:--sass-font-size)";
export const PREVIEW_SUBTITLE = "text-muted text-(length:--sass-subtitle-size)";
export const PREVIEW_BADGE =
  `rounded-[calc(var(--sass-radius)/2)] bg-(--sass-primary)/20 px-2 py-0.5 text-sm font-medium transition-all duration-300 ${SWATCH_TEXT}`;
export const PREVIEW_BUTTON =
  "rounded-(--sass-radius) bg-linear-135 from-(--sass-primary) to-(--sass-secondary) px-4 py-2 font-semibold text-strong text-(length:--sass-font-size) transition-all duration-300 dark:text-on-inverse";

export const SCSS_PANEL = "overflow-x-auto whitespace-pre p-3 font-mono text-sm leading-5";
export const SCSS_LINE = { variable: "text-sass-text", selector: "text-info", plain: "text-muted" } as const;
