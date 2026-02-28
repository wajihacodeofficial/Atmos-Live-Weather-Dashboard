import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const history = await prisma.searchHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { city, country, lat, lon } = body;

    const existing = await prisma.searchHistory.findFirst({
      where: { city },
    });
    if (existing) {
      await prisma.searchHistory.delete({ where: { id: existing.id } });
    }

    const entry = await prisma.searchHistory.create({
      data: { city, country, lat, lon },
    });
    return NextResponse.json(entry);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json(
      { error: 'Failed to log history' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await prisma.searchHistory.deleteMany();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json(
      { error: 'Failed to clear history' },
      { status: 500 }
    );
  }
}
