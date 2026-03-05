'use client';

import { formatNumber } from '@/lib/calculate';

interface DisplayProps {
  display: string;
  expression: string;
}

export default function Display({ display, expression }: DisplayProps) {
  const displayLength = display.length;
  const fontSize = displayLength > 15 ? 'text-xl' : displayLength > 10 ? 'text-2xl' : displayLength > 7 ? 'text-3xl' : 'text-4xl';

  const formatted = display === 'Error' ? 'Error' : (() => {
    if (display.includes('.')) {
      const parts = display.split('.');
      return formatNumber(parts[0]) + '.' + parts[1];
    }
    return formatNumber(display);
  })();

  return (
    <div className="display-glow bg-gradient-to-br from-gray-900 to-gray-800 px-5 py-4 min-h-[110px] flex flex-col justify-between border-b border-gray-700/30">
      {/* Expression */}
      <div className="text-gray-500 text-sm text-right min-h-[20px] truncate">
        {expression || '\u00A0'}
      </div>

      {/* Main Display */}
      <div className={`calc-display text-right font-light text-white ${fontSize} transition-all duration-150`}>
        <span className={display === 'Error' ? 'text-red-400' : 'text-white'}>
          {formatted}
        </span>
      </div>
    </div>
  );
}
