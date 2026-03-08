import { notFound } from 'next/navigation';
import { getTeam } from '@/actions';
import type { Metadata } from 'next';
import { WidgetContent } from './WidgetContent';

interface WidgetPageProps {
  params: Promise<{
    teamId: string;
  }>;
  searchParams: Promise<{
    theme?: string;
    position?: 'left' | 'right';
  }>;
}

export async function generateMetadata({
  params,
}: WidgetPageProps): Promise<Metadata> {
  return {
    title: 'Support Widget',
    viewport: 'width=device-width, initial-scale=1.0',
  };
}

export default async function WidgetPage({
  params,
  searchParams,
}: WidgetPageProps) {
  const { teamId } = await params;
  const search = await searchParams;

  const team = await getTeam(teamId);

  if (!team) {
    notFound();
  }

  const theme = search.theme || 'light';
  const position = search.position || 'right';

  // Get team name and default greeting
  const teamName = team.name || 'SupportHub';
  const settings = team.settings as Record<string, unknown> | null;
  const widgetConfig = settings?.widgetConfig as Record<string, unknown> | null;
  const greeting = (widgetConfig?.greeting as string) ||
    'Hi there! 👋 Welcome to Support. How can I help you today?';

  return (
    <WidgetContent
      teamId={teamId}
      teamName={teamName}
      greeting={greeting}
    />
  );
}
