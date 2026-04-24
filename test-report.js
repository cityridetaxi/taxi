const mysql = require('mysql2/promise');
const axios = require('axios');
const PDFDocument = require('pdfkit');
require('dotenv').config();

async function testDailyReport() {
    console.log('\n🚀 [CITYRIDE] INITIALIZING ADVANCED BACKUP PROBE...');
    console.log('--------------------------------------------------');

    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('✅ DATABASE LINK ESTABLISHED.');

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // 1. Data Retrieval
        console.log('📊 Fetching Real-Time Metrics...');
        const [bookings] = await conn.query(`
            SELECT b.*, 
                   u.name as customer_name, u.phone as customer_phone, u.email as customer_email,
                   d.name as driver_name, d.phone as driver_phone, d.car_model, d.car_number
            FROM bookings b 
            LEFT JOIN passengers u ON b.user_id = u.id 
            LEFT JOIN drivers d ON b.driver_id = d.id 
            WHERE b.created_at >= ?
        `, [todayStart]);
        
        let dailyRevenue = 0;
        bookings.forEach(b => {
             if (b.status === 'completed') dailyRevenue += parseFloat(b.fare.replace(/[^0-9.]/g, '')) || 0;
        });

        // 2. CSV Generation
        console.log('📎 Synthesizing Extended CSV Data...');
        const csvRows = ['ID,Status,Fare,Customer,Cust_Phone,Cust_Email,Pickup,Drop,Car_Type,Driver,Driver_Phone,Car_Model,Plate'];
        bookings.forEach(b => {
            csvRows.push(`${b.id},${b.status},"${b.fare}","${b.customer_name || 'Walk-in'}","${b.customer_phone || ''}","${b.customer_email || ''}","${b.pickup_loc}","${b.drop_loc}","${b.vehicle_type}","${b.driver_name || 'Unassigned'}","${b.driver_phone || ''}","${b.car_model || ''}","${b.car_number || ''}"`);
        });
        const csvB64 = Buffer.from(csvRows.join('\n')).toString('base64');

        // 3. PDF Generation
        console.log('📄 Rendering Professional PDF Visuals...');
        const pdfB64 = await new Promise((resolve) => {
            const doc = new PDFDocument({ margin: 30, size: 'A4' });
            const chunks = [];
            doc.on('data', c => chunks.push(c));
            doc.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
            
            // Header
            doc.rect(0, 0, 600, 80).fill('#1a1a1a');
            
            try {
                const logoPath = path.join(__dirname, 'public', 'logo.png');
                doc.image(logoPath, 30, 25, { width: 30 });
                doc.fillColor('#ff5252').fontSize(20).text('CITYRIDE TEST AUDIT', 75, 30);
            } catch (err) {
                doc.fillColor('#ff5252').fontSize(20).text('CITYRIDE TEST AUDIT', 40, 30);
            }
            
            // Metrics
            doc.fillColor('#333333').fontSize(10).text('SUMMARY METRICS', 40, 100);
            doc.rect(40, 115, 150, 50).fill('#f0f0f0');
            doc.fillColor('#000').text('TOTAL MISSIONS', 50, 125);
            doc.fontSize(14).text(bookings.length.toString(), 50, 140);

            // Table
            doc.fillColor('#000').fontSize(12).text('MISSION LOG', 40, 190);
            doc.rect(40, 205, 515, 15).fill('#1a1a1a');
            doc.fillColor('#fff').fontSize(8).text('ID', 50, 210);
            doc.text('STATUS', 100, 210);
            doc.text('ROUTE', 200, 210);

            let rowY = 220;
            bookings.slice(0, 10).forEach((b, i) => {
                if (i % 2 === 0) doc.rect(40, rowY, 515, 20).fill('#f9f9f9');
                doc.fillColor('#444').text(b.id.toString(), 50, rowY + 5);
                doc.text(b.status.toUpperCase(), 100, rowY + 5);
                doc.text(`${b.pickup_loc.substring(0, 25)}...`, 200, rowY + 5);
                rowY += 20;
            });
            
            doc.end();
        });

        // 4. BREVO DISPATCH
        console.log('📡 Tunneling Packet via Brevo HTTP API...');
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: 'CityRide Test', email: process.env.BREVO_SENDER_EMAIL },
            to: [{ email: process.env.REPORT_RECEIVER_EMAIL }],
            subject: `[PROBE] Advanced Backup Trace - ${new Date().toLocaleTimeString()}`,
            htmlContent: `<h3>Backup Subsystem: VERIFIED</h3><p>Revenue: ${dailyRevenue}</p>`,
            attachment: [
                { content: csvB64, name: 'test_dataset.csv' },
                { content: pdfB64, name: 'test_report.pdf' }
            ]
        }, {
            headers: { 'api-key': process.env.BREVO_API_KEY }
        });

        console.log('--------------------------------------------------');
        console.log(`✅ SUCCESS! Packet Routed. ID: ${response.data.messageId}`);
        console.log('🚀 [CITYRIDE] ADVANCED PROBE COMPLETED.');

    } catch (err) {
        console.log('--------------------------------------------------');
        const msg = err.response ? JSON.stringify(err.response.data) : err.message;
        console.error('❌ PROBE FAILURE:', msg);
    } finally {
        if (conn) await conn.end();
    }
}

testDailyReport();
