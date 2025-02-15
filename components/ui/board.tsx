import React from "react";

interface BoardProps {
  children: React.ReactNode;
  className?: string;
}

export function Board({ children, className = "" }: BoardProps) {
  return (
    <div className={`w-full max-w-6xl bg-[#5d4037] p-6 rounded-lg shadow-2xl border-8 border-[#8d6e63] ${className}`}>
      <h2 className="text-3xl font-bold text-[#d7ccc8] text-center mb-4">Unsaid Thoughts Board</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {children}
      </div>
    </div>
  );
}
