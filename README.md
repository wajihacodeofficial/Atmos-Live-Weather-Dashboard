<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/OpenWeatherMap-API-orange?style=for-the-badge" alt="OpenWeatherMap" />
</p>

<h1 align="center">🌤️ Atmos — Live Weather Intelligence Dashboard</h1>

<p align="center">
  <strong>A professional-grade, real-time weather intelligence platform built with modern web technologies and HCI principles.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#hci-principles">HCI Principles</a> •
  <a href="#license">License</a>
</p>

---

## 📸 Preview

### 🏠 Dashboard — Live Weather & Forecast

<p align="center">
  <img src="public/screenshot-hero.png" alt="Atmos Dashboard - Hero Card & Extended Forecast" width="100%" />
</p>

### 📊 Weather Analytics & Air Quality

<p align="center">
  <img src="public/screenshot-analytics.png" alt="Atmos Dashboard - Charts, Wind, AQI & 7-Day Overview" width="100%" />
</p>

### 🏗️ Atmospheric Details & Footer

<p align="center">
  <img src="public/screenshot-footer.png" alt="Atmos Dashboard - Details, History & Footer" width="100%" />
</p>

---

## ✨ Features

### 🌡️ Real-Time Weather Intelligence

- **Live Conditions** — Current temperature, feels-like, humidity, wind, visibility, and pressure
- **7-Day Extended Forecast** — Daily high/low, weather conditions, and precipitation probability
- **Hourly Trends** — 24-hour temperature, humidity, wind, and rain projections
- **Air Quality Index (AQI)** — Real-time pollutant levels (PM2.5, PM10, O₃, NO₂) with WHO-standard indicators

### 📊 Interactive Analytics

- **Multi-tab Chart System** — Switch between temperature, precipitation, humidity, and wind views
- **Dual Timeframes** — Hourly (next 24h) and daily (next 7 days) visualizations
- **Gradient Charts** — Smooth area and line charts with custom tooltips

### 🔍 Smart Search & Navigation

- **Autocomplete City Search** — Fuzzy search with debounced API calls for responsive results
- **Geolocation Support** — One-click "locate me" to fetch weather for your current position
- **Favorites & History** — Pin frequently checked cities and browse recently viewed locations

### 🎨 Premium UI/UX

- **Glassmorphism Design** — Frosted glass cards with blur effects and subtle gradients
- **Dark Mode First** — A deep Navy/Slate palette designed for comfortable extended viewing
- **Adaptive Layouts** — Fully responsive from ultra-wide desktop to mobile screens
- **Micro-Animations** — Smooth transitions, hover effects, and loading states
- **Demo Mode** — Automatic mock data fallback when API key is missing (perfect for demos)

---

## 🛠️ Tech Stack

| Layer           | Technology                                                 |
| --------------- | ---------------------------------------------------------- |
| **Framework**   | [Next.js 16](https://nextjs.org/) (App Router, Turbopack)  |
| **Language**    | [TypeScript 5](https://typescriptlang.org/)                |
| **Database**    | [PostgreSQL 16](https://postgresql.org/)                   |
| **ORM**         | [Prisma 7](https://prisma.io/) (with `@prisma/adapter-pg`) |
| **Styling**     | Vanilla CSS with CSS Custom Properties                     |
| **Charts**      | [Recharts](https://recharts.org/)                          |
| **Icons**       | [Lucide React](https://lucide.dev/)                        |
| **HTTP Client** | [Axios](https://axios-http.com/)                           |
| **Weather API** | [OpenWeatherMap](https://openweathermap.org/api)           |
| **Fonts**       | Plus Jakarta Sans, Outfit (Google Fonts)                   |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** 16 (via Homebrew: `brew install postgresql@16`)
- **OpenWeatherMap API Key** — [Get one free](https://openweathermap.org/appid)

### 1. Clone the Repository

```bash
git clone https://github.com/wajihacodeofficial/Atmos-Live-Weather-Dashboard.git
cd Atmos-Live-Weather-Dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file in the project root:

```env
DATABASE_URL="postgresql://YOUR_USER@localhost:5432/weather_dashboard"
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_api_key
```

### 4. Set Up the Database

```bash
# Create the database
createdb weather_dashboard

# Push the Prisma schema
npx prisma db push

# Generate the Prisma client
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **💡 No API key?** The dashboard automatically switches to **Demo Mode** with realistic mock data so you can explore the full UI.

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── weather/route.ts    # Current weather + caching
│   │   ├── forecast/route.ts   # 7-day & hourly forecast + AQI
│   │   ├── favorites/route.ts  # CRUD for favorite cities
│   │   └── history/route.ts    # Search history tracking
│   ├── globals.css             # Design system & tokens
│   ├── layout.tsx              # Root layout with SEO metadata
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── HeroCard.tsx            # Primary weather display
│   ├── ForecastCard.tsx        # 7-day forecast grid
│   ├── WeatherCharts.tsx       # Interactive analytics charts
│   ├── AirQualityCard.tsx      # AQI with pollutant breakdown
│   ├── WindCard.tsx            # Wind speed + compass
│   ├── SearchBar.tsx           # Autocomplete search + geolocation
│   └── SidePanel.tsx           # Favorites + history panel
├── lib/
│   ├── weather.ts              # OpenWeatherMap API integration
│   └── prisma.ts               # Prisma client singleton
├── hooks/
│   └── useDebounce.ts          # Debounced callback hook
└── prisma/
    └── schema.prisma           # Database schema
```

---

## 🧠 HCI Principles Applied

This project was designed following key **Human-Computer Interaction** principles:

| Principle                             | Implementation                                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Visibility of System Status**       | Live "Station Connected" indicator, loading skeletons, refresh spinner, and "Demo Mode" banner |
| **Match Between System & Real World** | Weather icons, compass for wind direction, intuitive temperature/humidity labels               |
| **User Control & Freedom**            | Unit toggle (°C/°F), clear history, remove favorites, cancel search                            |
| **Consistency & Standards**           | Uniform glass card system, consistent typography hierarchy, standard icon set                  |
| **Error Prevention**                  | Graceful API fallbacks, input debouncing, empty state guidance                                 |
| **Recognition Over Recall**           | Favorites panel, recent searches, city autocomplete suggestions                                |
| **Flexibility & Efficiency**          | Keyboard search, geolocation shortcut, quick-select from history                               |
| **Aesthetic & Minimalist Design**     | Clean visual hierarchy, purposeful use of color, no unnecessary elements                       |

---

## 📄 Database Schema

```prisma
model SearchHistory {
  id        Int      @id @default(autoincrement())
  city      String
  country   String?
  lat       Float?
  lon       Float?
  createdAt DateTime @default(now())
}

model FavoriteCity {
  id        Int      @id @default(autoincrement())
  city      String
  country   String?
  lat       Float?
  lon       Float?
  createdAt DateTime @default(now())
  @@unique([city, country])
}

model WeatherCache {
  id        Int      @id @default(autoincrement())
  city      String   @unique
  data      Json
  cachedAt  DateTime @default(now())
  expiresAt DateTime
}
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/wajihacodeofficial">Wajiha Zehra</a></strong>
</p>
