import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['zh', 'en'];

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !locales.includes(locale)) {
        locale = 'zh';
    }

    console.log('>>>>>>>>>>> I18N CONFIG RESOLVED LOCALE:', locale);

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});
