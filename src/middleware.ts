import { NextResponse } from "next/server"
import { withAuth } from 'next-auth/middleware'

const authorization = {
  admin: 'unauthorized'
}

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string
    const pathname = req.nextUrl.pathname
    const rule = authorization[
      pathname.split('/')[1].toLowerCase() as keyof typeof authorization
    ]
    const accessManagingRights = ['ADMIN', 'MODERATOR']

    // console.log(req.nextauth.token)

    if (!rule) return
    if (!role || !accessManagingRights.includes(role))
      return NextResponse.redirect(new URL(`/errors/${rule}`, req.url))
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
