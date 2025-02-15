import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "note" | "highlighted";
}

export function Card({ children, className = "", variant = "note" }: CardProps) {
  const baseStyles = "flex items-center justify-center shadow-lg rounded-lg p-4 border-2 transition-all";
  
  const variantStyles = {
    default: "bg-white text-black border-gray-300",
    note: "bg-[#d7ccc8] text-[#3e2723] border-[#8d6e63]", // Sticky note effect
    highlighted: "bg-[#ffeb3b] text-black border-[#fbc02d]", // Important note effect
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
