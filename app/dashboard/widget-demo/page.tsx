import { Header } from '@/components/layout/Header';
import { Code } from 'lucide-react';
import { getTeam } from '@/actions';
import { CopyButton } from '@/components/ui/CopyButton';

// This is a demo page showing how to embed the widget
export default async function WidgetDemoPage() {
  // Get the default team for the demo
  const teams = await getTeam(null);

  const teamId = teams?.id || 'default-team-id';
  const widgetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/widget/embed.js`;

  const embedCode = `<!-- SupportHub Widget -->
<script src="${widgetUrl}" data-team-id="${teamId}"></script>`;

  const iframeCode = `<!-- Or use an iframe directly -->
<iframe
  src="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/widget/${teamId}"
  width="380"
  height="600"
  frameborder="0"
></iframe>`;

  return (
    <>
      <Header
        title="Widget Integration"
        subtitle="Embed the support widget on your website"
      />

      <div className="p-8 max-w-4xl mx-auto">
      {/* Overview */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <p className="text-gray-600 mb-4">
          The SupportHub widget allows your customers to reach out for help directly from
          your website. It creates tickets automatically and routes them to your support
          team.
        </p>
        <p className="text-gray-600">
          Choose one of the integration methods below to get started.
        </p>
      </div>

      {/* JavaScript Embed */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            JavaScript Widget (Recommended)
          </h3>
          <CopyButton code={embedCode} />
        </div>
        <p className="text-gray-600 mb-4">
          Add this script tag to your website, ideally just before the closing{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">&lt;/body&gt;</code>{' '}
          tag:
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{embedCode}</code>
        </pre>

        <h4 className="font-medium mt-6 mb-3">Configuration Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConfigOption
            name="data-team-id"
            description="Your team ID (required)"
            example="your-team-id"
          />
          <ConfigOption
            name="data-position"
            description="Widget position"
            example="left | right (default: right)"
          />
          <ConfigOption
            name="data-theme"
            description="Color theme"
            example="light | dark (default: light)"
          />
          <ConfigOption
            name="data-color"
            description="Primary color"
            example="#3b82f6 (any hex color)"
          />
          <ConfigOption
            name="data-title"
            description="Widget title"
            example="Support Chat"
          />
          <ConfigOption
            name="data-greeting"
            description="Welcome message"
            example="Hi! How can we help?"
          />
        </div>

        <h4 className="font-medium mt-6 mb-3">JavaScript API</h4>
        <p className="text-gray-600 mb-3">
          Once the widget is loaded, you can control it programmatically:
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`// Open the widget
SupportHub.open();

// Close the widget
SupportHub.close();

// Toggle the widget
SupportHub.toggle();

// Check if widget is open
if (SupportHub.isOpen()) {
  console.log('Widget is open');
}`}</code>
        </pre>
      </div>

      {/* Iframe Embed */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-600" />
            iframe Embed
          </h3>
          <CopyButton code={iframeCode} />
        </div>
        <p className="text-gray-600 mb-4">
          Alternatively, you can embed the widget as an iframe:
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{iframeCode}</code>
        </pre>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
        <p className="text-gray-600 mb-4">
          Test the widget directly on this page:
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center">
          <iframe
            src={`/widget/${teamId}`}
            width="380"
            height="600"
            className="rounded-lg shadow-lg max-w-full"
            frameBorder="0"
          />
        </div>
      </div>

      {/* Test Widget Embed Script on this page */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Floating Button Test</h3>
        <p className="text-gray-600 mb-4">
          Click the button in the bottom right corner to test the floating widget:
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
          The widget button should appear in the bottom right corner of this page.
        </div>
      </div>
    </div>

      {/* Load the widget script on this page */}
      <script
        src="/widget/embed.js"
        data-team-id={teamId}
        data-position="right"
      />
    </>
  );
}

function ConfigOption({
  name,
  description,
  example,
}: {
  name: string;
  description: string;
  example: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <code className="text-blue-600 font-medium">{name}</code>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
      <p className="text-gray-500 text-xs mt-1">{example}</p>
    </div>
  );
}
