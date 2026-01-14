import { formatTimeRange } from '@/lib/utils/formatDate';
import { useLocale } from 'next-intl';

/**
 * Activity card component to display a single teaching activity
 */
export default function ActivityCard({ activity }) {
    const locale = useLocale();

    return (
        <div className="card animate-fade-in">
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {activity.title}
            </h3>

            {/* Time */}
            <div className="flex items-center text-gray-600 mb-2">
                <svg
                    className="w-5 h-5 mr-2 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span className="text-sm">
                    {formatTimeRange(activity.start_time, activity.end_time, locale)}
                </span>
            </div>

            {/* Location */}
            <div className="flex items-center text-gray-600 mb-2">
                <svg
                    className="w-5 h-5 mr-2 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
                <span className="text-sm">{activity.location}</span>
            </div>

            {/* Speaker */}
            <div className="flex items-center text-gray-600 mb-3">
                <svg
                    className="w-5 h-5 mr-2 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
                <span className="text-sm font-medium">{activity.speaker}</span>
            </div>

            {/* Description */}
            {activity.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-700 text-sm leading-relaxed">
                        {activity.description}
                    </p>
                </div>
            )}
        </div>
    );
}
