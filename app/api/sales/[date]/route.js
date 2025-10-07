import { NextResponse } from 'next/server'
import { calculateDailySales } from '@/lib/tiendanube-api'
import { getStoredToken } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const { date } = params
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('store_id')
    const accessToken = searchParams.get('access_token')

    if (!storeId || !accessToken) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de fecha
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido' },
        { status: 400 }
      )
    }

    const salesData = await calculateDailySales(accessToken, storeId, date)
    
    return NextResponse.json({
      success: true,
      date,
      storeId,
      data: salesData
    })

  } catch (error) {
    console.error('Error en API de ventas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
