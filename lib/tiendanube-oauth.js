// Configuración OAuth para Tiendanube
export const TIENDANUBE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_TIENDANUBE_CLIENT_ID,
  clientSecret: process.env.TIENDANUBE_CLIENT_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_TIENDANUBE_REDIRECT_URI,
  authUrl: 'https://www.tiendanube.com/apps/authorize',
  tokenUrl: 'https://api.tiendanube.com/v1/oauth/access_token'
}

/**
 * Genera la URL de autorización para Tiendanube
 */
export function generateAuthUrl() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TIENDANUBE_CONFIG.clientId,
    redirect_uri: TIENDANUBE_CONFIG.redirectUri,
    scope: 'read_orders,read_products,read_store'
  })

  return `${TIENDANUBE_CONFIG.authUrl}?${params.toString()}`
}

/**
 * Intercambia el código de autorización por un access token
 */
export async function exchangeCodeForToken(code) {
  try {
    const response = await fetch(TIENDANUBE_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: TIENDANUBE_CONFIG.clientId,
        client_secret: TIENDANUBE_CONFIG.clientSecret,
        code: code,
        redirect_uri: TIENDANUBE_CONFIG.redirectUri
      })
    })

    if (!response.ok) {
      throw new Error(`Error al obtener token: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en exchangeCodeForToken:', error)
    throw error
  }
}

/**
 * Obtiene información de la tienda
 */
export async function getStoreInfo(accessToken) {
  try {
    const response = await fetch('https://api.tiendanube.com/v1/store', {
      headers: {
        'Authorization': `bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error al obtener información de la tienda: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en getStoreInfo:', error)
    throw error
  }
}
