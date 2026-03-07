# SupportHub User Manual

## Introduction
SupportHub is an AI-powered customer support ticket system with chatbot, auto-summarization, and sentiment analysis. Designed to help support teams manage tickets efficiently and provide better customer experiences.
### Key Features
- **AI-Powered Ticket Management** - Automatic categorization, summarization, and sentiment analysis
- **Real-time Chat Widget** - Embeddable support widget for your website
- **Agent Performance Tracking** - Monitor team and individual metrics
- **Smart Auto-Assignment** - Rules to automatically route tickets to the right agents
- **Customer Rating System** - Collect feedback after ticket resolution
- **Integration Ready** - Works with Slack, email, and webhooks
### System Requirements
- **Web browser** with JavaScript enabled
- **Internet connection**
- **Screen resolution** 1024x768 (recommended)
### Target Audience
- **Support Agents** - Managing tickets and responding to customers
- **Administrators** - Managing teams, settings, and performance
- **Developers** - Integrating the support widget
- **Customer Success** - Using the support widget
---
## Getting Started
### Login
1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter your credentials:
   - **Email:** `admin@example.com`
   - **Password:** `admin123`
3. Click "Sign In"

> **Note:** These are demo credentials. Change them in production.
### Dashboard Overview
After logging in, you'll see the main dashboard, which displays:
- **Open Tickets** - Number of currently open tickets
- **Average Response Time** - Team's average response time
- **Resolution Rate** - Percentage of tickets resolved
- **Sentiment** - Overall customer sentiment (positive %)
- **Volume Trends** - Ticket volume over the past 7 days
- **Recent Tickets** - Latest 5 tickets requiring attention
- **Quick Actions** - Shortcuts to common tasks
- **Sign Out** - Click your avatar in the top right, select "Sign Out"
---
## Ticket Management
### Tickets List
Access the tickets list from the sidebar: **Dashboard** > **Tickets** or directly with `/dashboard/tickets`.
#### Filtering Options
- **Search** - Search by ticket subject, customer name, or content
- **Status Filter** - Filter by: Open, In Progress, Waiting, Resolved, Closed
- **Priority Filter** - Filter by: Urgent, High, Medium, Low
- **Sentiment Filter** - Filter by: Positive, Neutral, Negative
- **Pagination** - Navigate through pages of 10 tickets each
#### Actions
- **New Ticket** - Create a new ticket manually
- **Click ticket row** - View ticket details

![Tickets List Screenshot Placeholder](./docs/screenshots/tickets-list.png)
### Ticket Detail View
Click on any ticket to open the detail view with:
#### Main Components
- **Header** - Ticket subject, ID, creation date
- **Action Buttons**:
  - **AI Summarize** - Generate an AI summary
  - **Suggest Reply** - Get AI reply suggestions
- **Message Thread** - All messages between customer and agents
- **Reply Input** - Rich text editor for composing responses
- **AI Summary Card** - Shows AI-generated summary with:
  - Sentiment badge (Positive, Neutral, Negative)
  - Category tag (e.g., Billing, Technical)
- **Ticket Sidebar** - Contains:
  - **Customer Info** - Name, email, ticket count
  - **Status Selector** - Change ticket status
  - **Priority Selector** - Change priority level
  - **Assignee Selector** - Assign or reassign ticket
  - **Close Ticket** - Mark ticket as closed
#### Status Workflow
Tickets follow a standard workflow:
```
OPEN → IN_PROGRESS → WAITING → RESOLVED → CLOSED
```
Status colors indicate the current state:
- 🔵 **Open** (Blue) - New ticket, not yet assigned
- 🟣 **In Progress** (Purple) - Agent is actively working
- 🟠 **Waiting** (Orange) - Awaiting customer response
- 🟢 **Resolved** (Green) - Issue resolved
- ⚫ **Closed** (Gray) - Ticket closed
#### Priority Levels
- 🔴 **Urgent** - Immediate attention required
- 🟠 **High** - Important but not urgent
- 🟡 **Medium** - Normal priority
- 🔵 **Low** - Can wait
![Ticket Detail Screenshot Placeholder](./docs/screenshots/ticket-detail.png)
### AI Features
#### AI Summarization
Click **AI Summarize** button to generate an intelligent summary of the ticket conversation.
- Extracts key points and concerns
- Provides a concise overview
- Identifies action items
- Saves time reviewing lengthy threads
#### Reply Suggestions
Click **Suggest Reply** to generate AI reply suggestions:
- Professional, contextual responses
- Based on ticket history and sentiment
- Can be edited before sending
- Helps maintain consistent communication tone
![AI Features Screenshot Placeholder](./docs/screenshots/ai-features.png)
---
## Customer Management
### Customer List
Access from the sidebar: **Dashboard** > **Customers** or directly with `/dashboard/customers`.
#### Features
- **Search** - Find customers by name or email
- **Customer Cards** - Grid view showing:
  - Customer name and email
  - Ticket count
  - Last interaction date
