/**
 * SupportHub Widget Embed Script
 * Include this script on your website to add the support chat widget
 *
 * Usage:
 * <script src="https://your-domain.com/widget/embed.js" data-team-id="your-team-id"></script>
 */

(function() {
  'use strict';

  // Get configuration from script tag
  const script = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const config = {
    teamId: script.getAttribute('data-team-id') || '',
    position: script.getAttribute('data-position') || 'right', // 'left' or 'right'
    theme: script.getAttribute('data-theme') || 'light',
    primaryColor: script.getAttribute('data-color') || '#3b82f6',
    title: script.getAttribute('data-title') || 'Support Chat',
    greeting: script.getAttribute('data-greeting') || 'Hi there! How can I help you?',
    buttonText: script.getAttribute('data-button-text') || 'Chat with us',
  };

  if (!config.teamId) {
    console.error('SupportHub Widget: data-team-id is required');
    return;
  }

  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'supporthub-widget';
  widgetContainer.className = 'sh-widget-container sh-position-' + config.position;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'sh-widget-iframe';
  iframe.className = 'sh-widget-iframe';
  iframe.src = new URL(
    '/widget/' + config.teamId + '?theme=' + config.theme,
    window.location.origin
  ).href;
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('allow', 'forms; submissions');

  // Create toggle button
  const button = document.createElement('button');
  button.id = 'sh-widget-button';
  button.className = 'sh-widget-button';
  button.setAttribute('aria-label', 'Toggle chat widget');
  button.innerHTML = '<svg class="sh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';

  let isOpen = false;

  button.addEventListener('click', function() {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.classList.add('sh-open');
      button.classList.add('sh-open');
      button.innerHTML = '<svg class="sh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    } else {
      iframe.classList.remove('sh-open');
      button.classList.remove('sh-open');
      button.innerHTML = '<svg class="sh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    }
  });

  // Append elements to container
  widgetContainer.appendChild(iframe);
  widgetContainer.appendChild(button);

  // Add to page
  document.body.appendChild(widgetContainer);

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .sh-widget-container {
      position: fixed;
      bottom: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }
    .sh-position-left {
      left: 20px;
    }
    .sh-position-right {
      right: 20px;
    }
    .sh-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, ${config.primaryColor} 0%, #8b5cf6 100%);
    }
    .sh-widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
    }
    .sh-widget-button .sh-icon {
      width: 28px;
      height: 28px;
      color: white;
    }
    .sh-widget-button.sh-open {
      transform: rotate(90deg);
    }
    .sh-widget-iframe {
      position: absolute;
      bottom: 80px;
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 120px);
      border: none;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
      background: white;
    }
    .sh-position-left .sh-widget-iframe {
      left: 0;
    }
    .sh-position-right .sh-widget-iframe {
      right: 0;
    }
    .sh-widget-iframe.sh-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    @media (max-width: 480px) {
      .sh-widget-iframe {
        width: calc(100vw - 40px);
        max-width: 380px;
      }
      .sh-widget-container {
        left: 20px !important;
        right: 20px !important;
      }
    }
  `;

  document.head.appendChild(style);

  // Listen for messages from iframe
  window.addEventListener('message', function(event) {
    if (event.data.type === 'supporthub:open') {
      if (!isOpen) button.click();
    } else if (event.data.type === 'supporthub:close') {
      if (isOpen) button.click();
    }
  });

  // Expose API on window
  window.SupportHub = {
    open: function() {
      if (!isOpen) button.click();
    },
    close: function() {
      if (isOpen) button.click();
    },
    toggle: function() {
      button.click();
    },
    isOpen: function() {
      return isOpen;
    }
  };

  console.log('SupportHub Widget loaded');
})();
