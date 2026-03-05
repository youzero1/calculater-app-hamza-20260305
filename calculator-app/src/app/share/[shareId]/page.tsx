import { Metadata } from 'next';
import Link from 'next/link';

interface SharedCalcPageProps {
  params: { shareId: string };
}

async function getSharedCalculation(shareId: string) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/share?shareId=${shareId}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.calculation;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: SharedCalcPageProps): Promise<Metadata> {
  const calc = await getSharedCalculation(params.shareId);
  if (!calc) {
    return { title: 'Shared Calculation - Not Found' };
  }
  return {
    title: `${calc.expression} = ${calc.result} | Calculator App`,
    description: `Check out this calculation: ${calc.expression} = ${calc.result}`,
  };
}

export default async function SharedCalcPage({ params }: SharedCalcPageProps) {
  const calc = await getSharedCalculation(params.shareId);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div
          className="bg-gray-900 rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
        >
          <div className="px-6 py-5 border-b border-gray-700/30">
            <h1 className="text-white font-semibold text-lg flex items-center gap-2">
              <span>🧮</span> Shared Calculation
            </h1>
          </div>

          {calc ? (
            <div className="p-6 space-y-4">
              <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700/50">
                <div className="text-gray-400 text-sm mb-1">Expression</div>
                <div className="text-white text-xl font-light">{calc.expression}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/50 to-rose-900/50 rounded-2xl p-5 border border-purple-700/30">
                <div className="text-gray-400 text-sm mb-1">Result</div>
                <div className="text-white text-4xl font-light">= {calc.result}</div>
              </div>
              <div className="text-gray-600 text-xs text-center">
                Calculated on {new Date(calc.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="text-gray-400 text-lg mb-2">Calculation not found</div>
              <p className="text-gray-600 text-sm">This shared calculation may have been deleted.</p>
            </div>
          )}

          <div className="px-6 py-4 border-t border-gray-700/30">
            <Link
              href="/"
              className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-2xl font-medium transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Open Calculator
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
