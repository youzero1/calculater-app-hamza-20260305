'use client';

import { useState, useEffect, useCallback } from 'react';

interface HistoryItem {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
  shareId: string | null;
}

interface HistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onShare: (item: HistoryItem) => void;
}

export default function History({ isOpen, onClose, onSelect, onShare }: HistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const url = search
        ? `/api/calculations?search=${encodeURIComponent(search)}`
        : '/api/calculations';
      const res = await fetch(url);
      const data = await res.json();
      setHistory(data.calculations || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/calculations/${id}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete calculation:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`
        w-80 bg-gray-900 rounded-3xl border border-gray-700/50 shadow-2xl
        flex flex-col overflow-hidden
        animate-slide-in
        max-h-[600px]
        relative z-30 lg:z-10
        fixed lg:static right-4 top-1/2 lg:top-auto
        lg:translate-y-0 -translate-y-1/2
      `}
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/30">
          <h2 className="text-white font-semibold">History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-700/30">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search calculations..."
              className="w-full bg-gray-800 text-white text-sm pl-9 pr-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 placeholder-gray-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">No calculations yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-700/30">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-3 hover:bg-gray-800/50 transition-colors group"
                >
                  <button
                    className="w-full text-left"
                    onClick={() => onSelect(item)}
                  >
                    <div className="text-gray-400 text-xs truncate">{item.expression}</div>
                    <div className="text-white font-medium text-lg">= {item.result}</div>
                    <div className="text-gray-600 text-xs">{formatDate(item.createdAt)}</div>
                  </button>
                  <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onShare(item)}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 ml-auto"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-700/30">
            <p className="text-gray-600 text-xs text-center">{history.length} calculation{history.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </>
  );
}
