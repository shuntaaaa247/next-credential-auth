import CredentialsProvider from 'next-auth/providers/credentials'
import { randomUUID, randomBytes } from 'crypto'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  /* providers */
  providers: [
    // ユーザ用認証
    CredentialsProvider({
      id: 'user',
      name: 'User',
      credentials: {
        email: { label: 'メールアドレス', type: 'email', placeholder: 'メールアドレス' },
        password: { label: 'パスワード', type: 'password' }
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:3000/api/auth/user", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const json = await res.json();
        const user = json.user;
        // const userSession = { id, username, email }
        // const userSession = { name: username, email: email }

        if (res.ok && json ) {
          return user;
        }

        return null;
      },
    }),
  ],

  /* callbacks */
  callbacks: {
  },

  /* secret */
  secret: process.env.NEXTAUTH_SECRET,

  /* jwt */
  jwt: {
    maxAge: 3 * 24 * 60 * 60,       // 3 days 
    // maxAge: 60,       // 60 secondss 
  },


  /* session */
  session: {
    maxAge: 30 * 24 * 60 * 60,      // 30 days
    // maxAge: 60,      // 60 seconds
    updateAge: 24 * 60 * 60,        // 24 hours
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex")
    }
  },

  // //認証されていない場合の遷移先
  pages: {
    signIn: '/sign-in',
  },
  
}