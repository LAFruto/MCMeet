# MCMeet - Faculty Booking System

A modern, AI-powered chatbot-based booking system for student-faculty interaction with role-based access control, email notifications, and comprehensive security features.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- pnpm (recommended)

### Installation

1. **Install dependencies:**
```bash
cd frontend
pnpm install
```

2. **Set up environment variables:**

Create `.env.local` in the frontend directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mcmeet"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-min-32-characters"
BETTER_AUTH_URL="http://localhost:3000"

# SMTP Email Configuration (Optional for development)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="MCMeet <no-reply@mcmeet.app>"
```

Generate a secure auth secret:
```bash
openssl rand -base64 32
```

3. **Run database migrations:**
```bash
npx prisma migrate dev
npx prisma generate
```

4. **Create test accounts:**

First, start the dev server in one terminal:
```bash
pnpm dev
```

Then in another terminal, create the accounts:
```bash
pnpm create-accounts
```

This creates:
- **Student Account**: `student@mcmeet.dev` / `Student123!`
- **Admin Account**: `admin@mcmeet.dev` / `Admin123!`

**Important:** After creating accounts, you need to manually set the admin role:
1. Run `npx prisma studio`
2. Find the user `admin@mcmeet.dev`
3. Change `role` from `student` to `admin`
4. Save

5. **Start development server:**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login pages
│   │   ├── (dashboard)/         # Student pages (agenda, sked, faculty)
│   │   ├── (admin)/             # Admin-only pages
│   │   └── api/                 # API routes
│   ├── components/
│   │   ├── chat/                # Chat interface
│   │   └── ui/                  # Shadcn UI components
│   ├── lib/
│   │   ├── authz.ts             # Authorization helpers
│   │   ├── mailer.ts            # Email templates
│   │   ├── rate-limit.ts        # Rate limiting
│   │   └── auth.ts              # Better Auth config
│   └── hooks/                   # Custom hooks
├── prisma/
   ├── schema.prisma            # Database schema
   └── seed.ts                  # Test data seeding
```

---

## 🔐 Features

### Authentication & Authorization
- ✅ **Better Auth** integration with email/password and social providers
- ✅ **Role-Based Access Control** (Student & Admin roles)
- ✅ **Two-Factor Authentication** support
- ✅ **Password reset** via email
- ✅ **Protected routes** and API endpoints

### Email Notifications
- ✅ Password reset emails
- ✅ Booking confirmation emails
- ✅ Reschedule notifications
- ✅ Cancellation notifications

### Security
- ✅ **Rate limiting** on all API endpoints
- ✅ Session validation on all protected routes
- ✅ Role-based data filtering
- ✅ CSRF protection via Better Auth

### User Features

**Students:**
- 📅 Book meetings with faculty via chat
- 🔍 Browse faculty directory
- 📋 View personal agenda and schedule
- 📧 Receive email notifications

**Admins:**
- 👥 Manage faculty members
- 📊 View all system bookings
- ⚙️ System administration
- 🛡️ Optional 2FA for enhanced security

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Better Auth
- **UI**: Shadcn UI + Radix UI + Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Email**: Nodemailer
- **Animations**: Framer Motion

---

## 📚 Usage Examples

### Protecting a Server Component

```typescript
import { getAdminSession } from "@/lib/authz";

export default async function AdminPage() {
  const session = await getAdminSession(); // Auto-redirects non-admins
  return <div>Admin content for {session.user.name}</div>;
}
```

### Protecting an API Route

```typescript
import { auth } from "@/lib/auth";
import { canManageFaculty } from "@/lib/authz";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (!canManageFaculty(session as any)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Process request...
}
```

### Sending Email Notification

```typescript
import { sendMail, emailTemplates } from "@/lib/mailer";

const template = emailTemplates.bookingConfirmation({
  studentName: "John Doe",
  facultyName: "Dr. Smith",
  date: "2024-10-15",
  startTime: "14:00",
  endTime: "15:00",
});

await sendMail({
  to: student.email,
  subject: template.subject,
  html: template.html,
});
```

---

## 🔧 Configuration

### Environment Variables

#### Required
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Min 32 characters for session signing
- `BETTER_AUTH_URL` - App URL (with protocol)

#### Optional
- `SMTP_*` - Email configuration (required for password reset in production)
- `GOOGLE_CLIENT_ID/SECRET` - Google OAuth
- `MICROSOFT_CLIENT_ID/SECRET` - Microsoft OAuth
- `UPSTASH_REDIS_*` - Redis for production rate limiting

### Database Schema

Key models:
- **User**: Auth data with role field (`student` | `admin`)
- **Session**: User sessions
- **Account**: Social provider accounts
- **Verification**: Email verification tokens

### Authorization Helpers

Located in `src/lib/authz.ts`:

```typescript
isAdmin(session)                    // Check if admin
isStudent(session)                  // Check if student
canBookFor(session, studentId)      // Check booking permission
canManageFaculty(session)           // Check faculty management permission
getRequiredSession()                // Get session or redirect
getAdminSession()                   // Get admin session or redirect
```

### Rate Limits

- **Chat API**: 60 requests/minute
- **Booking API**: 10 requests/minute
- **Auth API**: 5 requests/minute

Development uses in-memory store. Production should use Redis (Upstash recommended).

---

## 🚀 Deployment

### Prerequisites
1. PostgreSQL database (Vercel Postgres, Supabase, Railway)
2. SMTP credentials configured
3. Environment variables set

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variables in Vercel dashboard.

### Production Checklist
- [ ] Set `requireEmailVerification: true` in Better Auth config
- [ ] Configure production database
- [ ] Set up SMTP for emails
- [ ] Configure Redis for rate limiting (optional but recommended)
- [ ] Set strong `BETTER_AUTH_SECRET`
- [ ] Enable HTTPS
- [ ] Test email delivery
- [ ] Test authentication flows

---

## 🐛 Troubleshooting

### Emails Not Sending
- Verify SMTP credentials in `.env.local`
- For Gmail: Use App Password, not regular password
- Check console logs for errors

### Permission Denied
- Verify user role in database (`npx prisma studio`)
- Check session is passed correctly to auth helpers
- Ensure migrations are up to date

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database is running and accessible
- Run migrations: `npx prisma migrate dev`

### Rate Limit Always Exceeded
- In development, limits reset on server restart
- Clear server cache and restart
- Adjust limits in `src/lib/rate-limit.ts` if needed

---

## 📄 API Reference

### GET /api/bookings
Get user bookings (students see own, admins see all)

**Auth**: Required  
**Rate Limit**: 10/min

### POST /api/bookings
Create a new booking

**Auth**: Required  
**Rate Limit**: 10/min  
**Body**:
```json
{
  "studentId": "string",
  "facultyId": "number",
  "date": "YYYY-MM-DD",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "purpose": "string"
}
```

### POST /api/chat
Send chat message

**Auth**: Required  
**Rate Limit**: 60/min  
**Body**:
```json
{
  "message": "string",
  "context": "object"
}
```

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review console logs
3. Verify environment variables
4. Check database migrations

---

## 📝 License

Private - All Rights Reserved

---

## 🎓 Resources

- [Better Auth Docs](https://better-auth.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://prisma.io/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
