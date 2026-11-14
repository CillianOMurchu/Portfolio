import { OPERATORS, type OperatorId } from "./constants";
import { ACTIVE_OPERATOR, ACTIVE_OPERATOR_DOT, ACTIVE_OPERATOR_LIST } from "./styles";

interface ActiveOperatorsProps {
  activeOps: ReadonlySet<OperatorId>;
}

export default function ActiveOperators({ activeOps }: ActiveOperatorsProps) {
  const activeOperators = OPERATORS.filter(op => activeOps.has(op.id));
  if (activeOperators.length === 0) return null;

  return (
    <div className={ACTIVE_OPERATOR_LIST}>
      {activeOperators.map(op => (
        <div key={op.id} className={ACTIVE_OPERATOR}>
          <span className={ACTIVE_OPERATOR_DOT} />
          <span className="font-mono">.pipe({op.label})</span>
        </div>
      ))}
    </div>
  );
}
