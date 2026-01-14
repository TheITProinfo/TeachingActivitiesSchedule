'use client';

import { useState } from 'react';
import { toInputDateTime } from '@/lib/utils/formatDate';
import { useTranslations } from 'next-intl';

/**
 * Activity form component for creating and editing activities
 * Used in admin panel
 */
export default function ActivityForm({ activity, onSubmit, onCancel }) {
    const t = useTranslations('admin');
    const tCommon = useTranslations('common');
    const tActivity = useTranslations('activity');

    const [formData, setFormData] = useState({
        title: activity?.title || '',
        start_time: activity?.start_time ? toInputDateTime(activity.start_time) : '',
        end_time: activity?.end_time ? toInputDateTime(activity.end_time) : '',
        location: activity?.location || '',
        speaker: activity?.speaker || '',
        description: activity?.description || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate dates
        if (new Date(formData.start_time) >= new Date(formData.end_time)) {
            setError(t('endTimeError'));
            setLoading(false);
            return;
        }

        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.message || t('saveFailed', { error: 'Unknown error' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activity ? t('editActivity') : t('newActivity')}
            </h2>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            <div className="space-y-4">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="label">
                        {tActivity('title')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder={t('titlePlaceholder')}
                    />
                </div>

                {/* Start time */}
                <div>
                    <label htmlFor="start_time" className="label">
                        {tActivity('startTime')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        id="start_time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                {/* End time */}
                <div>
                    <label htmlFor="end_time" className="label">
                        {tActivity('endTime')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        id="end_time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="label">
                        {tActivity('location')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder={t('locationPlaceholder')}
                    />
                </div>

                {/* Speaker */}
                <div>
                    <label htmlFor="speaker" className="label">
                        {tActivity('speaker')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="speaker"
                        name="speaker"
                        value={formData.speaker}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder={t('speakerPlaceholder')}
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="label">
                        {tActivity('description')}
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="input-field resize-none"
                        placeholder={t('descriptionPlaceholder')}
                    />
                </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-4 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="btn-secondary"
                >
                    {tCommon('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? t('saving') : activity ? t('saveChanges') : t('createActivity')}
                </button>
            </div>
        </form>
    );
}
