# CyberDuo 🛡️

**A gamified cybersecurity learning platform** built with modern web technologies. Think Duolingo, but for real-world digital defense skills.

Learn to defend against phishing, build unbreakable passwords, secure networks, understand encryption, and protect against social engineering — all through bite-sized, engaging lessons with points, shields, leaderboards, and certificates.

**Live Demo**: [https://cyber-duo.vercel.app](https://cyber-duo.vercel.app)  


## ✨ Key Features

- 5 focused cybersecurity courses with progressive difficulty
- Gamified experience: Shields (hearts), Hack Points (XP), streaks, and practice mode
- 4 multiple-choice questions per lesson with real-world scenarios
- Leaderboard, quests, and shop system
- Clerk authentication (secure login/signup)
- Responsive design with beautiful UI using Shadcn + Tailwind
- Admin dashboard ready
- Stripe integration ready for Pro tier (unlimited shields)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI
- **Authentication**: Clerk
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Payments**: Stripe (ready for Pro tier)
- **Deployment**: Vercel

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/yumna-ux/CyberDuo.git
cd CyberDuo

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your Clerk and Neon keys

# 4. Sync database schema
npx drizzle-kit push:pg

# 5. Seed the database with cybersecurity content
npx tsx src/scripts/seed.ts

# 6. Run the app
npm run dev
Open http://localhost:3000 and start learning!
```
## 📋 Setup Requirements
Node.js 18+
Clerk account (for authentication)
Neon account (free Postgres database)
(Optional) Stripe account for Pro features

## 🚀 Deployment (Vercel)
The project is already configured for one-click deployment on Vercel.
Connect your GitHub repo to Vercel
Add the following Environment Variables in Vercel dashboard:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
DATABASE_URL
Deploy — Vercel will handle everything automatically.
Live URL: [Add your Vercel link here after deployment]

## ⭐ Show Your Support
If you like this project, please give it a ⭐ on GitHub!
It helps other developers discover it and motivates me to keep improving it.

## 🙌 Contributing
Contributions are welcome! Feel free to:
Open issues for bugs or feature requests
Submit pull requests for improvements
Suggest new cybersecurity lessons or challenges

## 📬  Contact / Feedback
Yumna Mohammed
Email: YumnaMohammedNursema1@gmail.com
Made with passion in Addis Ababa, Ethiopia ❤️
Thank you for checking out CyberDuo