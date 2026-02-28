import { NextRequest, NextResponse } from 'next/server';
import { getForecast, getAirQuality } from '@/lib/weather';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'lat and lon required' },
      { status: 400 }
    );
  }

  try {
    const [forecast, airQuality] = await Promise.all([
      getForecast(parseFloat(lat), parseFloat(lon)),
      getAirQuality(parseFloat(lat), parseFloat(lon)),
    ]);
    return NextResponse.json({ ...forecast, airQuality });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : 'Failed to fetch forecast';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
