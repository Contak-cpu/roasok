'use client'

import { useState, useEffect } from 'react'
import { generateAuthUrl } from '@/lib/tiendanube-oauth'
import { useSession } from 'next-auth/react'
import { ShoppingBag, TrendingUp, DollarSign, Package, Truck } from 'lucide-react'
import Dashboard from '@/components/Dashboard'

export default function HomePage() {
  const { data: session, status } = useSession()
  const [error, setError] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [])

  const handleTiendanubeAuth = () => {
    const authUrl = generateAuthUrl()
    window.location.href = authUrl
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-konrad-600"></div>
      </div>
    )
  }

  if (session) {
    return <Dashboard />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Calculadora de Rentabilidad Diaria
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Conecta tu tienda de Tiendanube y calcula la rentabilidad de tu negocio en tiempo real
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <div className="flex items-center mb-4">
            <ShoppingBag className="w-8 h-8 text-konrad-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">
              ¿Qué puedes hacer?
            </h2>
          </div>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <TrendingUp className="w-5 h-5 text-konrad-500 mr-2" />
              Obtener datos de ventas automáticamente
            </li>
            <li className="flex items-center">
              <DollarSign className="w-5 h-5 text-konrad-500 mr-2" />
              Calcular rentabilidad diaria en tiempo real
            </li>
            <li className="flex items-center">
              <Package className="w-5 h-5 text-konrad-500 mr-2" />
              Analizar costos de productos y envíos
            </li>
            <li className="flex items-center">
              <Truck className="w-5 h-5 text-konrad-500 mr-2" />
              Optimizar gastos publicitarios
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <ShoppingBag className="w-8 h-8 text-konrad-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Cómo funciona
            </h2>
          </div>
          <ol className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="bg-konrad-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
              Conecta tu cuenta de Tiendanube de forma segura
            </li>
            <li className="flex items-start">
              <span className="bg-konrad-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
              Ingresa tus costos diarios (publicidad, productos, envíos)
            </li>
            <li className="flex items-start">
              <span className="bg-konrad-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
              Ve tu rentabilidad calculada automáticamente
            </li>
          </ol>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleTiendanubeAuth}
          className="btn-primary text-lg px-8 py-4 inline-flex items-center"
        >
          <ShoppingBag className="w-6 h-6 mr-3" />
          Vincular Tiendanube
        </button>
        <p className="text-sm text-gray-500 mt-4">
          La conexión es segura y solo accedemos a los datos necesarios para el cálculo
        </p>
      </div>

      <div className="mt-16 text-center text-gray-500">
        <p>Desarrollado por <span className="font-medium text-konrad-600">pictoN</span> para optimizar tu negocio</p>
      </div>
    </div>
  )
}

