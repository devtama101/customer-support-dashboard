'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { TicketPriority, TicketStatus } from '@/types';

// Simple tag colors
const tagColors = [
  'bg-red-100 text-red-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-orange-100 text-orange-700',
];

const commonTags = [
  { name: 'bug', color: 'bg-red-100 text-red-700' },
  { name: 'feature', color: 'bg-purple-100 text-purple-700' },
  { name: 'urgent', color: 'bg-orange-100 text-orange-700' },
  { name: 'billing', color: 'bg-green-100 text-green-700' },
  { name: 'integration', color: 'bg-blue-100 text-blue-700' },
];

const categories = [
  'General',
  'Billing',
  'Integration',
  'Feature Request',
  'Bug Report',
  'Technical Support',
  'Account',
  'Other',
];

const priorities: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const statuses: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED'];

interface Customer {
  id: string;
  name: string | null;
  email: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
}

export default function NewTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [category, setCategory] = useState('General');
  const [status, setStatus] = useState<TicketStatus>('OPEN');
  const [assignedAgentId, setAssignedAgentId] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Customer selection
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [showCustomerResults, setShowCustomerResults] = useState(false);

  const [agents, setAgents] = useState<Agent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load customer if ID is in URL
  useEffect(() => {
    if (customerId) {
      fetch(`/api/customers/${customerId}`)
        .then((res) => res.json())
        .then((data) => {
          setSelectedCustomer(data);
        })
        .catch(console.error);
    }

    // Load agents
    fetch('/api/agents')
      .then((res) => res.json())
      .then((data) => setAgents(data))
      .catch(console.error);
  }, [customerId]);

  // Search customers
  useEffect(() => {
    if (customerSearch.length >= 2) {
      fetch(`/api/customers/search?q=${encodeURIComponent(customerSearch)}`)
        .then((res) => res.json())
        .then((data) => {
          setCustomerResults(data.slice(0, 5));
          setShowCustomerResults(true);
        })
        .catch(() => {
          setCustomerResults([]);
          setShowCustomerResults(false);
        });
    } else {
      setCustomerResults([]);
      setShowCustomerResults(false);
    }
  }, [customerSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer || !subject.trim()) {
      alert('Please select a customer and enter a subject');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          subject: subject.trim(),
          description: description.trim(),
          priority,
          category,
          status,
          assignedAgentId: assignedAgentId || null,
          tags,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/tickets/${data.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create ticket');
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tagName: string) => {
    setTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const addNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getTagColor = (tag: string) => {
    const existing = commonTags.find((t) => t.name === tag);
    if (existing) return existing.color;
    const index = Math.abs(tag.charCodeAt(0)) % tagColors.length;
    return tagColors[index];
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b px-8 py-4 flex items-center gap-4">
        <Link
          href="/dashboard/tickets"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Create New Ticket</h2>
          <p className="text-gray-500 text-sm">Create a support ticket manually</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 max-w-4xl">
        {/* Customer Selection */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Customer</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search existing customers..."
                className="pl-10"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />
            </div>
            <span className="text-gray-400">or</span>
            <Link href="/dashboard/customers">
              <Button type="button" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </Link>
          </div>

          {/* Customer Search Results */}
          {showCustomerResults && customerResults.length > 0 && (
            <div className="border rounded-lg mb-4 overflow-hidden">
              {customerResults.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left border-b last:border-b-0"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setCustomerSearch('');
                    setShowCustomerResults(false);
                  }}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-200 text-xs">
                      {getInitials(customer.name, customer.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {customer.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Customer */}
          {selectedCustomer && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-200">
                    {getInitials(selectedCustomer.name, selectedCustomer.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">
                    {selectedCustomer.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ticket Details */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Ticket Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <Input
                type="text"
                placeholder="Brief summary of the issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                rows={4}
                placeholder="Detailed description of the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select value={status} onValueChange={(v) => setStatus(v as TicketStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.toLowerCase().replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {commonTags.map((tag) => (
              <button
                key={tag.name}
                type="button"
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  tags.includes(tag.name)
                    ? tag.color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => toggleTag(tag.name)}
              >
                {tags.includes(tag.name) ? '✓ ' : ''}
                {tag.name}
              </button>
            ))}
          </div>
          {/* Custom tags */}
          {tags
            .filter((t) => !commonTags.find((ct) => ct.name === t))
            .map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${getTagColor(
                  tag
                )}`}
              >
                {tag}
                <button
                  type="button"
                  className="hover:opacity-70"
                  onClick={() => toggleTag(tag)}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          <div className="flex items-center gap-2 mt-3">
            <Input
              type="text"
              placeholder="Add new tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addNewTag();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addNewTag}
              className="shrink-0"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Assignment */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Assignment</h3>
          <Select
            value={assignedAgentId || 'unassigned'}
            onValueChange={(v) => setAssignedAgentId(v === 'unassigned' ? '' : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/tickets"
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Link>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
