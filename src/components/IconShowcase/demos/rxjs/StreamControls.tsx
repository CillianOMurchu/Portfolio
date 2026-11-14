import DemoButton from "../components/DemoButton";
import { CONTROL_BUTTON } from "./styles";

const RXJS_COLOR = "var(--color-rxjs)";

interface StreamControlsProps {
  isLive: boolean;
  toggleLive: () => void;
  emit: () => void;
  resetDemo: () => void;
}

export default function StreamControls({ isLive, toggleLive, emit, resetDemo }: StreamControlsProps) {
  const liveLabel = isLive ? "⏹ unsubscribe()" : "▶ subscribe()";
  const liveColor = isLive ? RXJS_COLOR : undefined;

  return (
    <div className="flex gap-2">
      <DemoButton color={liveColor} onClick={toggleLive} className={`flex-1 ${CONTROL_BUTTON}`}>
        {liveLabel}
      </DemoButton>
      <DemoButton onClick={emit} className={`px-4 ${CONTROL_BUTTON}`}>emit</DemoButton>
      <DemoButton onClick={resetDemo} className={`px-4 ${CONTROL_BUTTON}`} aria-label="Reset streams">↺</DemoButton>
    </div>
  );
}
