import { notFound } from 'next/navigation';
import { getTeam } from '@/actions';
import type { Metadata } from 'next';

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
  const offlineMessage = (widgetConfig?.offlineMessage as string) ||
    'We are currently offline. Please leave a message and we will get back to you soon.';

  return (
    <div className="h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold">{teamName} Support</p>
              <p className="text-xs text-blue-100">
                We typically reply in minutes
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          id="messages-area"
          className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
        >
          {/* Bot Welcome Message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="bg-white border rounded-xl rounded-tl-none p-3 max-w-[80%]">
              <p className="text-sm">{greeting}</p>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="p-3 border-t bg-white">
          <p className="text-xs text-gray-500 mb-2">Common questions:</p>
          <div className="flex flex-wrap gap-2">
            <button
              className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
              onClick={() => {
                const input = document.getElementById('message-input') as HTMLInputElement;
                if (input) {
                  input.value = 'How do I reset my password?';
                  input.focus();
                }
              }}
            >
              Reset password
            </button>
            <button
              className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
              onClick={() => {
                const input = document.getElementById('message-input') as HTMLInputElement;
                if (input) {
                  input.value = 'Where can I find my billing info?';
                  input.focus();
                }
              }}
            >
              Billing info
            </button>
            <button
              className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
              onClick={() => {
                const input = document.getElementById('message-input') as HTMLInputElement;
                if (input) {
                  input.value = 'How do I contact support?';
                  input.focus();
                }
              }}
            >
              Contact support
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form id="ticket-form" className="p-4 border-t bg-white space-y-3">
          <input
            type="text"
            id="name-input"
            name="name"
            placeholder="Your name"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            id="email-input"
            name="email"
            placeholder="Your email"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            id="message-input"
            name="message"
            placeholder="How can we help you?"
            rows={3}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Send Message
          </button>
          <p className="text-xs text-gray-400 text-center">
            Powered by SupportHub
          </p>
        </form>

        {/* Client-side Script for Widget Functionality */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const form = document.getElementById('ticket-form');
                const messagesArea = document.getElementById('messages-area');
                const teamId = '${teamId}';

                form.addEventListener('submit', async function(e) {
                  e.preventDefault();

                  const name = document.getElementById('name-input').value;
                  const email = document.getElementById('email-input').value;
                  const message = document.getElementById('message-input').value;

                  // Add user message to chat
                  addMessage(message, 'user');

                  // Clear form
                  document.getElementById('message-input').value = '';

                  // Show typing indicator
                  showTyping();

                  // Submit ticket
                  try {
                    const response = await fetch('/api/widget/ticket', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        teamId,
                        name,
                        email,
                        message,
                      }),
                    });

                    hideTyping();

                    if (response.ok) {
                      const data = await response.json();
                      addMessage('Thanks! I\\'ve created a ticket #' + data.ticketId + ' for you. You\\'ll receive an email confirmation shortly. A support agent will be with you soon! 🎫', 'bot');

                      // Disable form after ticket creation
                      form.querySelectorAll('input, textarea, button').forEach(el => {
                        el.disabled = true;
                      });
                    } else {
                      addMessage('Sorry, there was an error creating your ticket. Please try again.', 'bot');
                    }
                  } catch (error) {
                    hideTyping();
                    addMessage('Sorry, there was an error creating your ticket. Please try again.', 'bot');
                  }
                });

                function addMessage(text, type) {
                  const div = document.createElement('div');
                  div.className = 'flex gap-3' + (type === 'user' ? ' justify-end' : '');

                  if (type === 'user') {
                    div.innerHTML = '<div class="bg-blue-600 text-white rounded-xl rounded-tr-none p-3 max-w-[80%]"><p class="text-sm">' + escapeHtml(text) + '</p></div>';
                  } else {
                    div.innerHTML = '<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div><div class="bg-white border rounded-xl rounded-tl-none p-3 max-w-[80%]"><p class="text-sm">' + escapeHtml(text) + '</p></div>';
                  }

                  messagesArea.appendChild(div);
                  messagesArea.scrollTop = messagesArea.scrollHeight;
                }

                function showTyping() {
                  const div = document.createElement('div');
                  div.id = 'typing-indicator';
                  div.className = 'flex gap-3';
                  div.innerHTML = '<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div><div class="bg-white border rounded-xl rounded-tl-none p-3"><div class="flex gap-1"><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div></div></div>';
                  messagesArea.appendChild(div);
                  messagesArea.scrollTop = messagesArea.scrollHeight;
                }

                function hideTyping() {
                  const typing = document.getElementById('typing-indicator');
                  if (typing) typing.remove();
                }

                function escapeHtml(text) {
                  const div = document.createElement('div');
                  div.textContent = text;
                  return div.innerHTML;
                }
              })();
            `,
          }}
        />
      </div>
    </div>
  );
}
