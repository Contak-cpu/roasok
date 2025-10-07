/**
 * Cliente para la API de Tiendanube
 */

const TIENDANUBE_API_BASE = 'https://api.tiendanube.com/v1'

/**
 * Realiza una petición autenticada a la API de Tiendanube
 */
async function makeAuthenticatedRequest(endpoint, accessToken, options = {}) {
  const url = `${TIENDANUBE_API_BASE}${endpoint}`
  
  const config = {
    headers: {
      'Authorization': `bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`Error en API Tiendanube: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error en makeAuthenticatedRequest:', error)
    throw error
  }
}

/**
 * Obtiene información de la tienda
 */
export async function getStoreInfo(accessToken) {
  return makeAuthenticatedRequest('/store', accessToken)
}

/**
 * Obtiene pedidos de una fecha específica
 */
export async function getOrdersByDate(accessToken, storeId, date) {
  // Formatear fecha para la API (YYYY-MM-DD)
  const formattedDate = new Date(date).toISOString().split('T')[0]
  
  // La API de Tiendanube no permite filtrar por fecha directamente,
  // así que obtenemos todos los pedidos y filtramos localmente
  const endpoint = `/stores/${storeId}/orders`
  
  try {
    const orders = await makeAuthenticatedRequest(endpoint, accessToken)
    
    // Filtrar pedidos por fecha
    const ordersOfDay = orders.filter(order => {
      const orderDate = new Date(order.created_at).toISOString().split('T')[0]
      return orderDate === formattedDate
    })
    
    return ordersOfDay
  } catch (error) {
    console.error('Error obteniendo pedidos:', error)
    return []
  }
}

/**
 * Obtiene detalles de un pedido específico
 */
export async function getOrderDetails(accessToken, storeId, orderId) {
  const endpoint = `/stores/${storeId}/orders/${orderId}`
  return makeAuthenticatedRequest(endpoint, accessToken)
}

/**
 * Calcula las métricas de ventas del día
 */
export async function calculateDailySales(accessToken, storeId, date) {
  try {
    const orders = await getOrdersByDate(accessToken, storeId, date)
    
    let totalSales = 0
    let totalShipping = 0
    let paidOrders = 0
    let totalOrders = orders.length

    orders.forEach(order => {
      // Solo contar pedidos pagados
      if (order.status === 'paid' || order.status === 'closed') {
        paidOrders++
        
        // Sumar total del pedido
        totalSales += parseFloat(order.total) || 0
        
        // Sumar costo de envío cobrado al cliente
        totalShipping += parseFloat(order.shipping_cost) || 0
      }
    })

    return {
      totalOrders,
      paidOrders,
      totalSales: Math.round(totalSales * 100) / 100,
      totalShipping: Math.round(totalShipping * 100) / 100,
      orders
    }
  } catch (error) {
    console.error('Error calculando ventas diarias:', error)
    return {
      totalOrders: 0,
      paidOrders: 0,
      totalSales: 0,
      totalShipping: 0,
      orders: []
    }
  }
}

/**
 * Obtiene información de productos para calcular costos
 */
export async function getProducts(accessToken, storeId, limit = 100) {
  const endpoint = `/stores/${storeId}/products?limit=${limit}`
  return makeAuthenticatedRequest(endpoint, accessToken)
}

/**
 * Función de prueba para verificar la conexión
 */
export async function testConnection(accessToken) {
  try {
    const storeInfo = await getStoreInfo(accessToken)
    return {
      success: true,
      store: storeInfo
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
