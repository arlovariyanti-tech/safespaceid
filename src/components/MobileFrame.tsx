import { ReactNode } from "react";

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40 flex justify-center">
      <div className="relative w-full max-w-[440px] min-h-screen bg-background shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="px-5 pt-6 pb-4 bg-[image:var(--gradient-soft)] border-b border-border/50">
      <div className="flex items-center gap-3 mb-1">
        {back}
        <h1 className="text-2xl font-bold tracking-tight flex-1">{title}</h1>
        {action}
      </div>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
