<div align="center">
<img width="1200" height="475" alt="Banolite Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Banolite - Digital Knowledge Platform
**Your hub for premium digital products, courses, and coaching.**
</div>

## 🚀 Overview

Banolite is a comprehensive digital marketplace and knowledge platform designed for creators, authors, and learners. It provides a seamless experience for managing digital assets, booking events, and accessing premium content, all powered by modern web technologies and AI integrations.

## ✨ Key Features

- **🛍️ Digital Marketplace**: Explore and purchase high-quality digital products, ebooks, and resources.
- **✍️ Author Ecosystem**: Dedicated dashboards for authors to upload, manage, and track their digital offerings.
- **📅 Event Ticketing & Booking**: Integrated system for discovering events and booking coaching sessions.
- **📚 Personal Library**: A centralized "My Library" section for users to access their purchased and saved content.
- **💳 Secure Payments**: Integrated with **Paystack** for reliable and secure transaction processing.
- **🤖 AI-Powered Insights**: Leveraging **Google Gemini** for intelligent content search and platform assistance.
- **📊 Admin Dashboard**: Robust management tools for platform overview, user moderation, and analytics.
- **📧 Communication**: Automated email notifications using **Resend**.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Supabase](https://supabase.com/) (Auth, Database, Storage)
- **AI Integration**: [Google Gemini Pro API](https://ai.google.dev/)
- **Payments**: [Paystack](https://paystack.com/)
- **Emails**: [Resend](https://resend.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Banolite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Google AI (Gemini)
   GEMINI_API_KEY=your_gemini_api_key

   # Resend
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=your_verified_sender_email

   # Paystack
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_public_key
   PAYSTACK_SECRET_KEY=your_secret_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the results.

## 📂 Project Structure

```text
├── app/              # Next.js App Router (pages and layouts)
├── components/       # Reusable UI components
├── views/            # Main page-level sections and dashboards
├── context/          # React context providers
├── lib/              # Utility functions and shared logic
├── services/         # API and third-party service integrations
├── supabase/         # Configuration and types for Supabase
├── public/           # Static assets (images, icons)
└── types.ts          # Global TypeScript interfaces
```

## 🚢 Deployment

The easiest way to deploy Banolite is via the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

---
<p align="center">Made with ❤️ for the Digital Creator Community</p>
