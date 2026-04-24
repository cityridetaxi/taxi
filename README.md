# CityRide Taxi Platform 🚖

CityRide is a complete, full-stack taxi management and booking ecosystem. It provides a seamless experience for Passengers to book rides, Drivers to accept and manage trips, and Administrators to oversee operations through a centralized dashboard.

## 🚀 Core Features

### 👤 Passenger Experience
- **One-Touch Identity**: Secure authentication with **Email OTP Verification** to ensure high-quality leads.
- **Dynamic Booking**: Intelligent fare estimation based on destination and selected vehicle type (Sedan or SUV).
- **Ride Reliability**: Real-time ride assignment notifications and cancellation enforcement rules (3-strike daily policy to prevent system abuse).
- **History Tracking**: Complete log of past and active journeys with driver and car details.

### 🚕 Driver (Partner Pilot) Ecosystem
- **Intelligent Dispatch**: Automated pending-rides queue filtered by the driver's vehicle type.
- **Wallet-Based Incentivization**: Prepaid wallet system that deducts a small platform fee (10% of fare) upon ride acceptance.
- **Mission Console**: Dedicated driver interface to start, track, and complete assigned missions.
- **Transparent Yields**: Real-time view of wallet balance and earnings history.

### 🛡️ Administration & Operations
- **Central Intelligence**: Comprehensive dashboard showing real-time metrics (total bookings, active rides, revenue, and fleet count).
- **Fleet Control**: Full management of the driver registry, including wallet updates and ride reassignment (Transfer-a-Ride).
- **Automated Intelligence**: Daily platform performance reports sent automatically to the administrator's inbox at 11:59 PM.
- **System Maintenance**: Hourly automated cleanup of expired OTPs and temporary data.

---

## 🛠️ Technical Stack

- **Backend**: Node.js & Express.js
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (No heavy frameworks for maximum performance).
- **Database**:
    - **Primary**: MySQL (Optimized for production and Railway.app deployment).
    - **Fallback/Local**: SQLite (Support for easy local development).
- **Communication**: Nodemailer (SMTP) for OTPs and performance reporting.
- **Scheduling**: Node-cron for background tasks.
- **Maps**: Mapbox integration for location services.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Port
PORT=3000

# MySQL Database Connection
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Reporting & Auth Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_SENDER=your_email@gmail.com

# Target Email for Daily Reports
REPORT_RECEIVER_EMAIL=admin_email@example.com

# Optional: Mapbox Access Token
MAPBOX_ACCESS_TOKEN=pk.your_token_here
```

---

## 📦 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Initialization**:
   The application is designed to auto-provision its schema. On the first run, the server will:
   - Create the database if it doesn't exist.
   - Initialize tables: `passengers`, `drivers`, `admins`, `bookings`, and `otps`.
   - Seed a default admin account.

3. **Start the Engine**:
   ```bash
   npm start
   ```

4. **Access the Portals**:
   - **User Home**: `http://localhost:3000/`
   - **Passenger Login**: `http://localhost:3000/auth.html`
   - **Driver Console**: `http://localhost:3000/driver-login.html`
   - **Admin Command Center**: `http://localhost:3000/admin-login.html`

---

## 🛡️ Default Admin Credentials
- **Email**: `admin@cityridetaxi`
- **Password**: `adminpass`
*(Highly recommended to change these in the database immediately after first launch)*

---

## 📅 Maintenance Cycles
- **Hourly**: System cleans up expired OTP codes from the database.
- **Daily (11:59 PM)**: An Intel Report is generated and emailed to the administrator, detailing daily revenue and ride completion metrics.

---

## 🗄️ Database Tools
- `migrate-to-sqlite.js`: Helper script to migrate from MySQL to local SQLite.
- `clear-db.js`: Utility to reset the database for testing.
- `test-report.js`: Manual trigger for the daily intelligence report.

---

Developed with ❤️ for the next generation of logistics management.
