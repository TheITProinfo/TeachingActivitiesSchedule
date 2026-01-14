'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import ActivityList from '@/components/admin/ActivityList';
import ActivityForm from '@/components/admin/ActivityForm';

/**
 * Admin page - manage teaching activities
 * Only accessible to admin users
 */
export default function AdminPage() {
    const t = useTranslations('admin');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [error, setError] = useState(null);

    const supabase = createClient();

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
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError(t('loadFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingActivity(null);
        setShowForm(true);
    };

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm(t('deleteConfirm'))) {
            return;
        }

        try {
            const { error } = await supabase
                .from('teaching_activities')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Refresh list
            await fetchActivities();
        } catch (err) {
            console.error('Error deleting activity:', err);
            alert(t('deleteFailed', { error: err.message }));
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingActivity) {
                // Update existing activity
                const { error } = await supabase
                    .from('teaching_activities')
                    .update({
                        ...formData,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', editingActivity.id);

                if (error) throw error;
            } else {
                // Create new activity
                const { error } = await supabase
                    .from('teaching_activities')
                    .insert([formData]);

                if (error) throw error;
            }

            // Close form and refresh list
            setShowForm(false);
            setEditingActivity(null);
            await fetchActivities();
        } catch (err) {
            console.error('Error saving activity:', err);
            throw new Error(err.message);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingActivity(null);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('activityManagement')}
                    </h1>
                    <p className="text-gray-600">
                        {t('activityManagementDesc')}
                    </p>
                </div>
                {!showForm && (
                    <button onClick={handleCreate} className="btn-primary">
                        {t('addActivity')}
                    </button>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Form or list */}
            {showForm ? (
                <ActivityForm
                    activity={editingActivity}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            <p className="mt-4 text-gray-600">{t('loading', { defaultValue: 'Loading...' })}</p>
                        </div>
                    ) : (
                        <ActivityList
                            activities={activities}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </>
            )}
        </div>
    );
}
