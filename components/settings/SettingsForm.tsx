'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowRight, Trash2, Plus, Loader2, Users, Bell, Plug } from 'lucide-react';
import { updateTeamName, addAutoAssignRule, deleteAutoAssignRule } from '@/actions';
import type { AgentWithTeam } from '@/actions';
import type { AutoAssignRule } from '@/actions/settings';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SettingsFormProps {
  teamId: string;
  teamName: string;
  agents: AgentWithTeam[];
  initialRules: AutoAssignRule[];
}

type TabId = 'general' | 'team' | 'integrations' | 'notifications';

const tabs: { id: TabId; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'team', label: 'Team' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'notifications', label: 'Notifications' },
];

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-500',
  IN_PROGRESS: 'bg-purple-500',
  WAITING: 'bg-orange-500',
  RESOLVED: 'bg-green-500',
  CLOSED: 'bg-gray-500',
};

const statusLabels: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  WAITING: 'Waiting',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const conditionColors: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  billing: 'bg-purple-100 text-purple-700',
  technical: 'bg-blue-100 text-blue-700',
  unassigned: 'bg-gray-100 text-gray-700',
};

const conditionLabels: Record<string, string> = {
  urgent: 'Urgent',
  high: 'High Priority',
  billing: 'Billing',
  technical: 'Technical',
  unassigned: 'Unassigned',
};

export function SettingsForm({
  teamId,
  teamName,
  agents,
  initialRules,
}: SettingsFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [name, setName] = useState(teamName);
  const [rules, setRules] = useState<AutoAssignRule[]>(initialRules);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [newCondition, setNewCondition] = useState<string>('');
  const [newAssignTo, setNewAssignTo] = useState<string>('');
  const [isAddingRule, setIsAddingRule] = useState(false);

  const handleSaveName = async () => {
    setIsSaving(true);
    try {
      await updateTeamName(teamId, name);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(teamName);
    router.refresh();
  };

  const handleAddRule = async () => {
    if (!newCondition) return;

    setIsAddingRule(true);
    try {
      const agent = agents.find((a) => a.id === newAssignTo);
      const rule = await addAutoAssignRule(teamId, {
        condition: newCondition as AutoAssignRule['condition'],
        assignTo: newAssignTo || undefined,
        type: newCondition === 'unassigned' ? 'round-robin' : 'direct',
        agentName: agent?.user?.name || undefined,
      });
      setRules([...rules, rule]);
      setIsAddRuleOpen(false);
      setNewCondition('');
      setNewAssignTo('');
    } catch (error) {
      console.error('Failed to add rule:', error);
    } finally {
      setIsAddingRule(false);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await deleteAutoAssignRule(teamId, ruleId);
      setRules(rules.filter((r) => r.id !== ruleId));
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="max-w-3xl">
            {/* Team Information */}
            <div className="bg-white rounded-xl shadow-sm border mb-6">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Team Information</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Basic information about your support team
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Team Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" disabled>
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Settings */}
            <div className="bg-white rounded-xl shadow-sm border mb-6">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Workflow Configuration</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Customize ticket status transitions
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    ['OPEN', 'IN_PROGRESS'],
                    ['IN_PROGRESS', 'WAITING'],
                    ['WAITING', 'RESOLVED'],
                    ['RESOLVED', 'CLOSED'],
                  ].map(([from, to]) => (
                    <div
                      key={`${from}-${to}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn('w-3 h-3 rounded-full', statusColors[from])} />
                        <span className="font-medium">{statusLabels[from]}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className={cn('w-3 h-3 rounded-full', statusColors[to])} />
                        <span className="font-medium">{statusLabels[to]}</span>
                      </div>
                      <span className="text-xs text-green-600">Allowed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto-Assignment Rules */}
            <div className="bg-white rounded-xl shadow-sm border mb-6">
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Auto-Assignment Rules</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Automatically assign tickets to agents
                  </p>
                </div>
                <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-blue-600">
                      <Plus className="w-4 h-4" />
                      Add Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Auto-Assignment Rule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>Condition</Label>
                        <Select value={newCondition} onValueChange={setNewCondition}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Urgent Priority</SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="billing">Billing Category</SelectItem>
                            <SelectItem value="technical">Technical Category</SelectItem>
                            <SelectItem value="unassigned">Unassigned Tickets</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {newCondition !== 'unassigned' && (
                        <div>
                          <Label>Assign to Agent</Label>
                          <Select value={newAssignTo} onValueChange={setNewAssignTo}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select agent" />
                            </SelectTrigger>
                            <SelectContent>
                              {agents.map((agent) => (
                                <SelectItem key={agent.id} value={agent.id}>
                                  {agent.user.name || agent.user.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {newCondition === 'unassigned' && (
                        <p className="text-sm text-gray-500">
                          Unassigned tickets will be distributed using round-robin among all agents.
                        </p>
                      )}
                      <Button
                        onClick={handleAddRule}
                        disabled={!newCondition || (newCondition !== 'unassigned' && !newAssignTo) || isAddingRule}
                        className="w-full"
                      >
                        {isAddingRule ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add Rule'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="p-6 space-y-3">
                {rules.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No auto-assignment rules yet. Add one to automatically route tickets.
                  </p>
                ) : (
                  rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className={cn('px-3 py-1 text-sm rounded-full', conditionColors[rule.condition])}>
                          {conditionLabels[rule.condition]}
                        </span>
                        <span className="text-gray-500">assign to</span>
                        {rule.condition === 'unassigned' ? (
                          <span className="font-medium">Round-robin all agents</span>
                        ) : (
                          <>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                              {rule.agentName?.charAt(0) || '?'}
                            </div>
                            <span className="font-medium">{rule.agentName || 'Unknown'}</span>
                          </>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveName} disabled={isSaving || name === teamName}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your support team
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                          {agent.user.name?.charAt(0) || agent.user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{agent.user.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{agent.user.email}</p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          'px-3 py-1 text-xs rounded-full',
                          agent.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        )}
                      >
                        {agent.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Plug className="w-5 h-5" />
                  Integrations
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Connect with external services
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Chat Widget</p>
                      <p className="text-sm text-gray-500">Embeddable support widget</p>
                    </div>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                    <div>
                      <p className="font-medium">Slack</p>
                      <p className="text-sm text-gray-500">Get notifications in Slack</p>
                    </div>
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      Coming Soon
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-500">Convert emails to tickets</p>
                    </div>
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure notification preferences
                </p>
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-center py-8">
                  Notification settings coming soon...
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      {/* Settings Tabs */}
      <div className="flex items-center gap-1 border-b mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-3 font-medium transition-colors',
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}
