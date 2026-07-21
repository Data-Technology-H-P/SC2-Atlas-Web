import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleRequest = createMiddleware(routing);

// Next.js 16 Proxy named export
export function proxy(request: NextRequest) {
  return handleRequest(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
