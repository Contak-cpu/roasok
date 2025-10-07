import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Simulación de base de datos para tokens y usuarios
const users = new Map()
const tokens = new Map()

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'tiendanube',
      name: 'Tiendanube',
      credentials: {
        access_token: { label: 'Access Token', type: 'text' },
        store_id: { label: 'Store ID', type: 'text' },
        store_name: { label: 'Store Name', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.access_token) {
          return null
        }

        // Simular verificación del token con Tiendanube
        const user = {
          id: credentials.store_id || 'default-user',
          name: credentials.store_name || 'Mi Tienda',
          email: `store-${credentials.store_id}@tiendanube.com`,
          accessToken: credentials.access_token,
          storeId: credentials.store_id
        }

        // Guardar token para uso posterior
        tokens.set(user.id, credentials.access_token)
        users.set(user.id, user)

        return user
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.storeId = user.storeId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.accessToken = token.accessToken
        session.user.storeId = token.storeId
        session.user.id = token.sub
      }
      return session
    }
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
}

export default NextAuth(authOptions)

// Funciones auxiliares para manejo de tokens
export const getStoredToken = (userId) => {
  return tokens.get(userId)
}

export const storeToken = (userId, token) => {
  tokens.set(userId, token)
}

export const getStoredUser = (userId) => {
  return users.get(userId)
}
