import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button = ({ children, onClick, className = "" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};
