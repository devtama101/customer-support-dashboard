'use client';

import { Sparkles, Plus, X, Star } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TicketWithRelations, TicketStatus, TicketPriority } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition, useState } from 'react';

interface TicketSidebarProps {
  ticket: TicketWithRelations;
  currentAgentId?: string;
}

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'WAITING', label: 'Waiting' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getSentimentColor(score: number | null): string {
  if (score === null) return 'bg-gray-500';
  if (score > 0) return 'bg-green-500';
  if (score < 0) return 'bg-red-500';
  return 'bg-yellow-500';
}

function getSentimentLabel(score: number | null): string {
  if (score === null) return 'Neutral';
  if (score > 0.3) return 'Positive';
  if (score < -0.3) return 'Negative';
  return 'Neutral';
}

export function TicketSidebar({ ticket, currentAgentId }: TicketSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const updateTicket = async (updates: { status?: TicketStatus; priority?: TicketPriority }) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/tickets/${ticket.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.error('Failed to update ticket:', error);
      }
    });
  };

  const customerInitials = ticket.customer.name
    ? getInitials(ticket.customer.name)
    : ticket.customer.email.slice(0, 2).toUpperCase();

  const sentimentPercent = ticket.sentimentScore
    ? Math.round(((ticket.sentimentScore + 1) / 2) * 100)
    : 50;

  return (
    <aside className="w-80 border-l bg-white p-6 overflow-y-auto">
      {/* Status & Priority */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
        <Select
          value={ticket.status}
          onValueChange={(value) => updateTicket({ status: value as TicketStatus })}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Priority</h3>
        <Select
          value={ticket.priority}
          onValueChange={(value) => updateTicket({ priority: value as TicketPriority })}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Customer</h3>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gray-200">
              {customerInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {ticket.customer.name || 'Unknown'}
            </p>
            <p className="text-sm text-gray-500">{ticket.customer.email}</p>
          </div>
        </div>
      </div>

      {/* Category */}
      {ticket.category && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Category</h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              {ticket.category}
            </span>
            <span className="text-xs text-purple-600">AI-categorized</span>
          </div>
        </div>
      )}

      {/* Sentiment */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Sentiment</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`${getSentimentColor(ticket.sentimentScore)} h-2 rounded-full transition-all`}
              style={{ width: `${sentimentPercent}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {getSentimentLabel(ticket.sentimentScore)}
          </span>
        </div>
        {ticket.sentimentScore !== null && (
          <p className="text-xs text-gray-500 mt-1">
            Score: {ticket.sentimentScore.toFixed(2)}
          </p>
        )}
      </div>

      {/* Created/Resolved */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Timeline</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Created</span>
            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
          {ticket.resolvedAt && (
            <div className="flex justify-between">
              <span className="text-gray-500">Resolved</span>
              <span>{new Date(ticket.resolvedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Rating Section - Show for resolved/closed tickets */}
      {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Customer Rating</h3>
          {ticket.rating ? (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= ticket.rating!
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 font-semibold text-gray-700">
                  {ticket.rating}/5
                </span>
              </div>
              {ticket.ratingComment && (
                <p className="text-sm text-gray-600 italic">
                  "{ticket.ratingComment}"
                </p>
              )}
              {ticket.ratedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Rated on {new Date(ticket.ratedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-dashed text-center">
              <p className="text-sm text-gray-500 mb-2">No rating yet</p>
              <p className="text-xs text-gray-400">Customer has not rated this ticket</p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
