import { NextResponse } from 'next/server'
import { exchangeCodeForToken, getStoreInfo } from '@/lib/tiendanube-oauth'
import { storeToken } from '@/lib/auth'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?error=no_code', request.url)
    )
  }

  try {
    // Intercambiar código por token
    const tokenData = await exchangeCodeForToken(code)
    
    // Obtener información de la tienda
    const storeInfo = await getStoreInfo(tokenData.access_token)
    
    // Guardar token para uso posterior
    const userId = `store-${storeInfo.id}`
    storeToken(userId, tokenData.access_token)

    // Redirigir a dashboard con parámetros de sesión
    const dashboardUrl = new URL('/dashboard', request.url)
    dashboardUrl.searchParams.set('store_id', storeInfo.id)
    dashboardUrl.searchParams.set('store_name', storeInfo.name)
    dashboardUrl.searchParams.set('access_token', tokenData.access_token)

    return NextResponse.redirect(dashboardUrl)
  } catch (error) {
    console.error('Error en callback de Tiendanube:', error)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent('Error de autenticación')}`, request.url)
    )
  }
}
