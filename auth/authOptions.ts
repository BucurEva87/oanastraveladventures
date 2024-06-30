import { NextAuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from "../src/prisma/client"

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: 'Email address',
          type: 'text',
          placeholder: 'janedoe@example.com'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email
          }
        }) as any

        if (!user) return null

        const bcrypt = require('bcrypt')

        if (!(await bcrypt.compare(
          credentials?.password,
          user.password
        ))) return null
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    })
  ],
  // callbacks: {
  //   jwt: async ({ token, user, trigger, session }) => {
  //     if (trigger === 'update')
  //       return { ...token, ...session.user }

  //     return { ...token, ...user }
  //   },
  //   session: async ({ session, token }) => {
  //     session.user = token.user!

  //     return session
  //   }
  // },
  session: {
    strategy: 'jwt'
  }
}

export default authOptions
