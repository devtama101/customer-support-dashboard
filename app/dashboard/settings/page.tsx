import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Trash2, Upload, Plus } from 'lucide-react';
import { getTeam } from '@/actions';
import { notFound } from 'next/navigation';

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

const priorityColors: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700',
  HIGH: 'bg-blue-100 text-blue-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-gray-100 text-gray-700',
  BILLING: 'bg-purple-100 text-purple-700',
};

export default async function SettingsPage() {
  const session = await auth();
  const team = await getTeam(session?.user?.teamId);

  if (!team) {
    notFound();
  }

  // Get team initials for logo
  const teamInitials = team.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <Header
        title="Settings"
        subtitle="Manage your team and preferences"
      />

      <div className="p-8">
        {/* Settings Tabs */}
        <div className="flex items-center gap-1 border-b mb-8">
          <button className="px-4 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">
            General
          </button>
          <button className="px-4 py-3 text-gray-500 hover:text-gray-700">
            Team
          </button>
          <button className="px-4 py-3 text-gray-500 hover:text-gray-700">
            Tags
          </button>
          <button className="px-4 py-3 text-gray-500 hover:text-gray-700">
            Integrations
          </button>
          <button className="px-4 py-3 text-gray-500 hover:text-gray-700">
            Notifications
          </button>
        </div>

        {/* General Settings */}
        <div className="max-w-3xl">
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
                  defaultValue={team.name}
                  className="w-full"
                />
              </div>
              <div>
                <Label>Team Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {teamInitials}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4" />
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${statusColors.OPEN}`} />
                    <span className="font-medium">{statusLabels.OPEN}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className={`w-3 h-3 rounded-full ${statusColors.IN_PROGRESS}`} />
                    <span className="font-medium">{statusLabels.IN_PROGRESS}</span>
                  </div>
                  <span className="text-xs text-green-600">✓ Allowed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${statusColors.IN_PROGRESS}`} />
                    <span className="font-medium">{statusLabels.IN_PROGRESS}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className={`w-3 h-3 rounded-full ${statusColors.WAITING}`} />
                    <span className="font-medium">{statusLabels.WAITING}</span>
                  </div>
                  <span className="text-xs text-green-600">✓ Allowed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${statusColors.WAITING}`} />
                    <span className="font-medium">{statusLabels.WAITING}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className={`w-3 h-3 rounded-full ${statusColors.RESOLVED}`} />
                    <span className="font-medium">{statusLabels.RESOLVED}</span>
                  </div>
                  <span className="text-xs text-green-600">✓ Allowed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${statusColors.RESOLVED}`} />
                    <span className="font-medium">{statusLabels.RESOLVED}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className={`w-3 h-3 rounded-full ${statusColors.CLOSED}`} />
                    <span className="font-medium">{statusLabels.CLOSED}</span>
                  </div>
                  <span className="text-xs text-green-600">✓ Allowed</span>
                </div>
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
              <Button variant="ghost" size="sm" className="gap-2 text-blue-600">
                <Plus className="w-4 h-4" />
                Add Rule
              </Button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-sm rounded-full ${priorityColors.URGENT}`}>
                    urgent
                  </span>
                  <span className="text-gray-500">→ assign to</span>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    S
                  </div>
                  <span className="font-medium">Sarah Wilson</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-sm rounded-full ${priorityColors.BILLING}`}>
                    billing
                  </span>
                  <span className="text-gray-500">→ assign to</span>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    M
                  </div>
                  <span className="font-medium">Mike Johnson</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    Unassigned
                  </span>
                  <span className="text-gray-500">→ round-robin to all agents</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </>
  );
}
