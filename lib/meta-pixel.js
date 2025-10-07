/**
 * Configuración y funciones para Meta Pixel
 */

// Configuración del Pixel
export const META_PIXEL_CONFIG = {
  pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  enabled: process.env.NEXT_PUBLIC_META_PIXEL_ID ? true : false
}

/**
 * Inicializa el Meta Pixel
 */
export function initMetaPixel() {
  if (!META_PIXEL_CONFIG.enabled || typeof window === 'undefined') {
    return
  }

  // Cargar el script del Meta Pixel
  const script = document.createElement('script')
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', '${META_PIXEL_CONFIG.pixelId}');
    fbq('track', 'PageView');
  `
  document.head.appendChild(script)

  // Agregar noscript fallback
  const noscript = document.createElement('noscript')
  const img = document.createElement('img')
  img.height = '1'
  img.width = '1'
  img.style.display = 'none'
  img.src = `https://www.facebook.com/tr?id=${META_PIXEL_CONFIG.pixelId}&ev=PageView&noscript=1`
  noscript.appendChild(img)
  document.head.appendChild(noscript)
}

/**
 * Trackea eventos personalizados
 */
export function trackEvent(eventName, parameters = {}) {
  if (!META_PIXEL_CONFIG.enabled || typeof window === 'undefined' || !window.fbq) {
    console.log('Meta Pixel not available:', eventName, parameters)
    return
  }

  window.fbq('track', eventName, parameters)
}

/**
 * Trackea conversiones de venta
 */
export function trackPurchase(value, currency = 'ARS', orderId = null) {
  const parameters = {
    value: value,
    currency: currency
  }

  if (orderId) {
    parameters.content_ids = [orderId]
  }

  trackEvent('Purchase', parameters)
}

/**
 * Trackea cuando se vincula Tiendanube
 */
export function trackTiendanubeConnection() {
  trackEvent('CompleteRegistration', {
    content_name: 'Tiendanube Connection',
    content_category: 'OAuth'
  })
}

/**
 * Trackea cálculos de rentabilidad
 */
export function trackProfitabilityCalculation(profitability, isProfitable) {
  trackEvent('Lead', {
    content_name: 'Profitability Calculation',
    content_category: isProfitable ? 'Profitable' : 'Unprofitable',
    value: Math.abs(profitability)
  })
}

/**
 * Trackea costos de publicidad ingresados
 */
export function trackAdvertisingCost(cost) {
  trackEvent('AddToCart', {
    content_name: 'Advertising Cost Input',
    content_category: 'Cost Management',
    value: cost
  })
}

/**
 * Verifica si el Pixel está cargado
 */
export function isPixelLoaded() {
  return typeof window !== 'undefined' && window.fbq
}

/**
 * Obtiene el estado del Pixel
 */
export function getPixelStatus() {
  return {
    enabled: META_PIXEL_CONFIG.enabled,
    pixelId: META_PIXEL_CONFIG.pixelId,
    loaded: isPixelLoaded()
  }
}
