import { createClient } from '@/lib/supabase/server';

/**
 * Check if the current user has admin role
 * @returns {Promise<boolean>} True if user is admin, false otherwise
 */
export async function checkAdmin() {
    const supabase = createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return false;
    }

    // Check if user has admin role in user_roles table
    const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (roleError || !roleData) {
        return false;
    }

    return roleData.role === 'admin';
}

/**
 * Get current user's role
 * @returns {Promise<string|null>} User's role or null if not found
 */
export async function getUserRole() {
    const supabase = createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return null;
    }

    const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (roleError || !roleData) {
        return 'user'; // Default role
    }

    return roleData.role;
}
