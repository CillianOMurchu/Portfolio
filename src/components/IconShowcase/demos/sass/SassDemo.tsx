import { useState, type CSSProperties } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { FONT_SIZE_RANGE, RADIUS_RANGE, SUBTITLE_SIZE_OFFSET, SWATCHES, scssSource } from "./constants";
import {
  CONTROL_LABEL, PREVIEW_BADGE, PREVIEW_BUTTON, PREVIEW_CARD, PREVIEW_SUBTITLE, PREVIEW_TITLE, SASS_COLOR, SCSS_LINE,
  SCSS_PANEL, SLIDER, SWATCH_ACTIVE, SWATCH_IDLE, SWATCH_TEXT,
} from "./styles";

type SassVariables = CSSProperties & Record<`--${string}`, string>;

function scssLineTone(line: string) {
  if (line.includes("$")) return SCSS_LINE.variable;
  return line.startsWith(".") ? SCSS_LINE.selector : SCSS_LINE.plain;
}

function PreviewCard() {
  return (
    <div className={PREVIEW_CARD}>
      <div className="flex items-center justify-between">
        <p className={PREVIEW_TITLE}>Cillian Ó Murchú</p>
        <span className={PREVIEW_BADGE}>Available</span>
      </div>
      <p className={PREVIEW_SUBTITLE}>Senior Frontend Developer</p>
      <button type="button" className={PREVIEW_BUTTON}>View Portfolio</button>
    </div>
  );
}

export default function SassDemo() {
  const [swatchIndex, setSwatchIndex] = useState(0);
  const [radius, setRadius] = useState(RADIUS_RANGE.initial);
  const [fontSize, setFontSize] = useState(FONT_SIZE_RANGE.initial);

  const swatch = SWATCHES[swatchIndex];
  const sassVariables: SassVariables = {
    "--sass-primary": swatch.primary,
    "--sass-secondary": swatch.secondary,
    "--sass-radius": `${radius}px`,
    "--sass-font-size": `${fontSize}px`,
    "--sass-subtitle-size": `${fontSize - SUBTITLE_SIZE_OFFSET}px`,
  };

  return (
    <DemoShell className="gap-5" >
      <p className="text-center text-sm text-muted">Edit Sass variables and watch the cascade</p>

      <div className="flex flex-col gap-5" style={sassVariables}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <p className={CONTROL_LABEL}>$primary preset</p>
            <div className="flex flex-wrap gap-2">
              {SWATCHES.map((option, index) => (
                <button
                  key={option.name}
                  type="button"
                  title={option.name}
                  aria-label={option.name}
                  aria-pressed={index === swatchIndex}
                  onClick={() => setSwatchIndex(index)}
                  className={index === swatchIndex ? SWATCH_ACTIVE : SWATCH_IDLE}
                  style={{ "--sass-swatch": option.primary } as SassVariables}
                />
              ))}
            </div>
            <p className={`font-mono text-sm ${SWATCH_TEXT}`}>{swatch.primary}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className={CONTROL_LABEL}>
              $radius: {radius}px
              <input type="range" {...RADIUS_RANGE} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className={SLIDER} />
            </label>
            <label className={CONTROL_LABEL}>
              $font-size: {fontSize}px
              <input type="range" {...FONT_SIZE_RANGE} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className={SLIDER} />
            </label>
          </div>
        </div>

        <PreviewCard />
      </div>

      <CodePanel accent={SASS_COLOR} className={SCSS_PANEL}>
        {scssSource(swatch, radius, fontSize).split("\n").map((line, index) => (
          <div key={index} className={scssLineTone(line)}>{line}</div>
        ))}
      </CodePanel>
    </DemoShell>
  );
}
