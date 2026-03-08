'use client';

import { useState } from 'react';

interface AgentChartData {
  id: string;
  name: string;
  resolvedCount: number;
  responseTime: string;
  rating: string;
  resolutionRate: number;
}

interface PerformanceChartProps {
  agents: AgentChartData[];
  maxResolved: number;
}

type MetricType = 'resolved' | 'responseTime' | 'satisfaction';

const metricConfig = {
  resolved: {
    label: 'Tickets Resolved',
    getValue: (agent: AgentChartData) => agent.resolvedCount,
    getLabel: (agent: AgentChartData) => `${agent.resolvedCount} tickets`,
    getMax: (agents: AgentChartData[]) => Math.max(...agents.map(a => a.resolvedCount), 1),
    colorClass: 'from-blue-500 to-blue-600',
  },
  responseTime: {
    label: 'Response Time',
    getValue: (agent: AgentChartData) => parseFloat(agent.responseTime) || 0,
    getLabel: (agent: AgentChartData) => `${agent.responseTime}h avg`,
    getMax: (agents: AgentChartData[]) => {
      const times = agents.map(a => parseFloat(a.responseTime) || 0);
      return Math.max(...times, 1);
    },
    colorClass: 'from-green-500 to-green-600',
  },
  satisfaction: {
    label: 'Satisfaction',
    getValue: (agent: AgentChartData) => parseFloat(agent.rating) || 0,
    getLabel: (agent: AgentChartData) => `${agent.rating}/5 rating`,
    getMax: () => 5, // Max rating is 5
    colorClass: 'from-amber-500 to-amber-600',
  },
};

export function PerformanceChart({ agents, maxResolved }: PerformanceChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('resolved');

  const config = metricConfig[selectedMetric];
  const maxValue = config.getMax(agents);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Weekly Comparison</h3>
        <select
          className="text-sm border rounded px-2 py-1 cursor-pointer"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
        >
          <option value="resolved">Tickets Resolved</option>
          <option value="responseTime">Response Time</option>
          <option value="satisfaction">Satisfaction</option>
        </select>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {agents.slice(0, 5).map((agent) => {
            const value = config.getValue(agent);
            const percentage = (value / maxValue) * 100;

            return (
              <div key={agent.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                      {agent.name?.charAt(0) || 'A'}
                    </div>
                    <span className="text-sm font-medium">
                      {agent.name || 'Unknown'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {config.getLabel(agent)}
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${config.colorClass} rounded-full transition-all duration-300`}
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
