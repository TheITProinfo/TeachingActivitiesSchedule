// Jest setup file
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
        };
    },
    usePathname() {
        return '';
    },
    useSearchParams() {
        return new URLSearchParams();
    },
}));

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                data: [],
                error: null,
            })),
            insert: jest.fn(() => ({
                data: null,
                error: null,
            })),
            update: jest.fn(() => ({
                data: null,
                error: null,
            })),
            delete: jest.fn(() => ({
                data: null,
                error: null,
            })),
        })),
        auth: {
            getUser: jest.fn(() => ({
                data: { user: null },
                error: null,
            })),
            signInWithOAuth: jest.fn(),
            signOut: jest.fn(),
        },
    })),
}));
