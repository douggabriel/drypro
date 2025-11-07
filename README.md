# DryBuild Pro

A professional construction management web application for drywall contractors.

## Features

- 📱 **Activity Management**: Track units and patch work with detailed progress phases
- 🔧 **Defect Reporting**: Report and manage construction defects
- 📦 **Material Requests**: Request and approve materials
- 👥 **Team Management**: Manage employees and assignments
- 🏗️ **Site Management**: Organize multiple construction sites
- 📴 **Offline Mode**: Work without internet, syncs when connected
- 🔔 **Push Notifications**: Stay updated on activity changes
- 🎤 **Voice Notes**: Record voice notes for quick documentation
- 🔐 **Role-Based Access**: Supervisor and Trade Worker roles

## Tech Stack

- React 18+
- Tailwind CSS
- Supabase (PostgreSQL + Auth + Storage)
- React Router v6
- Lucide React Icons
- date-fns

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your Supabase credentials

4. Run the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in the SQL editor
3. Set up Storage buckets:
   - `photos`
   - `voice-notes`
4. Configure Row Level Security policies as defined in the schema

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

## License

Private - All rights reserved