- **Pagination** - Navigate through pages of 12 customers each
#### Actions
- **Add Customer** - Create new customer record
- **Click customer card** - View customer details
![Customers List Screenshot Placeholder](./docs/screenshots/customers-list.png)
### Customer Detail View
Click on any customer to view their details including:
- Contact information (name, email)
- Ticket history
- Sentiment trends
- Quick actions (create ticket, view tickets)
![Customer Detail Screenshot Placeholder](./docs/screenshots/customer-detail.png)
---
## Performance Metrics
Access performance metrics from the sidebar: **Dashboard** > **Performance**.
### Team Overview
The Performance page shows team-wide statistics:
- **Team Avg Response** - Average response time in hours
- **Team Resolution Rate** - Percentage of resolved tickets
- **Tickets Resolved** - Total resolved this week
- **Customer Satisfaction** - Average rating from customers
### Time Filters
Switch between different time periods:
- **This Week** (default)
- **This Month**
- **This Quarter**
### Leaderboard
The Top Performers section shows
- Agent rankings (1st, 2nd, 3rd place)
- Resolution rates
- Visual badges for top performer
### Performance Comparison
Horizontal bar chart comparing agents by
- Tickets resolved
- Response time
- Satisfaction rating
### Individual Agent Cards
Detailed metrics for each agent
- **Avg Response Time** - Average response time in hours
- **Resolution Rate** - Percentage of assigned tickets resolved
- **Rating** - Customer satisfaction score
- **Top Performer Badge** - Highlighted for the highest performer
![Performance Page Screenshot Placeholder](./docs/screenshots/performance.png)
---
## Settings
Access settings from the sidebar: **Dashboard** > **Settings**.
### General Tab
#### Team Information
- **Team Name** - Update your team's display name
- **Team Logo** - Upload a custom logo (coming soon)
#### Workflow Configuration
View ticket status transitions
```
Open → In Progress → Waiting → Resolved → Closed
```
All transitions are enabled by default.
#### Auto-Assignment Rules
Automatically route tickets to the right agents based on conditions:
##### Adding a Rule
1. Click **Add Rule** button
2. Select a condition:
   - **Urgent** - Route urgent tickets
   - **High Priority** - Route high priority tickets
   - **Billing** - Route billing-related tickets
   - **Technical** - Route technical support tickets
   - **Unassigned** - Distribute unassigned tickets (round-robin)
3. Choose assignment method:
   - **Direct** - Assign to specific agent
   - **Round Robin** - Distrib evenly among team
4. Click **Add** to create the rule
##### Managing Rules
- View existing rules with conditions and assignments
- **Delete** rules that are no longer needed (click trash icon)
- Rules are evaluated top-to-bottom based on creation order
![Settings Screenshot Placeholder](./docs/screenshots/settings.png)
### Team Tab
Manage team members and their roles (coming soon)
### Integrations Tab
Connect external services (coming soon)
### Notifications Tab
Configure notification preferences (coming soon)
---
## Widget Integration
### Overview
The SupportHub widget allows customers to contact your support team directly from your website.
### Integration Methods
#### JavaScript Embed (Recommended)
The most flexible integration method. Creates a floating chat button in the bottom-right corner.
```html
<!-- SupportHub Widget -->
<script src="https://your-domain.com/widget/embed.js" data-team-id="your-team-id"></script>
```
#### Configuration Options
Add these attributes to customize the widget:
| Attribute | Values | Default |
|--- |---|---|
| `data-position` | `left` or `right` | Widget position |
| `data-theme` | `light` or `dark` | Color theme |
| `data-color` | `#3b82f6` | Primary color (hex) |
| `data-title` | `Support Chat` | Widget title |
| `data-greeting` | `Hi! How can we help you?` | Welcome message |
#### JavaScript API
Control the widget programmatically
```javascript
// Open the widget
SupportHub.open();

// Close the widget
SupportHub.close();

// Toggle the widget
SupportHub.toggle();

// Check if widget is open
if (SupportHub.isOpen()) {
  console.log('Widget is open');
}
```
#### Iframe Embed
Alternative method for embedding directly
```html
<iframe
  src="https://your-domain.com/widget/your-team-id"
  width="380"
  height="600"
  frameborder="0"
></iframe>
```
### Widget Demo Page
Access the widget integration guide from the sidebar: **Dashboard** > **Widget Demo**.
#### Features
- **Embed Code** - Copy integration code
- **Configuration Options** - View all available options
- **JavaScript API** - API documentation
- **Live Preview** - Test the widget directly
- **Floating Button Test** - Test the floating button
![Widget Demo Screenshot Placeholder](./docs/screenshots/widget-demo.png)
---
## Customer Widget
### Accessing the Widget
Customers access the widget from any page with the widget ID in the URL. Examples
- `https://your-domain.com/widget/your-team-id`
- Or directly via the floating button.
### Widget Interface
#### Main Components
- **Header** - Shows team name and status indicator
- **Welcome Message** - Greeting from the team
- **Message Form** - Input fields for:
  - Name (required)
  - Email (required)
  - Message (required)
