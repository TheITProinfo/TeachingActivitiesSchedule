import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Middleware to handle internationalization and protect routes
 * Supports /zh (Chinese) and /en (English) routes
 * Protects /admin routes - only accessible to admin users
 */

// Create i18n middleware
const intlMiddleware = createMiddleware({
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    localePrefix: 'always'
});

export async function middleware(request) {
    // 1. Handle i18n first
    const response = intlMiddleware(request);

    // 2. Create Supabase client
    // We explicitly create a client for middleware to handle cookies correctly
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return request.cookies.get(name)?.value;
                },
                set(name, value, options) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name, options) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    // 3. Protect Admin Routes
    const pathname = request.nextUrl.pathname;
    // Check if accessing admin routes (e.g., /zh/admin, /en/admin)
    const isAdminRoute = pathname.match(/^\/(zh|en)\/admin/);

    if (isAdminRoute) {
        // Refresh session
        const { data: { user }, error } = await supabase.auth.getUser();

        // Extract locale from pathname for redirecting
        const locale = pathname.split('/')[1] || 'zh';

        // Redirect to login if not authenticated
        if (error || !user) {
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }

        // Check if user is admin
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        // Redirect to home if not admin
        if (!roleData || roleData.role !== 'admin') {
            return NextResponse.redirect(new URL(`/${locale}`, request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        // - … auth routes (callbacks) which shouldn't be validatd by i18n
        '/((?!api|auth|_next|_vercel|.*\\..*).*)',
    ],
};
