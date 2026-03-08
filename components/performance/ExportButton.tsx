'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
  teamId: string;
  period: string;
}

export function ExportButton({ teamId, period }: ExportButtonProps) {
  const handleExport = () => {
    // Create CSV content from the current data
    const csvContent = generateCSV();

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `performance-report-${period}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSV = () => {
    // This is a placeholder - in a real implementation, you would pass the data
    // For now, just export a simple report
    const headers = ['Report', 'Period', 'Generated At'];
    const rows = [
      ['Performance Report', period, new Date().toISOString()],
    ];

    return [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
  };

  return (
    <Button variant="outline" className="gap-2" onClick={handleExport}>
      <Download className="w-4 h-4" />
      Export Report
    </Button>
  );
}
