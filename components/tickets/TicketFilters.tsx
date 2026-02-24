'use client';

import { Search, X, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'WAITING', label: 'Waiting' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

const priorityOptions = [
  { value: 'all', label: 'All Priority' },
  { value: 'URGENT', label: 'Urgent' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

const sentimentOptions = [
  { value: 'all', label: 'All Sentiment' },
  { value: 'positive', label: 'Positive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'negative', label: 'Negative' },
];

export function TicketFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'all');
  const [sentiment, setSentiment] = useState(searchParams.get('sentiment') || 'all');

  // Update URL when filters change
  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const clearAllFilters = () => {
    setSearch('');
    setStatus('all');
    setPriority('all');
    setSentiment('all');
    router.push(pathname);
  };

  const hasActiveFilters = search || status !== 'all' || priority !== 'all' || sentiment !== 'all';

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={priority} onValueChange={(value) => setPriority(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sentiment Filter */}
        <Select value={sentiment} onValueChange={(value) => setSentiment(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Sentiment" />
          </SelectTrigger>
          <SelectContent>
            {sentimentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tags Filter (placeholder) */}
        <Button variant="outline" className="gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <span>Filter by Tags</span>
        </Button>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm text-gray-500">Active filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Search: {search}
              <button
                onClick={() => setSearch('')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {statusOptions.find((s) => s.value === status)?.label}
              <button
                onClick={() => setStatus('all')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {priority !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {priorityOptions.find((p) => p.value === priority)?.label}
              <button
                onClick={() => setPriority('all')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {sentiment !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {sentimentOptions.find((s) => s.value === sentiment)?.label}
              <button
                onClick={() => setSentiment('all')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Apply filters button for select changes */}
      {(status !== (searchParams.get('status') || 'all') ||
        priority !== (searchParams.get('priority') || 'all') ||
        sentiment !== (searchParams.get('sentiment') || 'all')) && (
        <div className="mt-3">
          <Button
            size="sm"
            onClick={() =>
              updateFilters({
                status: status === 'all' ? '' : status,
                priority: priority === 'all' ? '' : priority,
                sentiment: sentiment === 'all' ? '' : sentiment,
              })
            }
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}
