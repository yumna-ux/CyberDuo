# 📃 CyberDuo : Learn cyberwith Fun!


This project is a full-fledged CyberDuo  built with Next.js, Drizzle for data management, PostgresQL as the database, and Neon for serverless deployment. It provides a gamified and engaging platform for users to learn cybersecurity effectively.


## 💻 Technologies Used:

- Frontend: Next.js (React framework)
- Backend: Drizzle (ORM for data management)
- Database: PostgreSQL (relational database)
- Authentication: Clerk (optional for secure login/registration)
- Payments: Stripe (optional for in-app purchases)

## 💡 Features

- 🌐 Next.js 14 & server actions
- 🗣 AI Voices using Elevenlabs AI
- 🎨 Beautiful component system using Shadcn UI
- 🎭 Amazing characters thanks to KenneyNL
- 🔐 Auth using Clerk
- 🔊 Sound effects
- ❤️ Hearts system
- 🌟 Points / XP system
- 💔 No hearts left popup
- 🚪 Exit confirmation popup
- 🔄 Practice old lessons to regain hearts
- 🏆 Leaderboard
- 🗺 Quests milestones
- 🛍 Shop system to exchange points with hearts
- 💳 Pro tier for unlimited hearts using Stripe
- 🏠 Landing page
- 📊 Admin dashboard React Admin
- 🌧 ORM using DrizzleORM
- 💾 PostgresDB using NeonDB
- 📱 Mobile responsiveness

## ✏️ Requirements

Before you begin, ensure you have the following software installed on your local machine:

- Node.js and npm (or yarn): Used for managing project dependencies. Download from (https://nodejs.org/en)
- Git (optional): For version control. Download from (https://git-scm.com/downloads)



## 🛠️ Installation

1. Clone the Repository:

```bash
git clone https://github.com/yumna-ux/CyberDuo-nextjs.git
```

2. Install Dependencies:

```bash
cd CyberDuo-nextjs
npm install
```

3. Create a .env File:

- Rename .env.example to .env.
- Fill in the following environment variables with your own values:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_postgres_connection_string
STRIPE_API_KEY=your_stripe_api_key (optional)
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret (optional)
NEXT_PUBLIC_APP_URL=your_app_url (optional for custom frontend URL)
```

4. Setup Clerk Authentication

- Follow Clerk's documentation to create a project and obtain your keys (https://clerk.com/docs/quickstarts/setup-clerk).
- Replace the placeholder values in .env with your actual keys.

5. Configure Neon and Postgres

- Refer to Neon's documentation (https://neon.tech/) for setting up a serverless Postgres instance using Neon.
- Update the DATABASE_URL environment variable with your Postgres connection string.

6. Stripe Integration

- If you plan to use Stripe for in-app purchases, follow Stripe's documentation (https://docs.stripe.com/) to create an account and obtain your API keys.
- Set the STRIPE_API_KEY and STRIPE_WEBHOOK_SECRET environment variables accordingly.
- The /api/webhooks/stripe endpoint should handle Stripe webhook events (refer to Stripe's documentation for details).

## 🚀 Deployment on Vercel

1. Create a Vercel Account: Sign up for a free Vercel account at (https://vercel.com/).
2. Connect your GitHub Repository: Link your GitHub repository containing the cyberduo project to your Vercel account.
3. Import Project: Vercel will automatically detect your Next.js project and provide deployment options.
4. Configure Environment Variables: Set the required environment variables (listed in the Setup Instructions section) within Vercel's environment settings.
5. Deploy: Once configured, deploy your project to Vercel. Vercel will handle building and deploying the application.

## ⭐ Like this project?

If you find this cyberDuo  project helpful, consider giving it a star on GitHub to show your support! This helps others discover the project and motivates me to continue development.

## 🙌 Contributing

We welcome contributions from the community! Feel free to fork the repository, make changes, and create pull requests.

## 🔰 License

This project is licensed under the MIT License

## 📬 Feedback

If you have any feedback, please reach out to us at YumnaMohammedNursema1@gmail.com 
