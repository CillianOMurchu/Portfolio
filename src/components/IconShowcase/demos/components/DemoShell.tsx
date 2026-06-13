import type { ReactNode } from "react";

interface DemoShellProps {
  children: ReactNode;
  className?: string;
}

export default function DemoShell({ children, className = "" }: DemoShellProps) {
  return (
    <div className={`flex flex-col gap-4 w-full max-w-lg mx-auto ${className}`.trim()}>
      {children}
    </div>
  );
}
