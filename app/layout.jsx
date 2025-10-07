import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Calculadora de Rentabilidad - Tiendanube',
  description: 'Calcula la rentabilidad diaria de tu negocio en Tiendanube',
  keywords: ['tiendanube', 'rentabilidad', 'calculadora', 'negocio'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-konrad-50 to-konrad-100">
          <header className="bg-white shadow-sm border-b border-konrad-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-konrad-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">K</span>
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Calculadora de Rentabilidad
                  </h1>
                </div>
                <div className="text-sm text-gray-500">
                  Desarrollado por <span className="font-medium text-konrad-600">pictoN</span>
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Providers>
              {children}
            </Providers>
          </main>
        </div>
      </body>
    </html>
  )
}
