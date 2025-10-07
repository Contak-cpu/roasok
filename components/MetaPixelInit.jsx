'use client'

import { useEffect } from 'react'
import { initMetaPixel } from '@/lib/meta-pixel'

export default function MetaPixelInit() {
  useEffect(() => {
    // Inicializar Meta Pixel cuando se carga la aplicación
    initMetaPixel()
  }, [])

  // Este componente no renderiza nada visible
  return null
}
