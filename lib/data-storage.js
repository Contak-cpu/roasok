import fs from 'fs'
import path from 'path'

// Simulación de base de datos para desarrollo y Vercel
class DataStorage {
  constructor() {
    this.isVercel = process.env.VERCEL === '1'
    this.dataDir = this.isVercel ? '/tmp' : './data'
    this.ensureDataDir()
  }

  ensureDataDir() {
    if (!this.isVercel && !fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true })
    }
  }

  getFilePath(filename) {
    return path.join(this.dataDir, `${filename}.json`)
  }

  // Guardar datos
  save(key, data) {
    try {
      const filePath = this.getFilePath(key)
      const jsonData = JSON.stringify(data, null, 2)
      
      if (this.isVercel) {
        // En Vercel, usar variables de entorno o servicios externos
        // Por ahora, simulamos con un Map en memoria
        return this.saveToMemory(key, data)
      } else {
        fs.writeFileSync(filePath, jsonData)
        return true
      }
    } catch (error) {
      console.error('Error saving data:', error)
      return false
    }
  }

  // Cargar datos
  load(key, defaultValue = null) {
    try {
      if (this.isVercel) {
        return this.loadFromMemory(key, defaultValue)
      } else {
        const filePath = this.getFilePath(key)
        if (fs.existsSync(filePath)) {
          const jsonData = fs.readFileSync(filePath, 'utf8')
          return JSON.parse(jsonData)
        }
        return defaultValue
      }
    } catch (error) {
      console.error('Error loading data:', error)
      return defaultValue
    }
  }

  // Eliminar datos
  delete(key) {
    try {
      if (this.isVercel) {
        return this.deleteFromMemory(key)
      } else {
        const filePath = this.getFilePath(key)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          return true
        }
        return false
      }
    } catch (error) {
      console.error('Error deleting data:', error)
      return false
    }
  }

  // Métodos para memoria (Vercel)
  saveToMemory(key, data) {
    if (!global.memoryStorage) {
      global.memoryStorage = new Map()
    }
    global.memoryStorage.set(key, data)
    return true
  }

  loadFromMemory(key, defaultValue) {
    if (!global.memoryStorage) {
      global.memoryStorage = new Map()
    }
    return global.memoryStorage.get(key) || defaultValue
  }

  deleteFromMemory(key) {
    if (!global.memoryStorage) {
      return false
    }
    return global.memoryStorage.delete(key)
  }
}

// Instancia singleton
const storage = new DataStorage()

/**
 * Guardar configuración de usuario
 */
export function saveUserConfig(userId, config) {
  const key = `user_config_${userId}`
  return storage.save(key, {
    ...config,
    updatedAt: new Date().toISOString()
  })
}

/**
 * Cargar configuración de usuario
 */
export function loadUserConfig(userId) {
  const key = `user_config_${userId}`
  return storage.load(key, {
    defaultCosts: {
      advertisingCost: 0,
      productCost: 0,
      shippingCost: 0
    },
    preferences: {
      currency: 'ARS',
      dateFormat: 'DD/MM/YYYY'
    }
  })
}

/**
 * Guardar cálculo de rentabilidad
 */
export function saveProfitabilityCalculation(userId, date, calculation) {
  const key = `profitability_${userId}_${date}`
  return storage.save(key, {
    ...calculation,
    date,
    userId,
    calculatedAt: new Date().toISOString()
  })
}

/**
 * Cargar cálculos de rentabilidad
 */
export function loadProfitabilityCalculations(userId, startDate, endDate) {
  // En una implementación real, esto sería más eficiente
  // Por ahora, retornamos los datos disponibles
  const key = `profitability_${userId}`
  return storage.load(key, [])
}

/**
 * Guardar datos de ventas en caché
 */
export function saveSalesCache(userId, date, salesData) {
  const key = `sales_cache_${userId}_${date}`
  return storage.save(key, {
    ...salesData,
    date,
    userId,
    cachedAt: new Date().toISOString()
  })
}

/**
 * Cargar datos de ventas desde caché
 */
export function loadSalesCache(userId, date) {
  const key = `sales_cache_${userId}_${date}`
  return storage.load(key, null)
}

/**
 * Limpiar caché antiguo (más de 7 días)
 */
export function cleanOldCache() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  // En una implementación real, esto sería más eficiente
  // Por ahora, solo retornamos true
  return true
}

export default storage
