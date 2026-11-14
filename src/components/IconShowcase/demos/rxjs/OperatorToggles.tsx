import { OPERATORS, type OperatorId } from "./constants";
import { OPERATOR_TOGGLE, OPERATOR_TOGGLE_OFF, OPERATOR_TOGGLE_ON } from "./styles";

interface OperatorTogglesProps {
  activeOps: ReadonlySet<OperatorId>;
  toggleOperator: (id: OperatorId) => void;
}

export default function OperatorToggles({ activeOps, toggleOperator }: OperatorTogglesProps) {
  return (
    <div className="flex flex-col gap-2">
      {OPERATORS.map(op => {
        const isActive = activeOps.has(op.id);
        const stateClass = isActive ? OPERATOR_TOGGLE_ON : OPERATOR_TOGGLE_OFF;
        return (
          <button
            key={op.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => toggleOperator(op.id)}
            className={`${OPERATOR_TOGGLE} ${stateClass}`}
          >
            {isActive ? "✓ " : "  "}.pipe({op.label})
          </button>
        );
      })}
    </div>
  );
}
