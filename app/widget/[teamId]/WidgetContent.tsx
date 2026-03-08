'use client';

import { useState } from 'react';

interface WidgetContentProps {
  teamId: string;
  teamName: string;
  greeting: string;
}

export function WidgetContent({ teamId, teamName, greeting }: WidgetContentProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; type: 'user' | 'bot' }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketDisplayId, setTicketDisplayId] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add user message
    setMessages(prev => [...prev, { text: message, type: 'user' }]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/widget/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, name, email, message: messages[messages.length - 1]?.text || message }),
      });

      setIsTyping(false);

      if (response.ok) {
        const data = await response.json();
        setTicketDisplayId(data.ticketDisplayId);
        setMessages(prev => [...prev, {
          text: `Thanks! Ticket #${data.ticketDisplayId} created. A support agent will respond shortly! 🎫`,
          type: 'bot'
        }]);
        setIsSubmitted(true);

        // Store ticket info
        localStorage.setItem(`supporthub_ticket_${teamId}`, JSON.stringify({
          id: data.ticketId,
          displayId: data.ticketDisplayId,
          email,
          createdAt: new Date().toISOString()
        }));

        // Start polling for status
        startStatusPolling(data.ticketId);
      } else {
        setMessages(prev => [...prev, {
          text: 'Sorry, there was an error creating your ticket. Please try again.',
          type: 'bot'
        }]);
      }
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        text: 'Sorry, there was an error creating your ticket. Please try again.',
        type: 'bot'
      }]);
    }
  };

  const startStatusPolling = (ticketId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/widget/ticket?id=${ticketId}`);
        if (response.ok) {
          const ticket = await response.json();
          if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
            clearInterval(interval);
            setMessages(prev => [...prev, {
              text: 'Great news! Your ticket has been resolved. 🎉',
              type: 'bot'
            }]);
            setTimeout(() => setShowRating(true), 1000);
          }
        }
      } catch (e) {
        // Silently fail
      }
    }, 10000);

    // Stop after 30 minutes
    setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const stored = localStorage.getItem(`supporthub_ticket_${teamId}`);
    if (!stored) return;

    const { id } = JSON.parse(stored);

    try {
      const response = await fetch('/api/widget/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: id,
          rating,
          comment: ratingComment || null
        })
      });

      if (response.ok) {
        setRatingSubmitted(true);
        localStorage.removeItem(`supporthub_ticket_${teamId}`);
      } else {
        alert('Failed to submit rating. Please try again.');
      }
    } catch (e) {
      alert('Failed to submit rating. Please try again.');
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">{teamName} Support</p>
              <p className="text-xs text-blue-100">We typically reply in minutes</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {/* Bot Welcome Message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="bg-white border rounded-xl rounded-tl-none p-3 max-w-[80%]">
              <p className="text-sm">{greeting}</p>
            </div>
          </div>

          {/* Dynamic Messages */}
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
              {msg.type === 'bot' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className={`${msg.type === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'} rounded-xl p-3 max-w-[80%]`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="bg-white border rounded-xl rounded-tl-none p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Rating Prompt */}
          {showRating && !ratingSubmitted && (
            <div className="bg-white border rounded-xl p-4 max-w-[100%]">
              <p className="text-sm font-medium text-gray-700 mb-3">How was your experience?</p>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Optional feedback..."
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                rows={2}
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
              />
              <button
                onClick={handleRatingSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm mt-2"
              >
                Submit Rating
              </button>
            </div>
          )}

          {ratingSubmitted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-700">Thank you for your feedback! 💚</p>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        {!isSubmitted && (
          <div className="p-3 border-t bg-white">
            <p className="text-xs text-gray-500 mb-2">Common questions:</p>
            <div className="flex flex-wrap gap-2">
              <button
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                onClick={() => handleSuggestedQuestion('How do I reset my password?')}
              >
                Reset password
              </button>
              <button
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                onClick={() => handleSuggestedQuestion('Where can I find my billing info?')}
              >
                Billing info
              </button>
              <button
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                onClick={() => handleSuggestedQuestion('How do I contact support?')}
              >
                Contact support
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white space-y-3">
          <input
            type="text"
            placeholder="Your name"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitted}
          />
          <input
            type="email"
            placeholder="Your email"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitted}
          />
          <textarea
            placeholder="How can we help you?"
            rows={3}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitted}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            disabled={isSubmitted}
          >
            Send Message
          </button>
          <p className="text-xs text-gray-400 text-center">
            Powered by SupportHub
          </p>
        </form>
      </div>
    </div>
  );
}
