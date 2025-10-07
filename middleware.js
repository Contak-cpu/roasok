import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware personalizado si es necesario
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Permitir acceso a rutas públicas
        if (req.nextUrl.pathname === '/') {
          return true
        }
        
        // Requerir autenticación para otras rutas
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*'
  ]
}
