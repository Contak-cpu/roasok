import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/tiendanube-api'

export async function POST(request) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acceso requerido' },
        { status: 400 }
      )
    }

    const result = await testConnection(accessToken)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        store: result.store
      })
    } else {
      return NextResponse.json(
        { error: 'Error de conexión', details: result.error },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error en test de conexión:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
