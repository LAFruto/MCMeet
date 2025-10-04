# Contributing to MCMeet

Thank you for considering contributing to MCMeet! 🎉

## 📋 Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/MCMeet.git`
3. Install dependencies: `pnpm install`
4. Set up environment variables (see README.md)
5. Run migrations: `pnpm db:migrate`
6. Start development server: `pnpm dev`

## 🏗️ Project Structure

```
MCMeet/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages & API routes
│   │   ├── components/      # React components
│   │   │   ├── ui/          # shadcn UI components
│   │   │   └── chat/        # Chat-specific components
│   │   └── lib/
│   │       ├── services/    # API services
│   │       ├── stores/      # Zustand stores
│   │       ├── hooks/       # Custom React hooks
│   │       └── utils/       # Utility functions
│   ├── prisma/              # Database schema & migrations
│   └── public/              # Static assets
├── package.json             # Workspace root
└── README.md                # Project documentation
```

## 🎯 Coding Standards

We follow strict coding standards defined in `frontend/.cursorrules`:

### General Rules
- ✅ Use TypeScript for all code
- ✅ Prefer functional programming over classes
- ✅ Use `interface` instead of `type` for object types
- ✅ Minimize `'use client'` directives (prefer Server Components)

### Naming Conventions
- ✅ Components: `PascalCase` (e.g., `UserProfile.tsx`)
- ✅ Utilities: `kebab-case` (e.g., `format-date.ts`)
- ✅ Hooks: `use-` prefix (e.g., `use-bookings.ts`)
- ✅ Constants: `SCREAMING_SNAKE_CASE`

### Component Structure
```tsx
// 1. Imports (React first, then third-party, then local)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

// 3. Component (functional, with proper typing)
export function MyComponent({ title, onSubmit }: MyComponentProps) {
  // Component logic
  return <div>{title}</div>;
}
```

### UI Guidelines
- Use **shadcn UI** components for consistency
- Follow **dark/light mode** support patterns
- Use **Tailwind CSS** for styling
- No green colors (use red instead per project preference)
- 24-hour time format (no AM/PM)

## 🔄 Git Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the coding standards
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   pnpm dev                # Test in development
   pnpm type-check         # Check TypeScript
   pnpm build              # Test production build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add user profile page"
   ```

   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code restructuring
   - `test:` - Tests
   - `chore:` - Maintenance

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

## 🧪 Testing Checklist

Before submitting a PR, ensure:

- [ ] Code follows the `.cursorrules` standards
- [ ] TypeScript has no errors (`pnpm type-check`)
- [ ] Application builds successfully (`pnpm build`)
- [ ] Changes work in both dark and light mode
- [ ] Tested with both student and admin roles (if applicable)
- [ ] No console errors or warnings
- [ ] Mobile responsive (if UI changes)

## 📝 PR Guidelines

- Provide a clear description of changes
- Reference any related issues
- Include screenshots for UI changes
- Keep PRs focused (one feature/fix per PR)
- Update documentation if needed

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: What happened vs what should happen
2. **Steps to reproduce**: Detailed steps
3. **Environment**: OS, browser, Node version
4. **Screenshots**: If applicable
5. **Error logs**: Console errors or stack traces

## 💡 Feature Requests

We welcome feature suggestions! Please:

1. Check if the feature already exists
2. Describe the use case
3. Explain the expected behavior
4. Consider implementation complexity

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Docs](https://better-auth.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## ❓ Questions?

Feel free to:
- Open an issue
- Start a discussion
- Reach out to maintainers

Thank you for contributing! 🙌

