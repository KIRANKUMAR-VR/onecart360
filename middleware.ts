import { updateSession } from '@/lib/supabase/proxy'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = await updateSession(request)
  
  // Protected routes that require authentication
  const protectedPaths = ['/', '/items']
  const publicPaths = ['/auth/login', '/auth/sign-up', '/auth/callback', '/auth/error', '/auth/sign-up-success']
  
  const pathname = request.nextUrl.pathname
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Get user session
  const user = response.headers.get('x-user-id')
  
  if (isProtectedPath && !user && !isPublicPath) {
    // Redirect to login if accessing protected route without auth
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  if (isPublicPath && user) {
    // Redirect to dashboard if already logged in and trying to access auth pages
    if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/sign-up')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
