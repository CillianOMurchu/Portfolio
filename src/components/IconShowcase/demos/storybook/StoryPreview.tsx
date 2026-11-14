import type { BadgeArgs, ButtonArgs, CardArgs, StoryComponent } from "./constants";
import { BADGE, BADGE_TONE, BUTTON_VARIANT, CARD, CARD_TONE } from "./styles";

function ButtonPreview({ args }: { args: ButtonArgs }) {
  const isDisabled = Boolean(args.disabled || args.loading);
  return <button type="button" disabled={isDisabled} className={BUTTON_VARIANT[args.variant]}>{args.label}</button>;
}

function BadgePreview({ args }: { args: BadgeArgs }) {
  return <span className={`${BADGE} ${BADGE_TONE[args.tone]}`}>{args.label}</span>;
}

function CardPreview({ args }: { args: CardArgs }) {
  const tone = CARD_TONE[args.tone];
  return (
    <div className={`${CARD} ${tone.border}`}>
      <p className="text-sm font-semibold text-strong">{args.title}</p>
      <p className={`mt-1 text-sm ${tone.text}`}>{args.subtitle}</p>
    </div>
  );
}

interface StoryPreviewProps {
  component: StoryComponent;
  storyIndex: number;
}

export default function StoryPreview({ component, storyIndex }: StoryPreviewProps) {
  switch (component.kind) {
    case "button":
      return <ButtonPreview args={component.stories[storyIndex].args} />;
    case "badge":
      return <BadgePreview args={component.stories[storyIndex].args} />;
    case "card":
      return <CardPreview args={component.stories[storyIndex].args} />;
  }
}
