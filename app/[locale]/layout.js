import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';

/**
 * Root layout for locale-specific pages
 * Wraps all pages with NextIntlClientProvider for translations
 */
export async function generateMetadata({ params: { locale } }) {
    const messages = await getMessages();

    return {
        title: messages.common?.appName || '教学活动日程表',
        description: locale === 'en'
            ? 'View and manage teaching activities schedule'
            : '查看和管理教学活动日程安排',
    };
}

export default async function LocaleLayout({ children, params: { locale } }) {
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <div className="min-h-screen flex flex-col">
                        {children}
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
