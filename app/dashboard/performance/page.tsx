import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Trophy } from 'lucide-react';
import { getAgents, getAgentPerformance, getTeamStats } from '@/actions';
import type { AgentPerformanceData, TeamPerformanceStats } from '@/actions/performance';
import { PerformanceFilters } from '@/components/performance/PerformanceFilters';
import { PerformanceChart } from '@/components/performance/PerformanceChart';
import { ExportButton } from '@/components/performance/ExportButton';

interface PerformancePageProps {
  searchParams: Promise<{ period?: string }>;
}

const periodConfig = {
  week: { days: 7, label: 'This week' },
  month: { days: 30, label: 'This month' },
  quarter: { days: 90, label: 'This quarter' },
} as const;

type PeriodKey = keyof typeof periodConfig;

export default async function PerformancePage({ searchParams }: PerformancePageProps) {
  const session = await auth();
  const teamId = session?.user?.teamId;

  // Read period from URL params
  const { period = 'week' } = await searchParams;
  const periodKey = (period as PeriodKey) in periodConfig ? (period as PeriodKey) : 'week';
  const { days, label: periodLabel } = periodConfig[periodKey];

  if (!teamId) {
    return (
      <>
        <Header title="Agent Performance" subtitle="Track team metrics and individual performance" />
        <div className="p-8">
          <p className="text-gray-500">No team found. Please log in to view performance metrics.</p>
        </div>
      </>
    );
  }

  // Get real performance data from database
  let agents: any[] = [];
  let agentPerformanceData: AgentPerformanceData[] = [];
  let teamStats: TeamPerformanceStats;

  try {
    [agents, agentPerformanceData, teamStats] = await Promise.all([
      getAgents(),
      getAgentPerformance(teamId, days),
      getTeamStats(teamId, days),
    ]);
  } catch (error) {
    console.error('Failed to load performance data:', error);
    return (
      <>
        <Header title="Agent Performance" subtitle="Track team metrics and individual performance" />
        <div className="p-8">
          <p className="text-gray-500">Failed to load performance data. Please try again later.</p>
        </div>
      </>
    );
  }

  // Merge agent data with performance data
  const agentPerformance = agents.map((agent) => {
    const perfData = agentPerformanceData.find((p) => p.agentId === agent.id);
    return {
      ...agent,
      resolvedCount: perfData?.resolvedCount || 0,
      responseTime: perfData?.avgResponseTimeHours?.toFixed(1) || '0.0',
      resolutionRate: perfData?.resolutionRate || 0,
      rating: perfData?.avgRating?.toFixed(1) || '0.0',
    };
  }).sort((a, b) => b.resolvedCount - a.resolvedCount);

  const topPerformer = agentPerformance[0];
  const maxResolved = Math.max(topPerformer?.resolvedCount || 1, 1);

  // Prepare chart data
  const chartData = agentPerformance.slice(0, 5).map((agent) => ({
    id: agent.id,
    name: agent.user?.name || 'Unknown',
    resolvedCount: agent.resolvedCount,
    responseTime: agent.responseTime,
    rating: agent.rating,
    resolutionRate: agent.resolutionRate,
  }));

  return (
    <>
      <Header
        title="Agent Performance"
        subtitle="Track team metrics and individual performance"
        actions={
          <ExportButton teamId={teamId} period={periodKey} />
        }
      />

      <div className="p-8">
        {/* Time Filter */}
        <div className="flex items-center justify-between mb-6">
          <PerformanceFilters />
        </div>

        {/* Team Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Team Avg Response</p>
            <p className="text-3xl font-bold text-gray-800">{teamStats.avgResponseTimeHours}h</p>
            <p className="text-xs text-gray-500 mt-1">Average first response</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Team Resolution Rate</p>
            <p className="text-3xl font-bold text-gray-800">{teamStats.teamResolutionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Resolved / Assigned</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Tickets Resolved</p>
            <p className="text-3xl font-bold text-gray-800">{teamStats.totalResolved}</p>
            <p className="text-xs text-gray-500 mt-1">{periodLabel}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Customer Satisfaction</p>
            <p className="text-3xl font-bold text-gray-800">
              {teamStats.avgRating}<span className="text-lg text-gray-400">/5</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {teamStats.avgSatisfaction} ratings
            </p>
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
          <PerformanceChart agents={chartData} maxResolved={maxResolved} />
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
                      {index === 0 && agent.resolvedCount > 0 && (
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
