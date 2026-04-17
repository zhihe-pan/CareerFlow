import { cn } from "@/lib/utils";

interface FilterTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export const FilterTab = ({ label, active, onClick, className }: FilterTabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 px-3 rounded-md text-[13px] font-medium transition-all duration-300 shrink-0 whitespace-nowrap",
        active
          ? "bg-primary text-primary-foreground shadow-glow border border-transparent"
          : "glass bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10",
        className
      )}
    >
      {label}
    </button>
  );
};
