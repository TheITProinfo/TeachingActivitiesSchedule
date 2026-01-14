/**
 * Admin Setup Script
 * This script checks if an admin user exists and creates one if needed
 * 
 * Usage: node scripts/setup-admin.js
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wuiqyugtpjuboftzohrp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
    console.error('Please add it to your .env.local file');
    process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkAndCreateAdmin() {
    console.log('🔍 Checking for existing admin users...\n');

    try {
        // Check existing user_roles
        const { data: existingRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('*');

        if (rolesError) {
            console.error('❌ Error fetching user_roles:', rolesError.message);
            return;
        }

        console.log(`📊 Found ${existingRoles.length} user role(s) in database`);

        if (existingRoles.length > 0) {
            console.log('\n👥 Existing user roles:');
            for (const role of existingRoles) {
                console.log(`   - User ID: ${role.user_id}`);
                console.log(`     Role: ${role.role}`);
                console.log(`     Created: ${new Date(role.created_at).toLocaleString()}\n`);
            }
        }

        // Check for admin users
        const adminUsers = existingRoles.filter(r => r.role === 'admin');

        if (adminUsers.length > 0) {
            console.log(`✅ Found ${adminUsers.length} admin user(s)`);
            console.log('\n✨ Admin setup is complete!');
            return;
        }

        console.log('⚠️  No admin users found\n');

        // Get all authenticated users
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

        if (usersError) {
            console.error('❌ Error fetching users:', usersError.message);
            return;
        }

        if (users.length === 0) {
            console.log('📝 No users found in the system');
            console.log('\nNext steps:');
            console.log('1. Visit http://localhost:3000/login');
            console.log('2. Sign in with Google or GitHub');
            console.log('3. Run this script again to make yourself an admin');
            return;
        }

        console.log(`\n👤 Found ${users.length} user(s) in the system:\n`);
        users.forEach((user, index) => {
            console.log(`${index + 1}. Email: ${user.email || 'No email'}`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Created: ${new Date(user.created_at).toLocaleString()}\n`);
        });

        // Prompt user to select which user to make admin
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter the number of the user to make admin (or 0 to cancel): ', async (answer) => {
            const selection = parseInt(answer);

            if (selection === 0 || isNaN(selection)) {
                console.log('❌ Cancelled');
                rl.close();
                return;
            }

            if (selection < 1 || selection > users.length) {
                console.log('❌ Invalid selection');
                rl.close();
                return;
            }

            const selectedUser = users[selection - 1];
            console.log(`\n🔧 Making ${selectedUser.email} an admin...`);

            // Insert admin role
            const { error: insertError } = await supabase
                .from('user_roles')
                .insert([
                    {
                        user_id: selectedUser.id,
                        role: 'admin'
                    }
                ]);

            if (insertError) {
                console.error('❌ Error creating admin:', insertError.message);
                rl.close();
                return;
            }

            console.log('✅ Successfully created admin user!');
            console.log(`\n📧 Admin email: ${selectedUser.email}`);
            console.log(`🆔 User ID: ${selectedUser.id}`);
            console.log('\n✨ You can now log in and access the admin panel at /admin');

            rl.close();
        });

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

// Run the script
checkAndCreateAdmin();
