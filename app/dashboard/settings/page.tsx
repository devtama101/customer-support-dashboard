import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { getAgents, getTeamSettings } from '@/actions';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { notFound } from 'next/navigation';

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.teamId) {
    notFound();
  }

  const [teamSettings, agents] = await Promise.all([
    getTeamSettings(session.user.teamId),
    getAgents(),
  ]);

  if (!teamSettings) {
    notFound();
  }

  return (
    <>
      <Header
        title="Settings"
        subtitle="Manage your team and preferences"
      />

      <SettingsForm
        teamId={teamSettings.id}
        teamName={teamSettings.name}
        agents={agents}
        initialRules={teamSettings.autoAssignRules}
      />
    </>
  );
}
