'use client'

import { useState, useEffect } from 'react'
import { 
  Facebook, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Settings,
  BarChart3
} from 'lucide-react'
import { getPixelStatus, trackEvent } from '@/lib/meta-pixel'

export default function MetaPixelButton() {
  const [pixelStatus, setPixelStatus] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [pixelId, setPixelId] = useState('')

  useEffect(() => {
    setPixelStatus(getPixelStatus())
  }, [])

  const handleConnectPixel = () => {
    if (!pixelId.trim()) {
      alert('Por favor ingresa tu Pixel ID de Meta')
      return
    }

    // Aquí normalmente guardarías el Pixel ID en la base de datos
    // Por ahora simulamos la configuración
    const newPixelId = pixelId.trim()
    
    // Simular configuración exitosa
    setPixelStatus({
      enabled: true,
      pixelId: newPixelId,
      loaded: true
    })
    
    // Trackear la conexión del pixel
    trackEvent('CompleteRegistration', {
      content_name: 'Meta Pixel Connection',
      content_category: 'Analytics Setup'
    })
    
    setShowConfig(false)
    alert('Meta Pixel configurado exitosamente!')
  }

  const handleDisconnectPixel = () => {
    setPixelStatus({
      enabled: false,
      pixelId: null,
      loaded: false
    })
    alert('Meta Pixel desconectado')
  }

  const openMetaBusinessManager = () => {
    window.open('https://business.facebook.com/events_manager', '_blank')
  }

  const openPixelHelper = () => {
    window.open('https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc', '_blank')
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Facebook className="w-5 h-5 mr-2 text-blue-600" />
          Meta Pixel
        </h3>
        
        {pixelStatus?.enabled ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Conectado</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span className="text-sm">No conectado</span>
          </div>
        )}
      </div>

      {pixelStatus?.enabled ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Meta Pixel Activo
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ID: {pixelStatus.pixelId}
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={openMetaBusinessManager}
              className="btn-secondary text-sm flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Business Manager
            </button>
            
            <button
              onClick={openPixelHelper}
              className="btn-secondary text-sm flex items-center justify-center"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Pixel Helper
            </button>
          </div>

          <button
            onClick={handleDisconnectPixel}
            className="btn-secondary w-full text-sm"
          >
            Desconectar Pixel
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              ¿Qué es Meta Pixel?
            </h4>
            <p className="text-xs text-blue-600 mb-3">
              Meta Pixel te ayuda a trackear conversiones, optimizar anuncios y crear audiencias personalizadas.
            </p>
            
            <div className="space-y-2 text-xs text-blue-600">
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2" />
                <span>Trackear ventas automáticamente</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2" />
                <span>Optimizar campañas publicitarias</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2" />
                <span>Crear audiencias personalizadas</span>
              </div>
            </div>
          </div>

          {!showConfig ? (
            <button
              onClick={() => setShowConfig(true)}
              className="btn-primary w-full flex items-center justify-center"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Conectar Meta Pixel
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pixel ID de Meta
                </label>
                <input
                  type="text"
                  placeholder="Ej: 123456789012345"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Encuentra tu Pixel ID en Facebook Business Manager
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleConnectPixel}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Conectar
                </button>
                <button
                  onClick={() => setShowConfig(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={openMetaBusinessManager}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Abrir Facebook Business Manager
            </button>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          El Meta Pixel trackeará automáticamente tus ventas y optimizará tus anuncios
        </p>
      </div>
    </div>
  )
}
