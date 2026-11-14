import { useState } from "react";
import DemoShell from "../components/DemoShell";
import { COMPONENTS } from "./constants";
import StoryPreview from "./StoryPreview";
import {
  ARGS_PANEL, ARG_NAME, ARG_VALUE_TONE, CANVAS, COMPONENT_CLOSED, COMPONENT_OPEN, SIDEBAR, SIDEBAR_TITLE, STORY_ACTIVE,
  STORY_IDLE, WORKSPACE, WORKSPACE_GRID,
} from "./styles";

function argValueTone(value: unknown) {
  if (typeof value === "boolean") return ARG_VALUE_TONE.boolean;
  return typeof value === "string" ? ARG_VALUE_TONE.string : ARG_VALUE_TONE.other;
}

interface StoryTreeProps {
  componentIndex: number;
  storyIndex: number;
  openComponent: (index: number) => void;
  openStory: (index: number) => void;
}

function StoryTree({ componentIndex, storyIndex, openComponent, openStory }: StoryTreeProps) {
  return (
    <div className={SIDEBAR}>
      <div className={SIDEBAR_TITLE}>Stories</div>
      {COMPONENTS.map((component, index) => {
        const isOpen = index === componentIndex;
        return (
          <div key={component.name}>
            <button type="button" onClick={() => openComponent(index)} className={isOpen ? COMPONENT_OPEN : COMPONENT_CLOSED}>
              {isOpen ? "▾" : "▸"} {component.name}
            </button>
            {isOpen && component.stories.map((story, index) => (
              <button key={story.id} type="button" onClick={() => openStory(index)} className={index === storyIndex ? STORY_ACTIVE : STORY_IDLE}>
                {story.label}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function StorybookDemo() {
  const [componentIndex, setComponentIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);

  const component = COMPONENTS[componentIndex];
  const args = Object.entries(component.stories[storyIndex].args);

  const openComponent = (index: number) => {
    setComponentIndex(index);
    setStoryIndex(0);
  };

  return (
    <DemoShell>
      <div className={WORKSPACE}>
        <div className={WORKSPACE_GRID}>
          <StoryTree componentIndex={componentIndex} storyIndex={storyIndex} openComponent={openComponent} openStory={setStoryIndex} />
          <div className="flex flex-col">
            <div className={CANVAS}>
              <StoryPreview component={component} storyIndex={storyIndex} />
            </div>
            <div className={ARGS_PANEL}>
              <p className="mb-1 text-muted">Args</p>
              {args.map(([name, value]) => (
                <div key={name} className="flex gap-2">
                  <span className={ARG_NAME}>{name}</span>
                  <span className="text-muted">:</span>
                  <span className={argValueTone(value)}>{JSON.stringify(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
