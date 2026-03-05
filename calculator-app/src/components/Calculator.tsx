'use client';

import { useState, useCallback, useEffect } from 'react';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import History from './History';
import ShareModal from './ShareModal';
import { evaluateExpression } from '@/lib/calculate';

interface HistoryItem {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
  shareId: string | null;
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [lastOperator, setLastOperator] = useState<string | null>(null);
  const [lastValue, setLastValue] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareCalculation, setShareCalculation] = useState<HistoryItem | null>(null);
  const [justCalculated, setJustCalculated] = useState(false);

  const saveCalculation = useCallback(async (expr: string, result: string) => {
    try {
      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr, result }),
      });
      const data = await response.json();
      return data.calculation;
    } catch (error) {
      console.error('Failed to save calculation:', error);
      return null;
    }
  }, []);

  const handleNumber = useCallback((num: string) => {
    if (justCalculated && !lastOperator) {
      setDisplay(num);
      setExpression(num);
      setJustCalculated(false);
      setShouldResetDisplay(false);
      return;
    }

    if (shouldResetDisplay || display === '0') {
      if (num === '.' && shouldResetDisplay) {
        setDisplay('0.');
        setShouldResetDisplay(false);
        return;
      }
      if (num === '.') {
        setDisplay('0.');
      } else {
        setDisplay(num);
      }
      setShouldResetDisplay(false);
    } else {
      if (num === '.' && display.includes('.')) return;
      const newDisplay = display === '0' && num !== '.' ? num : display + num;
      setDisplay(newDisplay);
    }
  }, [display, shouldResetDisplay, justCalculated, lastOperator]);

  const handleOperator = useCallback(async (operator: string) => {
    setJustCalculated(false);
    const currentValue = display;

    if (expression && !shouldResetDisplay && !justCalculated) {
      // Chain calculation
      const fullExpression = `${expression} ${operator}`;
      const evalExpr = expression;
      const { result } = evaluateExpression(evalExpr);
      if (result !== 'Error') {
        setDisplay(result);
        setExpression(`${result} ${operator}`);
      } else {
        setExpression(fullExpression);
      }
    } else if (justCalculated) {
      setExpression(`${currentValue} ${operator}`);
    } else {
      if (expression.endsWith('+ ') || expression.endsWith('- ') ||
          expression.endsWith('× ') || expression.endsWith('÷ ')) {
        setExpression(expression.slice(0, -2) + ` ${operator}`);
        return;
      }
      setExpression(`${currentValue} ${operator}`);
    }

    setLastOperator(operator);
    setLastValue(currentValue);
    setShouldResetDisplay(true);
    setWaitingForOperand(false);
  }, [display, expression, shouldResetDisplay, justCalculated]);

  const handleEquals = useCallback(async () => {
    if (!expression) return;

    let fullExpression: string;
    if (shouldResetDisplay && lastOperator) {
      fullExpression = expression + ' ' + display;
    } else if (justCalculated && lastOperator && lastValue) {
      fullExpression = `${display} ${lastOperator} ${lastValue}`;
    } else {
      fullExpression = expression + ' ' + display;
    }

    const { result, error } = evaluateExpression(fullExpression);

    setDisplay(result);
    setExpression('');
    setLastOperator(null);
    setWaitingForOperand(false);
    setShouldResetDisplay(false);
    setJustCalculated(true);

    if (!error) {
      await saveCalculation(fullExpression, result);
    }
  }, [expression, display, shouldResetDisplay, lastOperator, lastValue, justCalculated, saveCalculation]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setLastOperator(null);
    setLastValue(null);
    setWaitingForOperand(false);
    setShouldResetDisplay(false);
    setJustCalculated(false);
  }, []);

  const handleClearEntry = useCallback(() => {
    setDisplay('0');
    setShouldResetDisplay(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (justCalculated) {
      handleClear();
      return;
    }
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display, justCalculated, handleClear]);

  const handleToggleSign = useCallback(() => {
    if (display === '0') return;
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  }, [display]);

  const handlePercent = useCallback(() => {
    const value = parseFloat(display);
    if (!isNaN(value)) {
      const result = (value / 100).toString();
      setDisplay(result);
    }
  }, [display]);

  const handleButtonPress = useCallback(async (value: string) => {
    switch (value) {
      case 'C':
        handleClear();
        break;
      case 'CE':
        handleClearEntry();
        break;
      case '⌫':
        handleBackspace();
        break;
      case '+/-':
        handleToggleSign();
        break;
      case '%':
        handlePercent();
        break;
      case '=':
        await handleEquals();
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
        await handleOperator(value);
        break;
      default:
        handleNumber(value);
    }
  }, [handleClear, handleClearEntry, handleBackspace, handleToggleSign, handlePercent, handleEquals, handleOperator, handleNumber]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setDisplay(item.result);
    setExpression('');
    setJustCalculated(true);
    setShouldResetDisplay(false);
    setHistoryOpen(false);
  }, []);

  const handleShare = useCallback((item: HistoryItem) => {
    setShareCalculation(item);
    setShareModalOpen(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shareModalOpen || historyOpen) return;
      const key = e.key;
      if (key >= '0' && key <= '9') handleButtonPress(key);
      else if (key === '.') handleButtonPress('.');
      else if (key === '+') handleButtonPress('+');
      else if (key === '-') handleButtonPress('-');
      else if (key === '*') handleButtonPress('×');
      else if (key === '/') { e.preventDefault(); handleButtonPress('÷'); }
      else if (key === 'Enter' || key === '=') handleButtonPress('=');
      else if (key === 'Backspace') handleButtonPress('⌫');
      else if (key === 'Escape') handleButtonPress('C');
      else if (key === '%') handleButtonPress('%');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButtonPress, shareModalOpen, historyOpen]);

  return (
    <div className="relative flex items-start gap-4">
      {/* Calculator */}
      <div className="relative z-10 w-80 bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50" style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(233,69,96,0.1)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-900/80 border-b border-gray-700/30">
          <h1 className="text-gray-400 text-sm font-medium tracking-wider uppercase">Calculator</h1>
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
            title="Toggle History"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Display */}
        <Display
          display={display}
          expression={expression}
        />

        {/* Buttons */}
        <ButtonGrid onButtonPress={handleButtonPress} />
      </div>

      {/* History Panel */}
      <History
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleHistorySelect}
        onShare={handleShare}
      />

      {/* Share Modal */}
      {shareModalOpen && shareCalculation && (
        <ShareModal
          calculation={shareCalculation}
          onClose={() => {
            setShareModalOpen(false);
            setShareCalculation(null);
          }}
        />
      )}
    </div>
  );
}
