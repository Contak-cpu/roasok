'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  Target,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import MetaPixelButton from './MetaPixelButton'
import { 
  calculateDailyProfitability, 
  validateCalculationInputs, 
  generateRecommendations,
  formatCurrency,
  formatPercentage 
} from '@/lib/profitability-calculator'
import { 
  trackProfitabilityCalculation, 
  trackAdvertisingCost,
  trackTiendanubeConnection 
} from '@/lib/meta-pixel'

export default function Dashboard() {
  const { data: session } = useSession()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [salesData, setSalesData] = useState(null)
  const [costs, setCosts] = useState({
    advertisingCost: 0,
    productCost: 0,
    shippingCost: 0
  })
  const [calculation, setCalculation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Obtener datos de ventas cuando cambia la fecha
  useEffect(() => {
    if (selectedDate && session?.user?.accessToken && session?.user?.storeId) {
      fetchSalesData()
    }
  }, [selectedDate, session])

  const fetchSalesData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/sales/${selectedDate}?store_id=${session.user.storeId}&access_token=${session.user.accessToken}`)
      const data = await response.json()
      
      if (data.success) {
        setSalesData(data.data)
      } else {
        setError(data.error || 'Error al obtener datos de ventas')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error('Error fetching sales data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCostChange = (field, value) => {
    const numericValue = parseFloat(value) || 0
    setCosts(prev => ({
      ...prev,
      [field]: numericValue
    }))

    // Trackear costo publicitario si es relevante
    if (field === 'advertisingCost' && numericValue > 0) {
      trackAdvertisingCost(numericValue)
    }
  }

  const calculateProfitability = () => {
    if (!salesData) {
      setError('No hay datos de ventas disponibles')
      return
    }

    const validation = validateCalculationInputs(salesData, costs)
    if (!validation.isValid) {
      setError(validation.errors.join(', '))
      return
    }

    const result = calculateDailyProfitability(salesData, costs)
    setCalculation(result)
    setError('')

    // Trackear cálculo de rentabilidad
    trackProfitabilityCalculation(result.profitability, result.isProfitable)
  }

  const recommendations = calculation ? generateRecommendations(calculation) : []

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard de Rentabilidad
        </h1>
        <p className="text-gray-600">
          Bienvenido a tu panel de control. Aquí podrás gestionar tus costos y ver la rentabilidad de tu negocio.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Resumen del Día */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Resumen del Día
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Fecha
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field max-w-xs"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-konrad-50 rounded-lg p-4">
                <div className="text-sm text-konrad-600 font-medium">Ventas Brutas</div>
                <div className="text-2xl font-bold text-konrad-900">
                  {salesData ? formatCurrency(salesData.totalSales) : '$0'}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium">Costos Totales</div>
                <div className="text-2xl font-bold text-blue-900">
                  {calculation ? formatCurrency(calculation.totalCosts) : '$0'}
                </div>
              </div>
              <div className={`rounded-lg p-4 ${calculation?.isProfitable ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`text-sm font-medium ${calculation?.isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                  Rentabilidad
                </div>
                <div className={`text-2xl font-bold ${calculation?.isProfitable ? 'text-green-900' : 'text-red-900'}`}>
                  {calculation ? formatCurrency(calculation.profitability) : '$0'}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-600 font-medium">Margen %</div>
                <div className="text-2xl font-bold text-purple-900">
                  {calculation ? formatPercentage(calculation.profitMargin) : '0%'}
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Costos */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ingresar Costos Diarios
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Costo Publicitario Diario
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={costs.advertisingCost}
                  onChange={(e) => handleCostChange('advertisingCost', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Costo de Producto (CMG)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={costs.productCost}
                  onChange={(e) => handleCostChange('productCost', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Truck className="w-4 h-4 inline mr-1" />
                  Costo de Envíos Externos
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={costs.shippingCost}
                  onChange={(e) => handleCostChange('shippingCost', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            
            <button
              onClick={calculateProfitability}
              disabled={loading}
              className="btn-primary w-full md:w-auto"
            >
              {loading ? 'Calculando...' : 'Calcular Rentabilidad'}
            </button>
          </div>

          {/* Recomendaciones */}
          {recommendations.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recomendaciones
              </h3>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      rec.type === 'success' ? 'bg-green-50 border-green-400' :
                      rec.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start">
                      {rec.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />}
                      {rec.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />}
                      {rec.type === 'info' && <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />}
                      <div>
                        <h4 className="font-medium text-gray-900">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{rec.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Datos de Ventas */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Datos de Ventas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total pedidos:</span>
                <span className="font-medium">{salesData?.totalOrders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pedidos pagados:</span>
                <span className="font-medium">{salesData?.paidOrders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total vendido:</span>
                <span className="font-medium">{salesData ? formatCurrency(salesData.totalSales) : '$0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envíos cobrados:</span>
                <span className="font-medium">{salesData ? formatCurrency(salesData.totalShipping) : '$0'}</span>
              </div>
            </div>
          </div>

          {/* Métricas Adicionales */}
          {calculation && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Métricas Adicionales
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ventas netas:</span>
                  <span className="font-medium">{formatCurrency(calculation.netSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROI Publicidad:</span>
                  <span className="font-medium">{formatPercentage(calculation.advertisingROI)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    calculation.isProfitable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {calculation.isProfitable ? 'Rentable' : 'Pérdidas'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Meta Pixel */}
          <MetaPixelButton />

          {/* Acciones Rápidas */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <button
                onClick={fetchSalesData}
                disabled={loading}
                className="btn-secondary w-full"
              >
                {loading ? 'Actualizando...' : 'Actualizar Datos'}
              </button>
              <button
                onClick={() => signOut()}
                className="btn-secondary w-full"
              >
                Desconectar Tiendanube
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
