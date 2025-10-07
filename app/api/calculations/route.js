import { NextResponse } from 'next/server'
import { saveProfitabilityCalculation, loadProfitabilityCalculations } from '@/lib/data-storage'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID requerido' },
        { status: 400 }
      )
    }

    const calculations = loadProfitabilityCalculations(userId, startDate, endDate)
    
    return NextResponse.json({
      success: true,
      calculations
    })

  } catch (error) {
    console.error('Error cargando cálculos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { userId, date, calculation } = await request.json()

    if (!userId || !date || !calculation) {
      return NextResponse.json(
        { error: 'User ID, fecha y cálculo requeridos' },
        { status: 400 }
      )
    }

    const success = saveProfitabilityCalculation(userId, date, calculation)
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Cálculo guardado correctamente'
      })
    } else {
      return NextResponse.json(
        { error: 'Error al guardar cálculo' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error guardando cálculo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
