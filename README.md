# Atmos - Live Weather Dashboard

Atmos is a high-performance, fully responsive weather dashboard fetching live weather data, displaying 7-day forecasts, and offering insights like air quality and wind metrics.

## Features

- **Live Weather Tracking**: Current temperature, "feels like" temp, humidity, pressure, wind speed, and visibility
- **7-Day Forecast & Hourly Breakdown**: Detailed daily ranges and 24-hour visual charts
- **Advanced Metrics**: Wind direction gauges and Air Quality Index (AQI) readings
- **Personalized Experience**: Save favorite cities and revisit your recent search history, all backed by a PostgreSQL database
- **Modern UI**: Fully responsive interface with glassmorphism design, custom tooltips, and dynamic charts
- **Lightweight & Fast**: Built statically via Next.js and optimized with caching

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL (with Prisma ORM)
- **Styling**: Tailwind CSS & framer-motion (animations)
- **Charts**: Recharts
- **API**: OpenWeatherMap

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure Environment Variables**:
   Create a `.env` file in the root with:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/weather_dashboard"
   NEXT_PUBLIC_OPENWEATHER_API_KEY="your_openweather_api_key_here"
   ```
4. **Push DB Schema**: `npx prisma db push`
5. **Run the development server**: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
