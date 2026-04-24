const mysql = require('mysql2/promise');
require('dotenv').config();

async function clearDatabase() {
    console.log('\n⚠️  [CITYRIDE] INITIALIZING LOGISTICS DATA PURGE...');
    console.log('--------------------------------------------------');

    const dbConfig = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };

    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('📡 Connected to Mainframe.');

        // 1. Disable Foreign Key Checks (Safe Purge)
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        console.log('🔓 Integrity Checks Suspended.');

        // 2. Identify Tables
        const tables = ['bookings', 'passengers', 'drivers', 'otps', 'admins'];
        
        for (const table of tables) {
            console.log(`🧹 Purging Table: ${table}...`);
            await db.query(`TRUNCATE TABLE \`${table}\``);
        }

        // 3. Re-enable Integrations
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('🔒 Integrity Checks Restored.');

        // 4. Re-Initialize Default Admin
        console.log('👑 Re-establishing System Admin Presence...');
        await db.query(`
            INSERT INTO admins (id, name, email, password) 
            VALUES (1, 'System Admin', 'admin@cityridetaxi', 'adminpass')
        `);

        console.log('--------------------------------------------------');
        console.log('✅ DATABASE RESET COMPLETED SUCCESSFULLY.');
        console.log('✨ All platform data has been cleared.');

    } catch (err) {
        console.error('\n❌ PURGE FAILED:', err.message);
    } finally {
        if (db) await db.end();
        process.exit();
    }
}

// Start Purge
clearDatabase();
