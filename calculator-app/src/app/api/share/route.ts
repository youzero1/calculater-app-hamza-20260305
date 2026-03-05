import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { calculationId } = body;

    if (!calculationId) {
      return NextResponse.json({ error: 'Calculation ID is required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calculation = await repo.findOne({ where: { id: calculationId } });
    if (!calculation) {
      return NextResponse.json({ error: 'Calculation not found' }, { status: 404 });
    }

    if (!calculation.shareId) {
      calculation.shareId = uuidv4();
      await repo.save(calculation);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareUrl = `${appUrl}/share/${calculation.shareId}`;

    return NextResponse.json({ shareId: calculation.shareId, shareUrl });
  } catch (error) {
    console.error('POST /api/share error:', error);
    return NextResponse.json({ error: 'Failed to generate share link' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('shareId');

    if (!shareId) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calculation = await repo.findOne({ where: { shareId } });
    if (!calculation) {
      return NextResponse.json({ error: 'Shared calculation not found' }, { status: 404 });
    }

    return NextResponse.json({ calculation });
  } catch (error) {
    console.error('GET /api/share error:', error);
    return NextResponse.json({ error: 'Failed to fetch shared calculation' }, { status: 500 });
  }
}
