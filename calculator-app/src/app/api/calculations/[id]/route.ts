import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const calculation = await repo.findOne({ where: { id } });
    if (!calculation) {
      return NextResponse.json({ error: 'Calculation not found' }, { status: 404 });
    }

    await repo.remove(calculation);
    return NextResponse.json({ message: 'Calculation deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/calculations/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete calculation' }, { status: 500 });
  }
}
