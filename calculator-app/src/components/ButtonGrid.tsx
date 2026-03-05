'use client';

import Button from './Button';

interface ButtonGridProps {
  onButtonPress: (value: string) => void;
}

const buttons = [
  { value: 'C', variant: 'special' as const },
  { value: 'CE', variant: 'special' as const },
  { value: '⌫', variant: 'special' as const },
  { value: '÷', variant: 'operator' as const },

  { value: '7', variant: 'default' as const },
  { value: '8', variant: 'default' as const },
  { value: '9', variant: 'default' as const },
  { value: '×', variant: 'operator' as const },

  { value: '4', variant: 'default' as const },
  { value: '5', variant: 'default' as const },
  { value: '6', variant: 'default' as const },
  { value: '-', variant: 'operator' as const },

  { value: '1', variant: 'default' as const },
  { value: '2', variant: 'default' as const },
  { value: '3', variant: 'default' as const },
  { value: '+', variant: 'operator' as const },

  { value: '+/-', variant: 'special' as const },
  { value: '0', variant: 'default' as const },
  { value: '.', variant: 'default' as const },
  { value: '=', variant: 'equals' as const },

  { value: '%', variant: 'special' as const, span: 4 },
];

export default function ButtonGrid({ onButtonPress }: ButtonGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {buttons.map((btn) => (
        <Button
          key={btn.value}
          value={btn.value}
          variant={btn.variant}
          onPress={onButtonPress}
          span={'span' in btn ? btn.span : undefined}
        />
      ))}
    </div>
  );
}
