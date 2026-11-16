# Quranic Path Portal

Project: Path to Quranic Understanding — School Management Portal

Context: Real production project, not a demo. Building step by step — do not implement anything beyond this stage.

This stage only: initial frontend architecture, a landing page, and a login page. Nothing else.

Stack: React + TypeScript, Tailwind CSS, fully responsive (desktop, tablet, mobile).

Design tone: Professional and calm — this is an educational institution's portal, not a marketing site.

Content: Subjects taught are Nahwu (syntax), Sarf (morphology), Tajweed & Qur'anic Recitation, Hadith, and Hifz. Landing page should briefly introduce the program and these subjects, with a clear path to login.

Login page: No public sign-up — accounts are created by an admin/teacher. The login screen should reflect that.

Backend note: This will later connect to an existing Supabase project for auth and database. Leave a clear, isolated integration point for this — do not auto-create or provision a new Supabase project. Business logic will be built separately later in Google AI Studio.

Out of scope for this stage: dashboards, role-based views, any Supabase connection code, data fetching, or features beyond the landing and login pages.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6f307986-d119-4e32-8593-938d0211e2a8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
