'use client';

import { formatDateTime } from '@/lib/utils/formatDate';
import { useTranslations, useLocale } from 'next-intl';

/**
 * Activity list component for admin panel
 * Displays all activities with edit and delete actions
 */
export default function ActivityList({ activities, onEdit, onDelete }) {
    const t = useTranslations('admin');
    const tCommon = useTranslations('common');
    const tActivity = useTranslations('activity');
    const locale = useLocale();

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {tActivity('title')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {tActivity('startTime')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {tActivity('location')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {tActivity('speaker')}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {tCommon('edit')} / {tCommon('delete')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {activities.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    {t('noActivities')}
                                </td>
                            </tr>
                        ) : (
                            activities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {activity.title}
                                        </div>
                                        {activity.description && (
                                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {activity.description}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {formatDateTime(activity.start_time, locale)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{activity.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{activity.speaker}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => onEdit(activity)}
                                            className="text-primary-600 hover:text-primary-900 mr-4"
                                        >
                                            {tCommon('edit')}
                                        </button>
                                        <button
                                            onClick={() => onDelete(activity.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            {tCommon('delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
