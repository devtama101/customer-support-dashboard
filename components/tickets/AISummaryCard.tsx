'use client';

import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

interface AISummaryCardProps {
  summary: string | null;
}

export function AISummaryCard({ summary }: AISummaryCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!summary) {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="bg-gradient-to-r from-purple-50 to-blue-50 border-b px-8 py-2 text-sm text-purple-600 hover:text-purple-700"
      >
        Show AI Summary
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b px-8 py-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <p className="font-medium text-sm text-gray-800">AI Summary</p>
          <p className="text-sm text-gray-600 mt-1">{summary}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-auto text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
