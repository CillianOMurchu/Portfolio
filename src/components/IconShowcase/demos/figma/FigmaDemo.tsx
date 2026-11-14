import { useState, type CSSProperties, type ReactNode } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { ELEMENTS, cssExport, type DesignElement } from "./constants";
import {
  CANVAS, ELEMENT_IDLE, ELEMENT_LOOK, ELEMENT_SELECTED, EXPORT_PANEL, EXPORT_PROPERTY, EXPORT_VALUE, FIGMA_COLOR,
  FILL_SWATCH, INSPECTOR, INSPECTOR_TITLE, INSPECTOR_TYPE, INSPECTOR_VALUE,
} from "./styles";

function InspectorRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="text-muted">{label}</span>
      <br />
      {children}
    </div>
  );
}

function Inspector({ element }: { element: DesignElement }) {
  return (
    <div className={INSPECTOR}>
      <div className={INSPECTOR_TITLE}>Inspect</div>
      <div className="space-y-2 p-2 font-mono text-sm">
        <InspectorRow label="Type"><span className={INSPECTOR_TYPE}>{element.type}</span></InspectorRow>
        <InspectorRow label="Fill">
          <span className="flex items-center gap-1">
            <span className={FILL_SWATCH} style={{ "--fill": element.fill } as CSSProperties} />
            <span className={`${INSPECTOR_VALUE} truncate`}>{element.fill}</span>
          </span>
        </InspectorRow>
        <InspectorRow label="Corner"><span className={INSPECTOR_VALUE}>{element.radius}px</span></InspectorRow>
        <InspectorRow label="Padding"><span className={INSPECTOR_VALUE}>{element.paddingY} {element.paddingX}</span></InspectorRow>
      </div>
    </div>
  );
}

export default function FigmaDemo() {
  const [selected, setSelected] = useState(ELEMENTS[0]);

  return (
    <DemoShell>
      <div className="grid grid-cols-[1fr_160px] gap-3">
        <div className={CANVAS}>
          <p className="text-sm text-muted">Canvas</p>
          <div className="flex flex-wrap items-center gap-3">
            {ELEMENTS.map(element => {
              const selection = element.id === selected.id ? ELEMENT_SELECTED : ELEMENT_IDLE;
              return (
                <button key={element.id} type="button" onClick={() => setSelected(element)} className={`${selection} ${ELEMENT_LOOK[element.id]}`}>
                  {element.label}
                </button>
              );
            })}
          </div>
        </div>
        <Inspector element={selected} />
      </div>

      <CodePanel accent={FIGMA_COLOR} className={EXPORT_PANEL}>
        <p className="mb-1 text-muted">{"/* CSS export */"}</p>
        {cssExport(selected).map(([property, value]) => (
          <div key={property}>
            <span className={EXPORT_PROPERTY}>{property}</span>
            <span className="text-muted">: </span>
            <span className={EXPORT_VALUE}>{value}</span>
          </div>
        ))}
      </CodePanel>
    </DemoShell>
  );
}
