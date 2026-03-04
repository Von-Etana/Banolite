const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createDemoUsers() {
    const users = [
        { email: 'buyer@demo.com', role: 'buyer', name: 'Demo Buyer' },
        { email: 'seller@demo.com', role: 'seller', name: 'Demo Seller' },
        { email: 'admin@demo.com', role: 'admin', name: 'Demo Admin' }
    ];

    for (const u of users) {
        console.log(`Processing ${u.email}...`);
        // Create or update user as admin
        const { data: user, error: createError } = await supabase.auth.admin.createUser({
            email: u.email,
            password: 'demo123456',
            email_confirm: true,
            user_metadata: { name: u.name, role: u.role }
        });

        if (createError) {
            if (createError.code === 'email_exists' || createError.message.includes('already been registered')) {
                console.log(`   User ${u.email} already exists. Enforcing email confirmation...`);
                const { data: searchData, error: searchError } = await supabase.auth.admin.listUsers();
                if (!searchError) {
                    const existingUser = searchData.users.find(x => x.email === u.email);
                    if (existingUser && !existingUser.email_confirmed_at) {
                        await supabase.auth.admin.updateUserById(existingUser.id, { email_confirm: true });
                        console.log(`   Confirmed email for existing ${u.email}`);
                    } else if (existingUser) {
                        console.log(`   Email already confirmed for existing ${u.email}`);
                    }
                }
            } else {
                console.error(`   Failed to create ${u.email}:`, createError);
            }
        } else {
            console.log(`   Successfully created and confirmed ${u.email}`);
            await new Promise(r => setTimeout(r, 1000));

            let profileData = { avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.role}` };
            if (u.role === 'seller') {
                profileData.store_name = 'Demo Store';
                profileData.store_description = 'Best digital products in town';
                profileData.wallet_balance = 1250.50;
            }
            await supabase.from('profiles').update(profileData).eq('id', user.user.id);
        }
    }
}

createDemoUsers().then(() => console.log('Done')).catch(console.error);
