import { useEffect, useRef, useState } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { COMPONENT_TREE, COUNTER_RENDER_PATH, FLASH_DURATION_MS, LIST_RENDER_PATH, type ComponentNode } from "./constants";
import { NODE_DEPTH, NODE_FLASHING, NODE_IDLE, NODE_LABEL, REACT_COLOR, RERENDER_BADGE, STATE_BUTTON, TREE_PANEL } from "./styles";

function TreeNode({ node, isFlashing }: { node: ComponentNode; isFlashing: boolean }) {
  const rowClass = isFlashing ? NODE_FLASHING : NODE_IDLE;
  const labelClass = node.isMemoized ? NODE_LABEL.memoized : NODE_LABEL.rendering;
  const closing = node.hasChildren ? ">" : " />";

  return (
    <div className={`${rowClass} ${NODE_DEPTH[node.depth]}`}>
      <span className={labelClass}>{"<"}{node.label}{closing}</span>
      {isFlashing && <span className={RERENDER_BADGE}>re-render</span>}
    </div>
  );
}

export default function ReactDemo() {
  const [count, setCount] = useState(0);
  const [, setItemCount] = useState(2);
  const [flashingIds, setFlashingIds] = useState<ReadonlySet<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flashRenderPath = (ids: string[]) => {
    clearTimeout(timer.current);
    setFlashingIds(new Set(ids));
    timer.current = setTimeout(() => setFlashingIds(new Set()), FLASH_DURATION_MS);
  };

  const incrementCount = () => {
    setCount(current => current + 1);
    flashRenderPath(COUNTER_RENDER_PATH);
  };

  const addItem = () => {
    setItemCount(current => current + 1);
    flashRenderPath(LIST_RENDER_PATH);
  };

  return (
    <DemoShell className="gap-5">
      <p className="text-center text-sm text-muted">Watch which components re-render when state changes</p>

      <CodePanel accent={REACT_COLOR} className={TREE_PANEL}>
        {COMPONENT_TREE.map(node => <TreeNode key={node.id} node={node} isFlashing={flashingIds.has(node.id)} />)}
      </CodePanel>

      <div className="flex gap-3">
        <button type="button" onClick={incrementCount} className={STATE_BUTTON}>setCount({count} → {count + 1})</button>
        <button type="button" onClick={addItem} className={STATE_BUTTON}>setItems([...items])</button>
      </div>

      <p className="text-center text-sm text-muted">Header is memoized — it never re-renders even when parent state changes</p>
    </DemoShell>
  );
}
