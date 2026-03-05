# AI Startup Idea Generator

## Overview

The **AI Startup Idea Generator** is a full-stack web application designed to help entrepreneurs and innovators generate, manage, and refine startup ideas using artificial intelligence. The platform leverages AI to provide intelligent suggestions, feedback, and insights on startup concepts, enabling users to develop their business ideas more effectively.

## Project Description

This application combines a modern React/TypeScript frontend with a robust Node.js/Express backend to create an interactive platform for startup idea generation and management. Users can:

- **Generate Ideas**: Create new startup ideas with AI-powered suggestions
- **Manage Conversations**: Engage in AI-driven conversations to refine and develop ideas
- **Track Feedback**: Receive and manage feedback on their startup concepts
- **User Authentication**: Secure user accounts with email verification and OAuth2 integration
- **Dashboard**: View and organize all generated ideas in one place
- **Profile Management**: Manage user settings and preferences

## Key Features

- 🤖 **AI-Powered Idea Generation**: Uses AI providers to generate creative startup ideas
- 💬 **Interactive Chat**: Conversation system with AI for refining ideas
- 🔐 **Secure Authentication**: Email/password authentication with Google OAuth2 support
- 📧 **Email Verification**: Email-based account verification using Resend
- 💾 **Idea Management**: Save, edit, and organize startup ideas
- 📊 **User Dashboard**: Comprehensive dashboard to view all ideas and conversations
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- ⚡ **High Performance**: Optimized frontend with Vite and backend with Express

## Technology Stack

### Backend

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: Passport.js (Local + Google OAuth2)
- **Email**: Resend
- **Security**: Bcrypt for password hashing, JWT for tokens
- **Rate Limiting**: express-rate-limit
- **Session Management**: express-session

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (headless component library)
- **HTTP Client**: Axios
- **Routing**: React Router
- **Notifications**: Sonner (toast notifications)

## Project Structure

```
ai-startup-idea-generator/
├── backend/                      # Node.js/Express backend
│   ├── auth/                    # Authentication logic
│   ├── config/                  # Database configuration
│   ├── controllers/             # Route controllers
│   ├── middlewares/             # Custom middleware
│   ├── models/                  # Database models
│   ├── routers/                 # API routes
│   ├── services/                # Business logic
│   │   └── ai/                  # AI provider integrations
│   ├── utils/                   # Utility functions
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
│
├── frontend/                     # React/TypeScript frontend
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── ui/              # Radix UI based components
│   │   │   ├── guards/          # Route guards
│   │   │   └── figma/           # Figma-designed components
│   │   ├── pages/               # Page components
│   │   ├── providers/           # React context providers
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Utility functions
│   │   ├── styles/              # Global styles
│   │   ├── App.tsx              # Root component
│   │   └── main.tsx             # React entry point
│   └── vite.config.ts           # Vite configuration
│
└── idea.json                     # Project specification template
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- Google OAuth2 credentials (for OAuth integration)
- Resend API key (for email functionality)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ai_startup_db
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RESEND_API_KEY=your_resend_api_key
```

4. Start the development server:

```bash
npm start
```

The backend server will run on `http://localhost:5000` (or configured port)

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

The backend provides comprehensive REST API endpoints organized by modules:

Check `backend/README.md` for detailed API documentation.

## Authentication Flow

1. **Email/Password**: Traditional signup and login with email verification
2. **Google OAuth2**: Seamless login using Google accounts
3. **JWT Tokens**: Secure token-based authentication for API requests
4. **Session Management**: Express-session for maintaining user sessions

## AI Integration

The application supports multiple AI providers for idea generation and refinement:

- **HTTP Provider**: Integrates with external AI APIs (OpenAI, etc.)
- **Mock Provider**: Development/testing environment with simulated AI responses

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Rate limiting on API endpoints
- CORS protection
- Request timeout handling
- Email verification for accounts
- Secure cookie-based sessions

## Development

### Running Both Services

1. Start the backend:

```bash
cd backend
npm start
```

2. In another terminal, start the frontend:

```bash
cd frontend
npm run dev
```

### Building for Production

**Backend**: The backend runs directly with Node.js
**Frontend**: Build the frontend:

```bash
cd frontend
npm run build
```

## Contributing

This is a graduate project (Level 4, GP) by Aya Aragab. For contributions or questions, please contact the project author.

## License

ISC License - See individual package.json files for details

## Resources

- **Frontend Design**: Based on [Figma Design](https://www.figma.com/design/29tEEdIzgpMSyIMHw3zcds/AI-Startup-Idea-Generator-UI)
- **API Documentation**: See `backend/README.md` for comprehensive API documentation
- **Frontend Setup**: See `frontend/README.md` for detailed frontend instructions

## Support

For issues, feature requests, or technical support, please refer to the respective README files in the `backend/` and `frontend/` directories for detailed documentation.
