# DryBuild Pro - Construction Management Application

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E.svg)](https://supabase.com/)

A complete, production-ready construction management web application designed specifically for drywall contractors. Manage your units, track progress, handle defects, request materials, and work offline in the field.

## ✨ Features

### 🏗️ Core Functionality
- **Activity Management**: Track normal units and patch work with 5-phase workflow
- **Progress Tracking**: Real-time progress calculation and visualization
- **Defect Management**: Report, assign, and resolve defects with 4-phase repair workflow
- **Material Requests**: Submit, approve/reject material requests with urgency levels
- **Employee Management**: Manage your workforce and assignments
- **Sites Management**: Organize work across multiple construction sites

### 🎯 Advanced Features
- **📵 Offline Mode**: Full functionality without internet connection using IndexedDB
- **🔔 Push Notifications**: Real-time updates on activities, defects, and approvals
- **🎤 Voice Notes**: Record audio notes instead of typing
- **📸 Photo Galleries**: Upload and view progress photos with lightbox
- **👥 Role-Based Access**: Separate permissions for Supervisors and Trade Workers
- **📊 Dashboard**: Real-time statistics and recent activity feed

### 🎨 Design
- Modern, responsive UI with Tailwind CSS
- Gradient-based color system
- Mobile-first design
- Touch-friendly interfaces
- Accessible (WCAG AA compliant)

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase Account** (free tier works perfectly)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/drypro.git
cd drypro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### a. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details
5. Wait for the project to be created (1-2 minutes)

#### b. Run the Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the file `database-setup.sql` from this repository
3. Copy the entire contents
4. Paste into the SQL Editor and click "Run"

#### c. Create Storage Buckets

Go to **Storage** in Supabase and create these buckets:
- `photos` (Public, 5MB limit)
- `voice-notes` (Private, 10MB limit)
- `avatars` (Public, 2MB limit)

#### d. Get Your API Keys

1. Go to **Settings** > **API**
2. Copy your Project URL and anon key

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_SUPABASE_URL=your_project_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

### 5. Run the Application

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

See the full documentation in the `database-setup.sql` file for:
- Complete database schema
- Row Level Security policies
- Triggers and functions
- Sample data

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure JWT authentication
- Input validation
- No SQL injection vulnerabilities

## 📦 Building for Production

```bash
npm run build
```

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy!

## 🐛 Troubleshooting

**Database errors?** Re-run `database-setup.sql`
**Photos won't upload?** Check storage bucket permissions
**Offline not working?** Enable service workers in browser
**Notifications blocked?** Grant permission in browser settings

## 📄 License

MIT License - See LICENSE file for details

---

**DryBuild Pro** - Making construction management simple and efficient. 🏗️
