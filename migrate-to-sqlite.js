const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
require('dotenv').config();

async function migrate() {
    console.log('Starting Migration from MySQL to SQLite...');

    const dbName = process.env.DB_NAME || 'elite_cabs';
    
    // 1. Connect to MySQL
    let mysqlConn;
    try {
        mysqlConn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName
        });
        console.log('Connected to MySQL.');
    } catch (err) {
        console.error('Failed to connect to MySQL:', err.message);
        console.log('Ensure MySQL is running and credentials in .env are correct.');
        return;
    }

    // 2. Connect to SQLite
    const sqliteDb = await open({
        filename: `./${dbName}.db`,
        driver: sqlite3.Database
    });
    console.log(`Connected to SQLite (${dbName}.db).`);

    const tables = ['passengers', 'drivers', 'admins', 'bookings'];

    for (const table of tables) {
        console.log(`Migrating table: ${table}...`);
        
        // Get data from MySQL
        const [rows] = await mysqlConn.query(`SELECT * FROM ${table}`);
        console.log(`Fetched ${rows.length} rows from MySQL ${table}.`);

        if (rows.length === 0) continue;

        // Prepare Insert into SQLite
        const columns = Object.keys(rows[0]);
        const placeholders = columns.map(() => '?').join(', ');
        const insertSql = `INSERT OR REPLACE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

        for (const row of rows) {
            const values = columns.map(col => row[col]);
            await sqliteDb.run(insertSql, values);
        }
        console.log(`Finished migrating ${table}.`);
    }

    await mysqlConn.end();
    console.log('Migration complete!');
}

migrate().catch(err => {
    console.error('Migration failed:', err);
});
