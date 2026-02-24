'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const engagementOptions = [
  { value: 'all', label: 'All Engagement' },
  { value: 'high', label: 'High - Active' },
  { value: 'medium', label: 'Medium - Occasional' },
  { value: 'low', label: 'Low - Dormant' },
];

const sortOptions = [
  { value: 'recent', label: 'Sort by: Recent' },
  { value: 'name', label: 'Sort by: Name' },
  { value: 'tickets', label: 'Sort by: Tickets' },
  { value: 'sentiment', label: 'Sort by: Sentiment' },
];

export function CustomerFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [engagement, setEngagement] = useState(searchParams.get('engagement') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recent');

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

  const handleEngagementChange = (value: string) => {
    setEngagement(value);
    updateFilters({ engagement: value === 'all' ? '' : value });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    updateFilters({ sort: value });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Engagement Filter */}
        <Select value={engagement} onValueChange={handleEngagementChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Engagement" />
          </SelectTrigger>
          <SelectContent>
            {engagementOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by: Recent" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
