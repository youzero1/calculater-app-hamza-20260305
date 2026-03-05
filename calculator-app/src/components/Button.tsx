'use client';

import { useState } from 'react';

interface ButtonProps {
  value: string;
  label?: string;
  variant?: 'default' | 'operator' | 'special' | 'equals' | 'zero';
  onPress: (value: string) => void;
  span?: number;
}

const variantStyles = {
  default: 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700/50',
  operator: 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500/50',
  special: 'bg-purple-800 hover:bg-purple-700 text-white border-purple-700/50',
  equals: 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500/50',
  zero: 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700/50 col-span-2',
};

export default function Button({ value, label, variant = 'default', onPress, span }: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 100);
    onPress(value);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${variantStyles[variant]}
        ${span === 2 ? 'col-span-2' : ''}
        rounded-2xl border font-medium text-lg
        flex items-center justify-center
        h-14 w-full
        transition-all duration-75
        select-none cursor-pointer
        ${pressed ? 'scale-95 brightness-75' : 'scale-100 brightness-100'}
        active:scale-95 active:brightness-75
        shadow-lg
      `}
      style={{
        boxShadow: variant === 'operator' || variant === 'equals'
          ? '0 4px 15px rgba(233, 69, 96, 0.3)'
          : variant === 'special'
          ? '0 4px 15px rgba(83, 52, 131, 0.3)'
          : '0 4px 6px rgba(0, 0, 0, 0.3)',
      }}
    >
      {label || value}
    </button>
  );
}
