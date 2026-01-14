'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Language switcher component
 * Allows users to switch between Chinese (zh) and English (en)
 */
export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = (newLocale) => {
        // Replace the current locale in the pathname with the new one
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPathname);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => switchLanguage('zh')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${locale === 'zh'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                aria-label="Switch to Chinese"
            >
                中文
            </button>
            <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${locale === 'en'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                aria-label="Switch to English"
            >
                EN
            </button>
        </div>
    );
}
