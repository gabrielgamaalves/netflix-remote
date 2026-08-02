import { twMerge } from "tailwind-merge";

export function FunctionButtonControl({ icon: Icon, sizeIcon, className }) {
  return (
    <button
      className={twMerge(
        "p-2 size-14 flex-center bg-btn-bg rounded-full hover:bg-hover-bg",
        className,
      )}
    >
      <Icon size={sizeIcon || 21} />
    </button>
  );
}
