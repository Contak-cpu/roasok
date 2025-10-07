/**
 * Calculadora de rentabilidad diaria
 */

/**
 * Calcula la rentabilidad diaria basada en ventas y costos
 */
export function calculateDailyProfitability(salesData, costs) {
  const {
    totalSales = 0,
    totalShipping = 0
  } = salesData

  const {
    advertisingCost = 0,
    productCost = 0,
    shippingCost = 0
  } = costs

  // Ventas netas (ventas brutas - envíos cobrados al cliente)
  const netSales = totalSales - totalShipping

  // Costos totales
  const totalCosts = advertisingCost + productCost + shippingCost

  // Rentabilidad
  const profitability = netSales - totalCosts

  // Margen de rentabilidad (%)
  const profitMargin = netSales > 0 ? (profitability / netSales) * 100 : 0

  // ROI de publicidad (%)
  const advertisingROI = advertisingCost > 0 ? (profitability / advertisingCost) * 100 : 0

  return {
    netSales: Math.round(netSales * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    profitability: Math.round(profitability * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
    advertisingROI: Math.round(advertisingROI * 100) / 100,
    isProfitable: profitability > 0
  }
}

/**
 * Valida los datos de entrada para el cálculo
 */
export function validateCalculationInputs(salesData, costs) {
  const errors = []

  if (!salesData || typeof salesData !== 'object') {
    errors.push('Datos de ventas inválidos')
  }

  if (!costs || typeof costs !== 'object') {
    errors.push('Datos de costos inválidos')
  }

  // Validar costos numéricos
  const costFields = ['advertisingCost', 'productCost', 'shippingCost']
  costFields.forEach(field => {
    if (costs[field] !== undefined && (isNaN(costs[field]) || costs[field] < 0)) {
      errors.push(`${field} debe ser un número mayor o igual a 0`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Genera recomendaciones basadas en la rentabilidad
 */
export function generateRecommendations(calculation) {
  const recommendations = []

  if (!calculation.isProfitable) {
    recommendations.push({
      type: 'warning',
      title: 'Rentabilidad Negativa',
      message: 'Tu negocio está generando pérdidas. Revisa tus costos y precios.',
      priority: 'high'
    })
  }

  if (calculation.profitMargin < 10) {
    recommendations.push({
      type: 'info',
      title: 'Margen Bajo',
      message: 'Tu margen de rentabilidad es menor al 10%. Considera optimizar costos o ajustar precios.',
      priority: 'medium'
    })
  }

  if (calculation.advertisingROI < 100) {
    recommendations.push({
      type: 'info',
      title: 'ROI de Publicidad Bajo',
      message: 'El retorno de tu inversión publicitaria es menor al 100%. Revisa tu estrategia de marketing.',
      priority: 'medium'
    })
  }

  if (calculation.isProfitable && calculation.profitMargin > 20) {
    recommendations.push({
      type: 'success',
      title: 'Excelente Rentabilidad',
      message: 'Tu negocio está generando una rentabilidad saludable. ¡Mantén este ritmo!',
      priority: 'low'
    })
  }

  return recommendations
}

/**
 * Formatea números para mostrar en la UI
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount)
}

export function formatPercentage(value) {
  return `${value.toFixed(1)}%`
}
