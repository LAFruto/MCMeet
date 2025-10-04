# MCMeet

A modern faculty booking system built with Next.js, Better Auth, and Prisma.

## 🚀 Features

- **Smart Chat Interface** - AI-powered assistant to help with bookings
- **Faculty Management** - Browse and book appointments with faculty members
- **Role-Based Access Control** - Student and Admin roles with different permissions
- **Secure Authentication** - Email/password with optional 2FA, social logins (Google, Microsoft)
- **Real-time Updates** - Modern, responsive UI with optimistic updates
- **Schedule Management** - View and manage your meetings and availability

## 📁 Project Structure

```
MCMeet/
└── frontend/          # Next.js application
    ├── src/
    │   ├── app/       # App router pages
    │   ├── components/# React components
    │   └── lib/       # Utilities, services, stores
    ├── prisma/        # Database schema & migrations
    └── public/        # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Shadcn UI, Radix UI, Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Email**: Nodemailer
- **Rate Limiting**: Upstash Redis

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/MCMeet.git
   cd MCMeet
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   pnpm setup
   ```

3. **Set up environment variables**
   ```bash
   cd frontend
   cp .env.example .env
   ```
   
   Fill in your `frontend/.env` file with:
   - Database connection URL
   - Better Auth secret and URL
   - OAuth credentials (optional)
   - SMTP settings (optional)
   - Upstash Redis credentials (optional)

4. **Set up the database**
   ```bash
   cd ..  # Back to root
   pnpm db:migrate
   pnpm db:generate
   ```

5. **Create test accounts**
   ```bash
   # Start dev server in one terminal
   pnpm dev
   
   # In another terminal, create accounts
   pnpm create-accounts
   ```
   
   Then manually set the admin role in Prisma Studio:
   ```bash
   pnpm db:studio
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

### Available Commands (from root)

```bash
# Development
pnpm dev                # Start dev server
pnpm build              # Build for production
pnpm start              # Start production server

# Database
pnpm db:migrate         # Run migrations
pnpm db:generate        # Generate Prisma client
pnpm db:studio          # Open Prisma Studio
pnpm db:seed            # Seed database

# Setup
pnpm setup              # Install + generate Prisma
pnpm create-accounts    # Create test accounts

# Utilities
pnpm type-check         # TypeScript check
pnpm clean              # Clean build files
```

## 🔐 Test Accounts

After running `pnpm create-accounts`:

- **Student**: `student@mcmeet.dev` / `Student123!`
- **Admin**: `admin@mcmeet.dev` / `Admin123!` (set role in database)

## 📚 Documentation

For detailed documentation, see:
- [Frontend README](./frontend/README.md) - Complete setup and API docs
- [Better Auth Setup](./frontend/BETTER_AUTH_SETUP.md) - Authentication configuration
- [Environment Variables](./frontend/ENVIRONMENT_VARIABLES.md) - All env vars explained

## 🏗️ Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set Root Directory to `frontend`
4. Add environment variables
5. Deploy!

### Other Platforms

Set the build settings:
- **Root Directory**: `frontend`
- **Build Command**: `pnpm build` or `npm run build`
- **Output Directory**: `frontend/.next`
- **Install Command**: `pnpm install` or `npm install`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Your Name - [@yourhandle](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Built with [Better Auth](https://better-auth.com)
- UI components from [Shadcn UI](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

