export interface CalculationResult {
  expression: string;
  result: string;
  error?: string;
}

export function evaluateExpression(expression: string): CalculationResult {
  try {
    // Replace display symbols with JS operators
    let jsExpression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Check for division by zero
    if (/\/\s*0(?![.\d])/.test(jsExpression)) {
      return {
        expression,
        result: 'Error',
        error: 'Division by zero',
      };
    }

    // Validate expression - only allow numbers and operators
    if (!/^[0-9+\-*/.()%\s]+$/.test(jsExpression)) {
      return {
        expression,
        result: 'Error',
        error: 'Invalid expression',
      };
    }

    // eslint-disable-next-line no-eval
    const result = Function('"use strict"; return (' + jsExpression + ')')();

    if (!isFinite(result)) {
      return {
        expression,
        result: 'Error',
        error: 'Result is not finite',
      };
    }

    // Format result to avoid floating point issues
    const formattedResult = parseFloat(result.toPrecision(12)).toString();

    return {
      expression,
      result: formattedResult,
    };
  } catch {
    return {
      expression,
      result: 'Error',
      error: 'Invalid expression',
    };
  }
}

export function formatNumber(num: string): string {
  if (num === 'Error' || num === 'Infinity' || num === '-Infinity') {
    return num;
  }

  const parts = num.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
