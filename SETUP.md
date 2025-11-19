# EduPlay 3D - Setup Guide

Complete setup instructions for getting your educational gaming platform running.

## Prerequisites

Before you begin, make sure you have:
- Node.js 18 or higher installed
- A Supabase account (free tier is fine)
- A modern web browser

## Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` due to React 19 compatibility with some packages.

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Project name: `eduplay-3d` (or any name you like)
   - Database password: Create a strong password
   - Region: Choose closest to you
4. Click "Create new project" and wait for setup to complete

### 2.2 Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Find these two values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

### 2.3 Configure Environment Variables

1. Open the `.env.local` file in the root directory
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### 2.4 Run Database Migration

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open the `supabase-schema.sql` file from this project
4. Copy all the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **Run** or press `Ctrl+Enter`

You should see "Success. No rows returned" - this is correct!

### 2.5 Verify Database Setup

Go to **Table Editor** in Supabase. You should see these tables:
- students
- grades
- subjects
- games
- student_progress

The `grades` and `subjects` tables should have data, and `games` should have 2 sample games.

## Step 3: Run the Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Step 4: Test the Application

### 4.1 Create an Account

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Click "Sign Up"
3. Fill in:
   - Full Name: Your name
   - Email: Any email (e.g., `student@test.com`)
   - Password: At least 6 characters
   - Grade: Select any grade (9-12)
4. Click "Sign Up"

**Important**: Check your email for a confirmation link from Supabase. In development, you can disable email confirmation:
- Go to Supabase Dashboard → **Authentication** → **Providers**
- Scroll to "Email"
- Disable "Confirm email"

### 4.2 Explore the Platform

1. After login, you'll see the dashboard
2. Click on "Grade 9" (or any grade)
3. Select a subject (Physics or Chemistry)
4. Click on a game to play
5. Try both games:
   - **Newton's Cradle**: Click the outer balls to see momentum transfer
   - **Molecule Builder**: Explore different molecular structures

### 4.3 Check Progress

1. Click "Progress" in the sidebar
2. You should see your game history and stats

## Troubleshooting

### Issue: "Invalid API Key" Error

**Solution**: Double-check your `.env.local` file:
- Make sure there are no extra spaces
- Ensure you copied the full anon key
- Restart the dev server after changing `.env.local`

### Issue: "Table does not exist" Error

**Solution**: The database schema wasn't applied correctly:
1. Go to Supabase SQL Editor
2. Run the `supabase-schema.sql` again
3. Make sure you see "Success" message

### Issue: Can't Login After Registration

**Solution**: Email confirmation is enabled:
1. Check your email for confirmation link, OR
2. Disable email confirmation in Supabase:
   - Dashboard → Authentication → Providers → Email
   - Toggle off "Confirm email"

### Issue: Games Not Loading

**Solution**:
1. Check browser console for errors (F12)
2. Make sure WebGL is supported in your browser
3. Try a different browser (Chrome/Firefox recommended)

### Issue: Build/Compilation Errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
# Run dev server
npm run dev
```

## Project Structure Overview

```
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── dashboard/               # Main dashboard (protected)
│   │   ├── page.tsx            # Dashboard home
│   │   ├── progress/           # Progress tracking
│   │   └── grades/[gradeId]/   # Grade & subject pages
│   └── game/[gameId]/          # Individual game pages
├── components/
│   ├── navigation/Sidebar.tsx   # Main navigation
│   └── games/                   # Game components
│       ├── GameContainer.tsx    # Game wrapper
│       ├── NewtonsCradle.tsx    # Physics game
│       └── MoleculeBuilder.tsx  # Chemistry game
├── lib/
│   └── supabase/               # Supabase client setup
└── supabase-schema.sql         # Database schema
```

## Adding More Games

To add a new game:

1. **Add to Database**: Insert game data in Supabase SQL Editor:
```sql
INSERT INTO public.games (title, description, subject_id, grade_id, game_type, difficulty_level, learning_objectives, estimated_time)
VALUES (
  'Your Game Name',
  'Game description',
  (SELECT id FROM public.subjects WHERE name = 'Physics'),
  (SELECT id FROM public.grades WHERE grade_number = 9),
  'threejs',
  'medium',
  ARRAY['Learning objective 1', 'Learning objective 2'],
  15
);
```

2. **Create Game Component**: Add a new file in `components/games/YourGame.tsx`

3. **Update GameContainer**: Add your game to the switch statement in `GameContainer.tsx`

## Development Tips

- Use `npm run dev` for development
- Run `npm run build` to test production build
- Check `npm run lint` for code issues
- Supabase Dashboard has real-time database viewer
- Use browser DevTools to debug Three.js scenes

## Need Help?

- Check the README.md for general information
- Review the code comments for implementation details
- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Three.js docs: https://threejs.org/docs

## What's Next?

Now that your platform is running, you can:
- Add more educational games
- Customize the UI/colors
- Add more subjects (Math, Biology, etc.)
- Implement leaderboards
- Add achievements/badges
- Create teacher dashboards
- Export progress reports

Enjoy building your educational platform! 🎮📚
