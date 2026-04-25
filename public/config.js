/**
 * CityRide Platform - Mobile API Configuration
 * 
 * This file tells the app where the backend server is located.
 */

// [IMPORTANT] Replace this with your actual live Railway project URL (e.g., https://myapp.up.railway.app)
const PRODUCTION_URL = "https://cityride.up.railway.app"; 
const API_BASE_URL = (
    window.location.protocol === 'file:' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('192.168.')
) ? PRODUCTION_URL : window.location.origin;

console.log("🚀 API Base Point set to:", API_BASE_URL);