- **Suggested Questions** - Common questions to quick-fill
- **Chat Area** - Shows conversation history
### Creating a Ticket
1. Fill in the name, email, and message
2. Click **Send Message**
3. System creates a ticket and shows confirmation message
4. Displays ticket ID (e.g., T-ABC123)
### After Resolution
1. When the widget polls for ticket status every 10 seconds
2. When resolved/closed, a **Rating prompt** - 5-star rating system appears
3. **Submit Rating** - Save rating and optional feedback
4. Customer receives thank you message
![Customer Widget Screenshot Placeholder](./docs/screenshots/customer-widget.png)
### Rating System
After a ticket is resolved, customers can rate their experience
- **1-5 star rating** system
- Optional feedback text
- **Rating prompt** appears automatically** when ticket status changes to RESOLVED/CLOSE
- Ratings are stored in browser for returning customers
- **Suggested Questions** - Quick-fill common questions
  - "Reset password"
  - "Billing info"
  - "Contact support"
- **Type your message** to quick-fill the input
- **Stars** - 1-5 stars (hover to interact)
- **Comment** (optional) - Add additional feedback
- **Submit** - Submit the rating
- **Thank you message** - Confirmation after submission
---
## Tips and Best Practices
### For Support Agents
- **Respond quickly** - Aim to reply within 24 hours when possible
- **Use AI features** - Leverage summarization and reply suggestions to save time
- **Prioritize tickets** - Focus on urgent and high-priority items first
- **Keep customers informed** - Let customers know the status of their tickets
- **Document everything** - Keep notes and resolutions in the system
- **Use sentiment analysis** - Monitor sentiment trends to adjust your approach
- **Close resolved tickets** - Ensure all issues are fully resolved
- **Follow up on customers** - Ensure customer satisfaction
### For Administrators
- **Set up auto-assignment rules** - Distribute workload evenly
- **Monitor performance metrics** - Use the Performance page to track team efficiency
- **Configure integrations** - Connect Slack, email notifications
- **Review settings regularly** - Especially team name and auto-assignment rules
- **Use the demo environment** - Test new features with demo data
- **Back up data** - Export customer and ticket data for reports
### For Developers
- **Use the widget demo page** to get your correct embed code
- **Test the widget** - Different position, color themes before integrating
- **Customize the widget** in `public/widget/embed.js` before deployment
- **Ensure your team ID is in the script matches your production environment
- **Use HTTPS** for secure connections in production
- **Consider rate limiting** - Widget has a maximum width of 400px for mobile screens
- **Test thoroughly** - Test all features with different accounts and user types before deployment
---
## Troubleshooting
### Common Issues
| Issue | Solution |
|------|-----|
| Can't log in | Check browser console (F12 > Developer tools) |
| Page not loading | Check internet connection |
| Ticket not showing up | Verify database connection with `npx prisma db push` |
| Check team ID | Check if user has proper permissions |
| Clear browser cache/cookies |
| "Failed to create ticket" | Ensure all required fields are filled (name, email, message) |
| "Invalid credentials" | Check your email and password |
| "Widget not loading" | Verify the script is loaded correctly and the team ID is valid |
| "AI features not working" | Verify that Groq API key is set up in `.env` file |
| "Customer not found" | This is a valid customer ID or or the ticket ID |
| "Unauthorized access" | Log out and back in, click "Sign In" |
| "Page not found" | The requested page or resource doesn't exist |
| "Server error" | Try again later. Contact support if the issue persists
---
## Support
For questions or issues, visit the [GitHub repository](https://github.com/anthropics/supporthub/issues)
- Check the [documentation](https://supporthub.com/docs)
- Email: support@supporthub.com

---
## Document Information
This document provides comprehensive documentation for all features of the Customer Support Dashboard system.
