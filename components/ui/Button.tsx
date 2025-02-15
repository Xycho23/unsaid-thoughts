import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ children, className = "", onClick, variant = "primary" }: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-300 text-white";
  const variantStyles =
    variant === "primary"
      ? "bg-[#6d4c41] hover:bg-[#4e342e]"
      : "bg-[#8d6e63] hover:bg-[#6d4c41]";

  return (
    <button onClick={onClick} className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </button>
  );
}
