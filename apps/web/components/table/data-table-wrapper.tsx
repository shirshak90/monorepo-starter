import { cn } from "@workspace/ui/lib/utils";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export function DataTableWrapper({ children, className }: Props) {
  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
    >
      {children}
    </div>
  );
}
