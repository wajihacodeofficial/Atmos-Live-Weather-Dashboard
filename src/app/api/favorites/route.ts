import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const favorites = await prisma.favoriteCity.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { city, country, lat, lon } = body;

    const favorite = await prisma.favoriteCity.upsert({
      where: { city_country: { city, country: country || '' } },
      update: { lat, lon },
      create: { city, country, lat, lon },
    });
    return NextResponse.json(favorite);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json(
      { error: 'Failed to save favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0');
    await prisma.favoriteCity.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
