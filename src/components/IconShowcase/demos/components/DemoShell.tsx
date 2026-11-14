import type { ReactNode } from "react";

interface DemoShellProps {
  children: ReactNode;
  className?: string;
}

export default function DemoShell({ children, className = "" }: DemoShellProps) {
  return (
    <div className={`mx-auto flex w-full max-w-2xl flex-col gap-4 ${className}`.trim()}>
      {children}
    </div>
  );
}
