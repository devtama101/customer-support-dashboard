import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SentimentChart } from '@/components/dashboard/SentimentChart';
import { VolumeChart } from '@/components/dashboard/VolumeChart';
import { RecentTickets } from '@/components/dashboard/RecentTickets';
import { getDashboardStats, getTickets, getVolumeData, getSentimentData } from '@/actions';
import { Ticket, Clock, CheckCircle, Smile } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  // Get dashboard stats
  const stats = await getDashboardStats(session?.user?.teamId);

  // Get recent tickets (last 5)
  const recentTickets = await getTickets({ limit: 5 });

  // Get volume data for the last 7 days
  const volumeData = await getVolumeData(session?.user?.teamId);

  // Get sentiment data
  const sentimentData = await getSentimentData(session?.user?.teamId);

  // Format avg response time
  const formatResponseTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format sentiment percentage
  const totalSentiment = sentimentData.positive + sentimentData.neutral + sentimentData.negative;
  const sentimentPercent = totalSentiment > 0
    ? Math.round((sentimentData.positive / totalSentiment) * 100)
    : 0;

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${session?.user?.name?.split(' ')[0] || 'User'}!`}
      />

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Open Tickets"
            value={stats.openTickets}
            trend="↑ 12% from last week"
            trendType="up"
            icon={Ticket}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Avg Response"
            value={formatResponseTime(stats.avgResponseTime)}
            trend="↓ 18% from last week"
            trendType="down"
            icon={Clock}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatsCard
            title="Resolution Rate"
            value={`${stats.resolutionRate}%`}
            trend="↑ 5% from last week"
            trendType="up"
            icon={CheckCircle}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatsCard
            title="Sentiment"
            value={`${sentimentPercent}%`}
            trend="Positive"
            trendType="neutral"
            icon={Smile}
            iconBgColor="bg-amber-100"
            iconColor="text-amber-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sentiment Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Sentiment Breakdown</h3>
            <SentimentChart
              positive={sentimentData.positive}
              neutral={sentimentData.neutral}
              negative={sentimentData.negative}
            />
          </div>

          {/* Volume Trends */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Volume Trends (7 days)</h3>
            <VolumeChart data={volumeData} />
          </div>
        </div>

        {/* Recent Tickets */}
        <RecentTickets tickets={recentTickets.slice(0, 5)} />
      </div>
    </>
  );
}
