/**
 * CityRide Platform - Mobile API Configuration
 * 
 * This file tells the app where the backend server is located.
 */

// [IMPORTANT] Replace this with your actual live Railway project URL (e.g., https://myapp.up.railway.app)
const PRODUCTION_URL = "https://cityridetaxis.up.railway.app"; 

const API_BASE_URL = (
    window.location.protocol === 'file:' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('192.168.') // Allow local network testing
) ? PRODUCTION_URL : window.location.origin;

console.log("🚀 API Base Point set to:", API_BASE_URL);
if (API_BASE_URL === "https://cityridetaxis.up.railway.app/") {
    console.warn("⚠️ WARNING: You are using the default placeholder URL. Ensure you replace PRODUCTION_URL in config.js with your actual Railway URL.");
}
