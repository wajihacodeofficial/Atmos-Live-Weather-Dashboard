import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity, getWeatherByCoords } from '@/lib/weather';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!city && (!lat || !lon)) {
    return NextResponse.json(
      { error: 'city or lat/lon required' },
      { status: 400 }
    );
  }

  try {
    let data;
    if (lat && lon) {
      data = await getWeatherByCoords(parseFloat(lat), parseFloat(lon));
    } else {
      data = await getWeatherByCity(city!);
    }

    // Cache in PostgreSQL (best-effort)
    try {
      await prisma.weatherCache.upsert({
        where: { city: data.city },
        update: {
          data: JSON.parse(JSON.stringify(data)),
          cachedAt: new Date(),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
        create: {
          city: data.city,
          data: JSON.parse(JSON.stringify(data)),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
    } catch {
      /* non-fatal */
    }

    return NextResponse.json(data);
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : 'Failed to fetch weather';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
