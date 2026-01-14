import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';

/**
 * Admin layout - wraps all admin pages
 * Ensures user is authenticated and has admin role
 */
export default async function AdminLayout({ children, params: { locale } }) {
    const t = await getTranslations('admin');
    const tCommon = await getTranslations('common');
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect(`/${locale}/login`);
    }

    // Check admin role
    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (!roleData || roleData.role !== 'admin') {
        redirect(`/${locale}`);
    }

    // Handle logout
    const handleLogout = async () => {
        'use server';
        const supabase = createClient();
        await supabase.auth.signOut();
        redirect(`/${locale}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Admin header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {t('welcome', { email: user.email })}
                            </p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <LanguageSwitcher />
                            <a
                                href={`/${locale}`}
                                className="text-gray-600 hover:text-primary-600 transition-colors"
                            >
                                {tCommon('back')}
                            </a>
                            <form action={handleLogout}>
                                <button
                                    type="submit"
                                    className="text-red-600 hover:text-red-700 transition-colors"
                                >
                                    {tCommon('logout')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    );
}
