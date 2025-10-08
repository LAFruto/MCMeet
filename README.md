# MCMeet - AI-Powered Faculty Booking System

Modern faculty booking system with AI-powered chat interface for seamless student-faculty interaction.

## Features

- 🤖 **AI Chat Agent** - Natural language booking via N8N + Ollama
- 📅 **Smart Scheduling** - Intelligent faculty availability management
- 👥 **Role-Based Access** - Student, Faculty, and Admin roles
- 🔐 **Secure Authentication** - Better Auth with session management
- 📊 **Real-time Updates** - React Query for optimal data synchronization
- 🎨 **Modern UI** - Shadcn/UI with Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: Shadcn/UI + Radix UI + Tailwind CSS
- **State**: Zustand + React Query
- **Auth**: Better Auth
- **Database**: Prisma + PostgreSQL

### Backend (AI Agent)
- **Workflow**: N8N
- **LLM**: Ollama (Llama 3.2)
- **Vector Store**: Qdrant
- **Database**: PostgreSQL

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Installation

1. **Clone & Install:**
```bash
git clone https://github.com/YOUR_USERNAME/MCMeet.git
cd MCMeet
pnpm install
```

2. **Setup Database:**
```bash
# Frontend uses PostgreSQL at localhost:5433
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

3. **Configure Environment:**
```bash
# Create frontend/.env.local
DATABASE_URL="postgresql://postgres:123@localhost:5433/mcmeet"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_N8N_WEBHOOK_URL="http://localhost:5678/webhook/chat-agent"
```

4. **Start N8N Backend:**
```bash
cd backend

# Start essential services (recommended)
docker compose up postgres n8n -d

# OR start with AI support (optional)
docker compose --profile ai up -d

# Access N8N at http://localhost:5678
```

**Troubleshooting:** If you get port conflicts:
```bash
docker compose down
docker network prune -f
docker compose up postgres n8n -d
```

5. **Start Frontend:**
```bash
pnpm dev
# Access app at http://localhost:3000
```

## Project Structure

```
MCMeet/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/# React components
│   │   ├── lib/       # Services, hooks, utils
│   │   └── prisma/    # Database schema
│   └── package.json
│
└── backend/           # N8N AI workflow
    ├── docker-compose.yml
    ├── n8n/           # N8N configuration
    └── shared/        # Shared files with N8N
```

## Development

```bash
# Run frontend dev server
pnpm dev

# Database commands
pnpm db:migrate    # Run migrations
pnpm db:generate   # Generate Prisma client
pnpm db:studio     # Open Prisma Studio
pnpm db:seed       # Seed database

# Create test accounts
pnpm create-accounts

# Type checking
pnpm type-check
```

## N8N Workflow Setup

1. Open http://localhost:5678
2. Create N8N account
3. Configure credentials:
   - PostgreSQL: `host.docker.internal:5432`
   - Ollama: `http://ollama:11434`
4. Activate the AI agent workflow
5. Test webhook: `http://localhost:5678/webhook/chat-agent`

See [backend/README.md](backend/README.md) for detailed N8N setup.

## Troubleshooting

### Common Issues

**Port 5678 already in use:**
```bash
cd backend
docker compose down
docker network prune -f
docker compose up postgres n8n -d
```

**Database connection issues:**
- Ensure PostgreSQL is running: `docker ps`
- Check connection string in `.env.local`
- Use `localhost:5433` for frontend, `host.docker.internal:5432` for N8N

**N8N not responding:**
- Check if container is running: `docker ps`
- View logs: `docker logs n8n -f`
- Access N8N at http://localhost:5678

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Next.js   │────▶│ N8N Webhook  │────▶│  AI Agent   │
│  Frontend   │     │              │     │  + Ollama   │
└─────────────┘     └──────────────┘     └──────┬──────┘
      │                                          │
      │              ┌──────────────┐            │
      └─────────────▶│  PostgreSQL  │◀───────────┘
                     │   Database   │
                     └──────────────┘
```

## Key Technologies

- **Next.js 15**: App Router, Server Components, Server Actions
- **Better Auth**: Modern authentication with session management
- **Prisma**: Type-safe database ORM
- **React Query**: Server state management
- **Zustand**: Client state management
- **N8N**: Low-code workflow automation
- **Ollama**: Local LLM inference
- **Shadcn/UI**: High-quality UI components

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with test data |
| `pnpm create-accounts` | Create test user accounts |

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/).

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
