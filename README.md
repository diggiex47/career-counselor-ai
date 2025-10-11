# AI Career Counselor

A modern, AI-powered career counseling chat application built with Next.js, TypeScript, and tRPC. Get personalized career guidance, explore opportunities, and plan your professional journey with the help of advanced AI.

## 🚀 Features

### Core Functionality
- **AI-Powered Career Counseling**: Intelligent conversations with Google Gemini AI
- **Chat Session Management**: Create, manage, and continue multiple chat sessions
- **Message Persistence**: All conversations are saved and can be resumed anytime
- **Real-time Interactions**: Smooth, responsive chat interface with typing indicators
- **Auto-generated Session Names**: AI automatically creates meaningful titles for your chats

### Advanced Features
- **GitHub Authentication**: Secure sign-in with GitHub OAuth
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Optimized for desktop and mobile devices
- **Enhanced UI/UX**: Beautiful animations, gradients, and modern design
- **Message Status Indicators**: See delivery status of your messages
- **Session Management**: Delete unwanted conversations, organize your chat history

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **tRPC** - End-to-end typesafe APIs
- **TanStack Query** - Powerful data fetching and caching
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Robust relational database
- **NextAuth.js** - Authentication for Next.js

### AI Integration
- **Google Gemini API** - Advanced AI for career counseling
- **Custom AI Service** - Tailored prompts and response handling

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)
- **GitHub OAuth App** (for authentication)
- **Google Gemini API Key** (for AI functionality)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-career-counselor
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/career_counselor"

# NextAuth.js
AUTH_SECRET="your-auth-secret-here"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# AI Service
GEMINI_API_KEY="your-gemini-api-key"

# Node Environment
NODE_ENV="development"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio to view your data
npx prisma studio
```

### 5. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to your `.env` file

### 6. Google Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add the API key to your `.env` file as `GEMINI_API_KEY`

### 7. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat interface
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── theme-provider.tsx # Theme management
├── lib/                   # Utility functions
├── server/               # Backend logic
│   ├── api/              # tRPC routers
│   ├── auth/             # Authentication config
│   └── services/         # Business logic
└── styles/               # Global styles
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run typecheck    # Run TypeScript checks
npm run format:check # Check code formatting
npm run format:write # Format code with Prettier
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Environment Variables**:
   Add all environment variables from your `.env` file to Vercel:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GEMINI_API_KEY`

4. **Database Setup**:
   - Use [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [PlanetScale](https://planetscale.com/)
   - Update `DATABASE_URL` with your production database URL
   - Run `npx prisma db push` to set up the schema

5. **Update GitHub OAuth**:
   - Add your Vercel domain to GitHub OAuth settings
   - Callback URL: `https://your-app.vercel.app/api/auth/callback/github`

## 🎯 Usage

### Starting a Conversation
1. Sign in with your GitHub account
2. Click "New Chat" to start a conversation
3. Ask about career goals, job searching, skill development, or any professional challenges

### Managing Chats
- **View History**: All your previous conversations are saved in the sidebar
- **Continue Conversations**: Click on any previous chat to continue where you left off
- **Delete Chats**: Hover over a chat and click the delete button to remove it
- **Auto-naming**: The AI automatically generates meaningful names for your conversations

### AI Capabilities
The AI career counselor can help with:
- Career path exploration and planning
- Job search strategies and interview preparation
- Skill development recommendations
- Workplace challenges and professional growth
- Industry insights and market trends
- Resume and LinkedIn profile optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **T3 Stack** - For the excellent full-stack TypeScript template
- **Vercel** - For seamless deployment and hosting
- **Google** - For the powerful Gemini AI API
- **GitHub** - For authentication and code hosting
- **Prisma** - For the amazing database toolkit

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/your-username/ai-career-counselor/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your setup and the issue

---

**Built with ❤️ using the T3 Stack and modern web technologies**