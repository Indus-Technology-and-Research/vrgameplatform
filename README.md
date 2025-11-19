# EduPlay 3D - Educational Gaming Platform

An interactive 3D educational gaming platform built with Next.js and Three.js, designed to make learning fun and engaging for students in grades 9-12.

## Features

- 🎮 Interactive 3D educational games using Three.js
- 🔐 Secure authentication with Supabase
- 📚 Organized by grade level and subject
- 📊 Progress tracking and scoring system
- 🎨 Modern, responsive UI inspired by gaming platforms
- 🔬 Science-focused games (Physics, Chemistry, Biology)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Backend**: Supabase (Database + Authentication)
- **Styling**: Tailwind CSS
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([Sign up here](https://supabase.com))

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your project URL and anon key

4. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

5. Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

6. Run the database schema:
   - Open your Supabase project
   - Go to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run"

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── game/              # Individual game pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── games/            # Game-related components
│   ├── navigation/       # Navigation components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── supabase/        # Supabase client configuration
│   └── three/           # Three.js utilities
└── public/              # Static assets

```

## Available Games

### Physics
- **Newton's Cradle Simulator**: Interactive demonstration of momentum and energy conservation

### Chemistry
- **Molecule Builder 3D**: Build and explore molecular structures in 3D

## Database Schema

The platform uses the following main tables:
- `students`: User profiles and grade information
- `grades`: Grade levels (9-12)
- `subjects`: Available subjects
- `games`: Game catalog with metadata
- `student_progress`: Track student scores and completion

## Development

### Adding New Games

1. Add game metadata to the database
2. Create a new game component in `components/games/`
3. Implement Three.js scene and interactions
4. Add routing in `app/game/[id]/`

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm run start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues and questions, please create an issue in the GitHub repository.
