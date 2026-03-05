'use client';

import { useState } from 'react';

interface CalculationItem {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
  shareId: string | null;
}

interface ShareModalProps {
  calculation: CalculationItem;
  onClose: () => void;
}

export default function ShareModal({ calculation, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(
    calculation.shareId
      ? `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/share/${calculation.shareId}`
      : null
  );
  const [generating, setGenerating] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const snippet = `🧮 Calculator Result\n\n${calculation.expression}\n= ${calculation.result}\n\nCalculated with Calculator App`;

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = snippet;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateLink = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calculationId: calculation.id }),
      });
      const data = await res.json();
      setShareUrl(data.shareUrl);
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="bg-gray-900 rounded-3xl border border-gray-700/50 shadow-2xl w-full max-w-sm"
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(83,52,131,0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/30">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Calculation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Snippet Preview */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Result Snippet</label>
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700/50">
              <div className="text-gray-400 text-sm">🧮 Calculator Result</div>
              <div className="mt-2">
                <div className="text-gray-300 text-sm">{calculation.expression}</div>
                <div className="text-white text-2xl font-light">= {calculation.result}</div>
              </div>
            </div>
            <button
              onClick={handleCopySnippet}
              className={`mt-3 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-purple-700 hover:bg-purple-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>

          {/* Shareable Link */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Shareable Link</label>
            {shareUrl ? (
              <div className="space-y-2">
                <div className="bg-gray-800 rounded-xl px-3 py-2 border border-gray-700/50 text-xs text-gray-300 truncate">
                  {shareUrl}
                </div>
                <button
                  onClick={handleCopyUrl}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    urlCopied
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {urlCopied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerateLink}
                disabled={generating}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Generate Link
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
