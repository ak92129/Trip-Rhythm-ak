# TripRhythm

A constraint-aware, fatigue-aware travel itinerary planner powered by AI.

## Features

- **AI-Powered Itinerary Generation**: Generate personalized day-by-day travel itineraries based on your preferences
- **Constraint-Aware Planning**: Respects travel style, walking tolerance, wake/sleep times, and must-see places
- **Fatigue Adjustment**: Adjust any day that feels too tiring with AI-powered rebalancing
- **Before/After Comparison**: See exactly what changes when adjusting for fatigue
- **Multiple AI Providers**: Switch between OpenAI, Google Gemini, or Anthropic Claude

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **AI Providers**: OpenAI, Google Gemini, Anthropic Claude
- **UI Components**: Lucide React icons, React Hot Toast

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:

   The `.env` file should contain:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

   # AI Provider Configuration
   AI_PROVIDER=openai
   OPENAI_API_KEY=your-openai-api-key
   GEMINI_API_KEY=your-gemini-api-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

3. **Database Setup**:

   The database schema is automatically created via Supabase migrations. Tables include:
   - `trips`: Store trip details and preferences
   - `itineraries`: Store day-by-day itinerary plans (one row per day)

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Usage

### Creating a Trip

1. Click "Plan New Trip" from the home page
2. Fill in trip details:
   - Destination city
   - Start date and number of days
   - Travel style (chill/balanced/intense)
   - Walking tolerance (low/medium/high)
   - Wake and sleep times
   - Optional must-see places
3. Click "Create & Generate Itinerary"
4. Wait for AI to generate your personalized itinerary

### Adjusting for Fatigue

1. Open any trip to view its itinerary
2. Click on a day that feels too tiring
3. Click "This Day Feels Too Tiring" button
4. Review the before/after comparison
5. Accept or keep the original plan

### Switching AI Providers

Change the `AI_PROVIDER` environment variable to:
- `openai` - Uses GPT-4o-mini
- `gemini` - Uses Gemini 1.5 Flash
- `anthropic` - Uses Claude 3.5 Sonnet

## Architecture

### Database Schema

**trips table**:
- `id` (uuid, primary key)
- `destination` (text)
- `start_date` (date)
- `days` (integer)
- `travel_style` (text: chill/balanced/intense)
- `walking_tolerance` (text: low/medium/high)
- `wake_time` (text: HH:MM)
- `sleep_time` (text: HH:MM)
- `must_see_places` (text, nullable)
- `created_at` (timestamptz)

**itineraries table**:
- `id` (uuid, primary key)
- `trip_id` (uuid, foreign key to trips.id)
- `day_index` (integer, 1-based)
- `ai_plan_json` (jsonb - contains date, summary, activities array)
- `created_at` (timestamptz)

### AI Provider Abstraction

The application uses a provider abstraction layer that allows switching between different AI services without changing application code. All providers implement the same interface:

- `generateItinerary()` - Generate complete trip itinerary
- `adjustDayForFatigue()` - Adjust a specific day to reduce fatigue

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## License

MIT
