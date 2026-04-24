# CityRide Platform - Technical Documentation 📖

This document provides a deep dive into the technical architecture, API endpoints, and database schema of the CityRide Platform.

## 🏗️ Architecture Overview

The CityRide Platform is built on a **Monolithic Model** using a decoupled Frontend/Backend architecture.

- **Backend**: Uses Express.js as the core application framework. All logic is centralized in `server.js`.
- **Frontend**: Serves static HTML files from the `public/` directory. All dynamic logic is handled by `app.js` using the Fetch API.
- **Data Persistence**: Primary storage is MySQL. Schema auto-provisioning occurs during server startup.
- **Geospatial Services**: Uses a "Zero-Key" infrastructure for routing and geocoding, requiring no paid API subscriptions (Google Maps, etc.).

---

## 🌍 Zero-Key Infrastructure

CityRide is designed to be fully functional out-of-the-box without expensive API keys:

- **Routing (Distance Calculation)**: Powered by the **OSRM (Open Source Routing Machine)** public demo instance.
- **Geocoding & Autocomplete**: Powered by **Photon (by Komoot)**, providing global address lookups.
- **Interactive Maps**: Powered by **Leaflet.js** and **OpenStreetMap** tile layers.
- **Map Picker**: A custom-built Leaflet integration allows users to pin locations directly on a map if autocomplete fails.

---

## 🔒 Authentication & Authorization

The system uses a sessionless, tokenless authentication strategy (for simplicity in this version, it's state-managed via local storage in the browser, and the backend verifies passwords against current database records).

### Roles & Access Control
- **User (Passenger)**: Can book rides and view their history.
- **Driver (Partner Pilot)**: Can view pending jobs and accept them.
- **Admin**: Has full oversight of all platform data.

---

## 🛣️ API Endpoints Reference

### 🔐 Authentication API

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/send-otp` | Sends a 6-digit verification code to the passenger's email. |
| `POST` | `/api/auth/register` | Registers a new passenger after verifying the OTP. |
| `POST` | `/api/auth/login` | Authenticates a passenger using phone number and password. |
| `POST` | `/api/driver/login` | Authenticates a driver using email and password. |
| `POST` | `/api/admin/login` | Authenticates an administrator. |

### 🚗 Booking & Rides API

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/bookings/create` | Creates a new ride request in the `pending` state. |
| `POST` | `/api/user/cancel-ride` | Cancels a pending ride (enforces a daily ban if strikes exceed 3). |
| `GET` | `/api/user/bookings/:userId` | Retrieves the ride history of a specific passenger. |
| `POST` | `/api/bookings/accept` | (Driver) Accepts a pending ride and deducts the 10% platform fee. |
| `POST` | `/api/bookings/update-status` | Updates a ride status (e.g., `completed`, `cancelled`). |
| `GET` | `/api/driver/jobs/:driverId` | Lists all pending rides available for the driver's vehicle type. |
| `GET` | `/api/driver/my-jobs/:driverId` | Lists current/completed rides for a specific driver. |

### 🛠️ Administrative API

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Retrieves high-level platform health metrics. |
| `GET` | `/api/admin/bookings` | Lists all bookings in the system with associated player data. |
| `GET` | `/api/admin/users` | Lists all registered passengers. |
| `GET` | `/api/admin/drivers` | Lists all registered drivers and their wallet balances. |
| `POST` | `/api/admin/create-driver` | Inducts a new driver into the system. |
| `POST` | `/api/admin/update-driver-wallet` | Adjusts a driver's wallet balance manually. |
| `POST` | `/api/admin/transfer-ride` | (Emergency) Reassigns a ride to a different driver. |

---

## 🗄️ Database Schema Details

### 👥 `passengers` Table
Stores user information and ban status.
- `id` (INT PK AI)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `password` (VARCHAR)
- `phone` (VARCHAR UNIQUE)
- `banned_until` (DATETIME): Suspension date if the user exceeds the cancellation limit.
- `created_at` (TIMESTAMP)

### 🚕 `drivers` Table
Stores driver information, car details, and platform wallet balance.
- `id` (INT PK AI)
- `name` (VARCHAR)
- `email` (VARCHAR UNIQUE)
- `password` (VARCHAR)
- `phone` (VARCHAR)
- `car_model` (VARCHAR)
- `car_number` (VARCHAR)
- `vehicle_type` (VARCHAR): Enum-like values: `sedan`, `suv`.
- `wallet_balance` (DECIMAL): Credits used for accepting rides.

### 📅 `bookings` Table
The core transactional ledger of the application.
- `id` (INT PK AI)
- `user_id` (INT FK -> passengers.id)
- `pickup_loc` (TEXT)
- `drop_loc` (TEXT)
- `pickup_date` (DATE)
- `pickup_time` (TIME)
- `passengers` (INT)
- `vehicle_type` (VARCHAR)
- `fare` (VARCHAR): Current estimated/final price.
- `status` (VARCHAR): `pending`, `assigned`, `completed`, `cancelled`.
- `driver_id` (INT FK -> drivers.id)

---

## 🕒 Background Jobs (Automations)

The system utilizes `node-cron` for periodic maintenance:

1. **OTP Hygiene**: 
   - Runs: Every hour at the top of the hour.
   - Task: Removes all records from the `otps` table where `expires_at` is in the past.
   
2. **Daily Intelligence Report**:
   - Runs: Daily at 11:59 PM.
   - Task: Aggregates daily revenue and ride completion metrics into a curated HTML email sent to the platform administrator.

---

## 🎨 Design System

The application uses an **Integrated UI Design System**:
- All pages share a common design language defined in `style.css`.
- Interactive components use sub-visual cues (hover effects, smooth transitions).
- Responsive layout designed for mobile (passengers, drivers) and desktop (admins).

---

© 2026 CityRide Core Systems.
