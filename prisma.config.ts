// Prisma v7 config file
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://wajihazehra@localhost:5432/weather_dashboard';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: connectionString,
  },
});
