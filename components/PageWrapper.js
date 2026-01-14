'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Page wrapper component with header and footer
 * Includes language switcher and navigation
 */
export default function PageWrapper({ children }) {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <>
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-primary-700">
                            {t('common.appName')}
                        </h1>
                        <div className="flex items-center gap-4">
                            <nav className="flex gap-4">
                                <a
                                    href={`/${locale}`}
                                    className="text-gray-600 hover:text-primary-600 transition-colors"
                                >
                                    {t('common.home')}
                                </a>
                                <a
                                    href={`/${locale}/admin`}
                                    className="text-gray-600 hover:text-primary-600 transition-colors"
                                >
                                    {t('common.admin')}
                                </a>
                            </nav>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-gray-600 text-sm">
                        {t('footer.copyright')}
                    </p>
                </div>
            </footer>
        </>
    );
}
