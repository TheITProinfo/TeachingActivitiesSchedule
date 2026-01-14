'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import SearchFilters from '@/components/SearchFilters';
import ActivityCard from '@/components/ActivityCard';
import PageWrapper from '@/components/PageWrapper';

/**
 * Home page - displays all teaching activities with filtering
 * Supports real-time search with date range, title, and speaker filters
 * Now with i18n support
 */
export default function HomePage() {
    const t = useTranslations();
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const supabase = createClient();

    // Fetch all activities on mount
    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('teaching_activities')
                .select('*')
                .order('start_time', { ascending: true });

            if (error) throw error;

            setActivities(data || []);
            setFilteredActivities(data || []);
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError(t('admin.loadFailed'));
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes - real-time filtering
    const handleFilterChange = useCallback((filters) => {
        let filtered = [...activities];

        // Filter by date range
        if (filters.startDate) {
            filtered = filtered.filter(
                (activity) => new Date(activity.start_time) >= new Date(filters.startDate)
            );
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(
                (activity) => new Date(activity.end_time) <= endDate
            );
        }

        // Filter by title
        if (filters.title) {
            filtered = filtered.filter((activity) =>
                activity.title.toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        // Filter by speaker
        if (filters.speaker) {
            filtered = filtered.filter((activity) =>
                activity.speaker.toLowerCase().includes(filters.speaker.toLowerCase())
            );
        }

        setFilteredActivities(filtered);
    }, [activities]);

    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('home.title')}
                    </h1>
                    <p className="text-gray-600">
                        {t('home.subtitle')}
                    </p>
                </div>

                {/* Search filters */}
                <SearchFilters onFilterChange={handleFilterChange} />

                {/* Loading state */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <p className="mt-4 text-gray-600">{t('common.loading')}</p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Activities grid */}
                {!loading && !error && (
                    <>
                        {/* Results count */}
                        <div className="mb-4">
                            <p className="text-gray-600">
                                {t('home.resultsCount', { count: filteredActivities.length })}
                            </p>
                        </div>

                        {/* Activities list */}
                        {filteredActivities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredActivities.map((activity) => (
                                    <ActivityCard key={activity.id} activity={activity} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="mt-4 text-gray-600">
                                    {t('home.noResults')}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageWrapper>
    );
}
