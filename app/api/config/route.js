import { NextResponse } from 'next/server'
import { saveUserConfig, loadUserConfig } from '@/lib/data-storage'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID requerido' },
        { status: 400 }
      )
    }

    const config = loadUserConfig(userId)
    
    return NextResponse.json({
      success: true,
      config
    })

  } catch (error) {
    console.error('Error cargando configuración:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { userId, config } = await request.json()

    if (!userId || !config) {
      return NextResponse.json(
        { error: 'User ID y configuración requeridos' },
        { status: 400 }
      )
    }

    const success = saveUserConfig(userId, config)
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Configuración guardada correctamente'
      })
    } else {
      return NextResponse.json(
        { error: 'Error al guardar configuración' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error guardando configuración:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
