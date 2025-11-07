# DryBuild Pro - Setup Instructions

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Supabase Account** (free) - [Sign up](https://supabase.com/)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

#### A. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com/)
2. Click "New Project"
3. Fill in project details:
   - **Name**: DryBuild Pro
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
4. Wait for project to be created (2-3 minutes)

#### B. Set Up Database

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema
6. You should see success messages for all tables created

#### C. Configure Storage Buckets

1. Go to **Storage** in the Supabase dashboard
2. Create two buckets:
   - **photos** (for activity/defect photos)
   - **voice-notes** (for voice recordings)
3. For each bucket:
   - Click "New Bucket"
   - Enter bucket name
   - Set to **Public** (for easier access)
   - Click "Create Bucket"

#### D. Get API Keys

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key (long string starting with "eyJ...")

### 3. Configure Environment Variables

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Open `.env` and add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Add Sample Data (Optional)

To test the app with sample data, run these SQL commands in Supabase SQL Editor:

```sql
-- Add sample employees
INSERT INTO employees (name, role, email, phone, status) VALUES
('John Smith', 'Plasterer', 'john@example.com', '555-0101', 'active'),
('Sarah Johnson', 'Taper', 'sarah@example.com', '555-0102', 'active'),
('Mike Wilson', 'Finisher', 'mike@example.com', '555-0103', 'active'),
('Emma Davis', 'Sander', 'emma@example.com', '555-0104', 'active');

-- Add sample materials
INSERT INTO materials (name, category, unit, status) VALUES
('13mm Plasterboard', 'Plasterboard', 'Sheets', 'active'),
('16mm Plasterboard', 'Plasterboard', 'Sheets', 'active'),
('Water-Resistant Plasterboard', 'Plasterboard', 'Sheets', 'active'),
('Joint Compound', 'Compound', 'Bags', 'active'),
('Paper Tape', 'Tape', 'Rolls', 'active'),
('Mesh Tape', 'Tape', 'Rolls', 'active'),
('Drywall Screws 25mm', 'Fasteners', 'Boxes', 'active'),
('Corner Bead', 'Corner Bead', 'Units', 'active');

-- Add sample site
INSERT INTO sites (name, address, client, start_date, total_units) VALUES
('Parkside Tower', '123 Park Street, Perth', 'ABC Builders Ltd', CURRENT_DATE, 50);
```

### 5. Run the Development Server

```bash
npm start
```

The app should open automatically at [http://localhost:3000](http://localhost:3000)

## 🔐 Test Accounts

The app uses Supabase Authentication. You need to create accounts:

### Create Your First User (Supervisor)

1. On the login screen, try signing in with any email/password
2. If the account doesn't exist, Supabase will show an error
3. Go to Supabase Dashboard → **Authentication** → **Users**
4. Click "Add User" → "Create new user"
5. Enter:
   - **Email**: supervisor@demo.com
   - **Password**: password123
   - **Auto Confirm User**: ✓ (checked)
6. Click "Create User"
7. Now sign in to the app with these credentials
8. Select **"Supervisor"** role on first login

### Create a Trade Worker Account

Repeat the same process with:
- **Email**: trade@demo.com
- **Password**: password123
- Select **"Trade Worker"** role on first login

## 📱 Features Overview

### Supervisor Features
- ✅ Create units and patch work
- ✅ View all activities and defects
- ✅ Manage employees, materials, and sites
- ✅ Approve/reject material requests
- ✅ Full access to all data

### Trade Worker Features
- ✅ View assigned activities
- ✅ Report defects
- ✅ Request materials
- ✅ Update progress on assigned work
- ❌ Cannot access management sections

## 🛠️ Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure your `.env` file exists and contains valid values:
```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...
```

Restart the dev server after changing `.env` files.

### Issue: "User profile not found" error after login

**Solution**: The user profile is created automatically on first login. If it fails:
1. Go to Supabase → **Table Editor** → `user_profiles`
2. Manually insert a record:
   ```sql
   INSERT INTO user_profiles (id, name, email, role)
   VALUES (
     'user-id-from-auth-users-table',
     'Your Name',
     'your@email.com',
     'supervisor'
   );
   ```

### Issue: Can't see activities/defects created by other users

**Solution**: This is due to Row Level Security (RLS) policies. Make sure:
1. The RLS policies from `supabase-schema.sql` are applied
2. You're logged in with the correct role (supervisor sees all, trade workers see only assigned)

### Issue: Photos not uploading

**Solution**:
1. Make sure Storage buckets are created (`photos` and `voice-notes`)
2. Set buckets to **Public** in Supabase Storage settings
3. Check browser console for specific error messages

### Issue: npm install fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📦 Build for Production

```bash
# Create optimized production build
npm run build

# The build folder will contain the production-ready app
# Deploy the contents of /build folder to any hosting service
```

## 🚀 Deployment Options

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`

### Netlify

1. Build the app:
```bash
npm run build
```

2. Drag the `build` folder to [netlify.com/drop](https://app.netlify.com/drop)

3. Add environment variables in Netlify:
   - Site settings → Build & deploy → Environment
   - Add the two Supabase variables

## 🔧 Advanced Configuration

### Enable Offline Mode (Future Enhancement)

The app structure supports offline mode. To implement:
1. Create Service Worker (see `public/service-worker.js` template)
2. Implement IndexedDB caching
3. Add background sync

### Enable Push Notifications (Future Enhancement)

1. Configure Firebase Cloud Messaging or Web Push API
2. Update notification service
3. Request permission from users

### Custom Domain

Follow your hosting provider's instructions to add a custom domain.

## 📚 Project Structure

```
drypro/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Auth/          # Login, authentication
│   │   ├── Dashboard/     # Dashboard components
│   │   ├── Activities/    # Activity management
│   │   ├── Defects/       # Defect management
│   │   ├── Materials/     # Materials & requests
│   │   ├── Employees/     # Employee management
│   │   ├── Sites/         # Site management
│   │   └── Shared/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main app component
│   ├── index.js           # App entry point
│   └── supabaseClient.js  # Supabase configuration
├── .env                   # Environment variables (create this)
├── package.json
└── README.md
```

## 🤝 Support

For issues or questions:
1. Check this documentation first
2. Review Supabase docs: https://supabase.com/docs
3. Check React docs: https://react.dev/

## 📄 License

Private - All rights reserved

---

**Happy Building! 🏗️**
