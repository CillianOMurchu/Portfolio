import { useState, type CSSProperties } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import {
  BADGE_COLORS, DEFAULT_LABEL, FALLBACK_LABEL, MAX_LABEL_LENGTH, SIZES, VARIANTS, badgeMarkup, type BadgeColor, type Size,
  type Variant,
} from "./constants";
import {
  BADGE_GLOW, BADGE_ICON, BADGE_SIZE, BADGE_VARIANT, COLOR_SWATCH_OFF, COLOR_SWATCH_ON, CONTROL_LABEL, GLOW_CHECKBOX,
  LABEL_INPUT, MARKUP_PANEL, OPTION_OFF, OPTION_ON, STAGE, STENCIL_COLOR,
} from "./styles";

type CssVariables = CSSProperties & Record<`--${string}`, string>;

interface OptionGroupProps<Option extends string> {
  label: string;
  options: readonly Option[];
  selected: Option;
  select: (option: Option) => void;
}

function OptionGroup<Option extends string>({ label, options, selected, select }: OptionGroupProps<Option>) {
  return (
    <>
      <p className={CONTROL_LABEL}>{label}</p>
      <div className="flex gap-1">
        {options.map(option => (
          <button key={option} type="button" onClick={() => select(option)} className={option === selected ? OPTION_ON : OPTION_OFF}>
            {option}
          </button>
        ))}
      </div>
    </>
  );
}

export default function StencilDemo() {
  const [variant, setVariant] = useState<Variant>("solid");
  const [size, setSize] = useState<Size>("md");
  const [color, setColor] = useState<BadgeColor>("stencil");
  const [hasGlow, setHasGlow] = useState(true);
  const [label, setLabel] = useState(DEFAULT_LABEL);

  const colorToken = BADGE_COLORS.find(option => option.name === color)?.token ?? STENCIL_COLOR;
  const sizeClasses = BADGE_SIZE[size];
  const badgeClass = `${BADGE_VARIANT[variant]} ${sizeClasses.badge} ${hasGlow ? BADGE_GLOW : ""}`;

  return (
    <DemoShell className="gap-5">
      <div className={STAGE}>
        <div className={badgeClass} style={{ "--badge": colorToken } as CssVariables}>
          <div className={`${BADGE_ICON} ${sizeClasses.icon}`} />
          {label || FALLBACK_LABEL}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <OptionGroup label="variant" options={VARIANTS} selected={variant} select={setVariant} />
          <OptionGroup label="size" options={SIZES} selected={size} select={setSize} />
        </div>

        <div className="flex flex-col gap-2">
          <p className={CONTROL_LABEL}>color</p>
          <div className="flex flex-wrap gap-1.5">
            {BADGE_COLORS.map(option => (
              <button
                key={option.name}
                type="button"
                title={option.name}
                aria-label={option.name}
                aria-pressed={option.name === color}
                onClick={() => setColor(option.name)}
                className={option.name === color ? COLOR_SWATCH_ON : COLOR_SWATCH_OFF}
                style={{ "--swatch": option.token } as CssVariables}
              />
            ))}
          </div>
          <label className="mt-2 flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={hasGlow} onChange={(e) => setHasGlow(e.target.checked)} className={GLOW_CHECKBOX} />
            <span className="text-sm text-muted">glow attribute</span>
          </label>
          <label className={`mt-1 flex flex-col gap-2 ${CONTROL_LABEL}`}>
            label
            <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={MAX_LABEL_LENGTH} className={LABEL_INPUT} />
          </label>
        </div>
      </div>

      <CodePanel accent={STENCIL_COLOR} className={MARKUP_PANEL}>
        {badgeMarkup(variant, size, color, hasGlow, label)}
      </CodePanel>
    </DemoShell>
  );
}
