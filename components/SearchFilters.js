'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Search filters component for filtering teaching activities
 * Supports date range, title, and speaker name filtering
 */
export default function SearchFilters({ onFilterChange }) {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        title: '',
        speaker: '',
    });

    // Trigger filter change whenever filters update
    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const t = useTranslations('filters');
    const tCommon = useTranslations('common');

    // ... (state logic remains the same)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReset = () => {
        setFilters({
            startDate: '',
            endDate: '',
            title: '',
            speaker: '',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('title')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Start date filter */}
                <div>
                    <label htmlFor="startDate" className="label">
                        {t('startDate')}
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                </div>

                {/* End date filter */}
                <div>
                    <label htmlFor="endDate" className="label">
                        {t('endDate')}
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                </div>

                {/* Title filter */}
                <div>
                    <label htmlFor="title" className="label">
                        {t('activityTitle')}
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={filters.title}
                        onChange={handleInputChange}
                        placeholder={t('activityTitlePlaceholder')}
                        className="input-field"
                    />
                </div>

                {/* Speaker filter */}
                <div>
                    <label htmlFor="speaker" className="label">
                        {t('speaker')}
                    </label>
                    <input
                        type="text"
                        id="speaker"
                        name="speaker"
                        value={filters.speaker}
                        onChange={handleInputChange}
                        placeholder={t('speakerPlaceholder')}
                        className="input-field"
                    />
                </div>
            </div>

            {/* Reset button */}
            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleReset}
                    className="btn-secondary"
                >
                    {t('resetFilters')}
                </button>
            </div>
        </div>
    );
}
