import { NextRequest, NextResponse } from 'next/server';
import { searchJobPositions, JOB_CATEGORIES, getAllJobPositionsGrouped } from '@/lib/job-positions';

// GET - Buscar cargos con autocompletado
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const grouped = searchParams.get('grouped') === 'true';

    if (grouped) {
      // Devolver todos los cargos agrupados por categoría
      const groupedPositions = getAllJobPositionsGrouped();
      return NextResponse.json({ 
        positions: groupedPositions,
        categories: JOB_CATEGORIES,
      });
    }

    // Búsqueda con autocompletado
    const positions = searchJobPositions(query, limit);
    
    return NextResponse.json({ 
      positions: positions.map(p => ({
        id: p.id,
        title: p.title,
        titleEn: p.titleEn,
        category: p.category,
        categoryName: JOB_CATEGORIES[p.category]?.name || p.category,
        subcategory: p.subcategory,
        synonyms: p.synonyms,
      })),
      query,
    });
  } catch (error) {
    console.error('Error searching job positions:', error);
    return NextResponse.json({ error: 'Error en la búsqueda' }, { status: 500 });
  }
}
