# 🚀 Publishing MCMeet to GitHub

Quick guide to get your project on GitHub!

## 📋 Prerequisites

- Git installed on your computer
- GitHub account created
- Project is ready to publish

## 🔧 Step 1: Initialize Git (if not done)

```bash
# From the MCMeet root directory
git init
```

## 📝 Step 2: Create Initial Commit

```bash
# Add all files
git add .

# Create first commit
git commit -m "feat: initial commit - MCMeet faculty booking system"
```

## 🌐 Step 3: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon in the top right
3. Select **New repository**
4. Fill in:
   - **Repository name**: `MCMeet`
   - **Description**: "Modern faculty booking system with AI-powered chat interface"
   - **Visibility**: Public or Private (your choice)
   - **Do NOT initialize with README** (we already have one)
5. Click **Create repository**

## 🔗 Step 4: Connect to GitHub

After creating the repo, GitHub will show you commands. Run these:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/MCMeet.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username!

## ✅ Step 5: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files!
3. Check that your README displays correctly

## 🔒 Step 6: Protect Sensitive Files

Verify these files are **NOT** uploaded (they're in `.gitignore`):

- ❌ `frontend/.env` (environment variables)
- ❌ `frontend/node_modules/` (dependencies)
- ❌ `frontend/.next/` (build files)

If you see any of these, **immediately**:

```bash
# Remove from git
git rm --cached frontend/.env
git commit -m "fix: remove sensitive files"
git push
```

Then reset your secrets (database password, API keys, etc.)

## 📚 Step 7: Update README

Update the `README.md` with your actual GitHub username:

```bash
# Replace YOUR_USERNAME in README.md and package.json
# Then commit
git add .
git commit -m "docs: update repository links"
git push
```

## 🌿 Step 8: Create Branches (Optional)

For organized development:

```bash
# Create development branch
git checkout -b develop
git push -u origin develop

# Set develop as default branch on GitHub:
# Settings > Branches > Default branch > Switch to develop
```

## 🔄 Daily Workflow

```bash
# Make changes to your code...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add booking confirmation email"

# Push to GitHub
git push
```

## 🎯 Commit Message Format

Use conventional commits:

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve login bug"
git commit -m "docs: update README"
git commit -m "style: format code"
git commit -m "refactor: restructure auth logic"
git commit -m "perf: optimize database queries"
git commit -m "test: add unit tests"
git commit -m "chore: update dependencies"
```

## 🚨 Common Issues

### Issue: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/MCMeet.git
```

### Issue: "failed to push some refs"

```bash
# Pull first
git pull origin main --rebase

# Then push
git push origin main
```

### Issue: "Permission denied"

Use Personal Access Token instead of password:
1. GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic)
3. Use token as password when prompted

Or set up SSH keys:
1. Follow: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## 📦 Next Steps After Publishing

1. **Add GitHub Actions** (optional)
   - Automated testing
   - Automated deployment

2. **Add Badges to README** (optional)
   ```markdown
   ![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/MCMeet)
   ![License](https://img.shields.io/github/license/YOUR_USERNAME/MCMeet)
   ```

3. **Enable GitHub Features**
   - Issues (bug tracking)
   - Discussions (community)
   - Wiki (documentation)
   - Projects (task management)

4. **Set up Branch Protection** (recommended)
   - Settings > Branches > Add rule
   - Require pull request reviews
   - Require status checks

## 🎉 You're Done!

Your project is now on GitHub! Share the link:
```
https://github.com/YOUR_USERNAME/MCMeet
```

## 🔗 Useful Links

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/)

