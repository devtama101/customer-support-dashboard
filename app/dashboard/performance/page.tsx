import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Trophy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAgents } from '@/actions';

export default async function PerformancePage() {
  const session = await auth();

  // Get all agents with their ticket counts
  const agents = await getAgents();

  // Calculate mock performance metrics based on ticket counts
  const agentPerformance = agents.map((agent, index) => {
    // Generate some realistic performance data
    const resolvedCount = Math.floor(Math.random() * 40) + 10;
    const responseTime = (Math.random() * 2 + 0.5).toFixed(1);
    const resolutionRate = Math.floor(Math.random() * 15) + 85;
    const rating = (Math.random() * 1 + 4).toFixed(1);

    return {
      ...agent,
      resolvedCount,
      responseTime,
      resolutionRate,
      rating,
    };
  }).sort((a, b) => b.resolvedCount - a.resolvedCount);

  const teamAvgResponse = (
    agentPerformance.reduce((sum, a) => sum + parseFloat(a.responseTime), 0) /
    agentPerformance.length
  ).toFixed(1);

  const teamResolutionRate = Math.round(
    agentPerformance.reduce((sum, a) => sum + a.resolutionRate, 0) /
      agentPerformance.length
  );

  const totalResolved = agentPerformance.reduce(
    (sum, a) => sum + a.resolvedCount,
    0
  );

  const teamRating = (
    agentPerformance.reduce((sum, a) => sum + parseFloat(a.rating), 0) /
    agentPerformance.length
  ).toFixed(1);

  const topPerformer = agentPerformance[0];
  const maxResolved = topPerformer?.resolvedCount || 1;

  return (
    <>
      <Header
        title="Agent Performance"
        subtitle="Track team metrics and individual performance"
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        }
      />

      <div className="p-8">
        {/* Time Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
              This Week
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-sm">
              This Month
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-sm">
              This Quarter
            </button>
          </div>
        </div>

        {/* Team Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Team Avg Response</p>
            <p className="text-3xl font-bold text-gray-800">{teamAvgResponse}h</p>
            <p className="text-xs text-green-500 mt-1">↓ 12% vs last week</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Team Resolution Rate</p>
            <p className="text-3xl font-bold text-gray-800">{teamResolutionRate}%</p>
            <p className="text-xs text-green-500 mt-1">↑ 5% vs last week</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Tickets Resolved</p>
            <p className="text-3xl font-bold text-gray-800">{totalResolved}</p>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Customer Satisfaction</p>
            <p className="text-3xl font-bold text-gray-800">
              {teamRating}<span className="text-lg text-gray-400">/5</span>
            </p>
            <p className="text-xs text-green-500 mt-1">↑ 0.2 vs last week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Top Performers
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {agentPerformance.slice(0, 5).map((agent, index) => {
                const rankColors = [
                  'bg-amber-50 border-amber-200 text-amber-600',
                  'bg-gray-50 text-gray-400',
                  'bg-orange-50 border-orange-200 text-orange-400',
                  'text-gray-300',
                  'text-gray-300',
                ];

                const badgeColors = [
                  'bg-amber-100 text-amber-700',
                  'bg-gray-100 text-gray-700',
                  'bg-orange-100 text-orange-700',
                  'bg-gray-100 text-gray-700',
                  'bg-gray-100 text-gray-700',
                ];

                return (
                  <div
                    key={agent.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      index === 0
                        ? rankColors[0]
                        : index === 2
                        ? rankColors[2]
                        : 'border-transparent'
                    }`}
                  >
                    <span
                      className={`text-2xl font-bold ${
                        index < 3 ? rankColors[index].split(' ')[2] : 'text-gray-300'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                      {agent.user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{agent.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">
                        {agent.resolvedCount} tickets resolved
                      </p>
                    </div>
                    <span
                      className={`font-bold ${
                        index === 0
                          ? 'text-amber-600'
                          : index === 1
                          ? 'text-gray-600'
                          : index === 2
                          ? 'text-orange-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {agent.resolutionRate}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Weekly Comparison</h3>
              <select className="text-sm border rounded px-2 py-1">
                <option>Tickets Resolved</option>
                <option>Response Time</option>
                <option>Satisfaction</option>
              </select>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {agentPerformance.slice(0, 5).map((agent) => (
                  <div key={agent.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                          {agent.user?.name?.charAt(0) || 'A'}
                        </div>
                        <span className="text-sm font-medium">
                          {agent.user?.name || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {agent.resolvedCount} tickets
                      </span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        style={{
                          width: `${(agent.resolvedCount / maxResolved) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Agent Cards */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Individual Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agentPerformance.map((agent, index) => (
              <div
                key={agent.id}
                className="bg-white rounded-xl p-6 shadow-sm border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-lg font-medium">
                    {agent.user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {agent.user?.name || 'Unknown'}
                        </h4>
                        <p className="text-sm text-gray-500 capitalize">
                          {agent.role.toLowerCase()}
                        </p>
                      </div>
                      {index === 0 && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Top Performer
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-2xl font-bold">{agent.responseTime}h</p>
                        <p className="text-xs text-gray-500">Avg Response</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{agent.resolutionRate}%</p>
                        <p className="text-xs text-gray-500">Resolution</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{agent.rating}</p>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
