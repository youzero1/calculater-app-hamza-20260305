import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';

export async function GET(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let query = repo.createQueryBuilder('calc').orderBy('calc.createdAt', 'DESC').limit(limit);

    if (search) {
      query = query.where(
        'calc.expression LIKE :search OR calc.result LIKE :search',
        { search: `%${search}%` }
      );
    }

    const calculations = await query.getMany();
    return NextResponse.json({ calculations });
  } catch (error) {
    console.error('GET /api/calculations error:', error);
    return NextResponse.json({ error: 'Failed to fetch calculations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || result === undefined) {
      return NextResponse.json({ error: 'Expression and result are required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calculation = repo.create({
      expression,
      result: result.toString(),
      shareId: null,
    });

    await repo.save(calculation);
    return NextResponse.json({ calculation }, { status: 201 });
  } catch (error) {
    console.error('POST /api/calculations error:', error);
    return NextResponse.json({ error: 'Failed to save calculation' }, { status: 500 });
  }
}
