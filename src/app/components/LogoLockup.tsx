import recallMark from "../../assets/recall-mark.svg";

type LogoSize = "sm" | "md" | "lg";

const sizeStyles: Record<LogoSize, { icon: string; text: string }> = {
  sm: { icon: "h-8", text: "text-xl" },
  md: { icon: "h-10", text: "text-2xl" },
  lg: { icon: "h-12", text: "text-3xl" },
};

interface LogoLockupProps {
  size?: LogoSize;
}

export function LogoLockup({ size = "md" }: LogoLockupProps) {
  const { icon, text } = sizeStyles[size];

  return (
    <div className="flex items-center gap-2 select-none" aria-label="Recall logo">
      <img
        src={recallMark}
        alt="Recall mark"
        className={`${icon} w-auto object-contain`}
        draggable={false}
      />
      <span className={`${text} font-semibold tracking-tight text-[#2D4B9E]`}>
        Recall
      </span>
    </div>
  );
}
