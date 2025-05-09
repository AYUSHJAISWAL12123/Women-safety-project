// Safety Map - Track user and notify about danger zones

// Example populated areas (latitude, longitude)
const populatedAreas = [
    { lat: 40.7128, lng: -74.0060 }, // Example: New York City
    { lat: 34.0522, lng: -118.2437 }, // Example: Los Angeles
    { lat: 51.5074, lng: -0.1278 } // Example: London
];

// Maximum safe distance from a populated area (in km)
const SAFE_DISTANCE_KM = 5;

// Function to calculate distance between two coordinates (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Function to check if the user is in a danger zone
function checkSafety(userLat, userLng) {
    let safe = false;
    
    for (let area of populatedAreas) {
        let distance = getDistance(userLat, userLng, area.lat, area.lng);
        if (distance <= SAFE_DISTANCE_KM) {
            safe = true;
            break;
        }
    }
    
    if (!safe) {
        alert("Warning: You are in a less populated area! Stay alert and share your location with a trusted contact.");
    }
}

// Get user's location
function trackUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            checkSafety(latitude, longitude);
        }, () => {
            alert("Unable to retrieve location. Please enable location services.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Start tracking user location
trackUserLocation();
