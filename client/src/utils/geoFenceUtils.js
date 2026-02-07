// src/utils/geolocation.js
// ============================================
// 📍 CAMPUS GEOLOCATION SYSTEM - FINAL
// ============================================

const GEO_TEST_MODE = import.meta.env.VITE_GEO_TEST === "true";
const CAMPUS_CENTER = {
  latitude: 23.185381950277044,
  longitude: 77.32770183726367,
};
const CAMPUS_RADIUS_METERS = Number(import.meta.env.VITE_CAMPUS_RADIUS_METERS || 700);
const MIN_GPS_BUFFER_METERS = Number(import.meta.env.VITE_MIN_GPS_BUFFER_METERS || 80);

// ============================================
// 📚 CAMPUS LIBRARIES - YOUR ACTUAL LOCATION
// ============================================
export const CAMPUS_LIBRARIES = [
  {
    id: 'central_library',
    name: 'Central Library',
    latitude: 23.1854,  // Your exact coordinates
    longitude: 77.3277,
    radius: 450,
  },
  {
    id: 'engineering_library',
    name: 'Engineering Block Library',
    latitude: 23.1860,
    longitude: 77.3282,
    radius: 450,
  },
  {
    id: 'science_library',
    name: 'Science Block Library',
    latitude: 23.1848,
    longitude: 77.3272,
    radius: 450,
  },
  {
    id: 'admin_library',
    name: 'Administrative Block Library',
    latitude: 23.1856,
    longitude: 77.3270,
    radius: 450,
  },
  {
    id: 'medical_library',
    name: 'Medical Block Library',
    latitude: 23.1852,
    longitude: 77.3284,
    radius: 450,
  },
  {
    id: 'arts_library',
    name: 'Arts Block Library',
    latitude: 23.1862,
    longitude: 77.3275,
    radius: 450,
  },
  {
    id: 'commerce_library',
    name: 'Commerce Block Library',
    latitude: 23.1850,
    longitude: 77.3280,
    radius: 450,
  },
  {
    id: 'law_library',
    name: 'Law Block Library',
    latitude: 23.1858,
    longitude: 77.3268,
    radius: 450,
  },
  {
    id: 'sports_library',
    name: 'Sports Complex Library',
    latitude: 23.1846,
    longitude: 77.3278,
    radius: 450,
  },
  {
    id: 'hostel_library',
    name: 'Hostel Block Library',
    latitude: 23.1864,
    longitude: 77.3285,
    radius: 450,
  },
  {
    id: 'research_library',
    name: 'Research Block Library',
    latitude: 23.1844,
    longitude: 77.3274,
    radius: 450,
  },
];

// ============================================
// 🧮 CALCULATE DISTANCE (HAVERSINE FORMULA)
// ============================================
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// ============================================
// ✅ CHECK IF USER IS WITHIN CAMPUS
// ============================================
export const checkCampusAccess = (userLat, userLon, userAccuracy = 0) => {
  let nearestLibrary = null;
  let minDistance = Infinity;
  const distanceFromCampusCenter = calculateDistance(
    userLat,
    userLon,
    CAMPUS_CENTER.latitude,
    CAMPUS_CENTER.longitude
  );
  const gpsBuffer = Math.max(MIN_GPS_BUFFER_METERS, Math.round(userAccuracy || 0));
  let isWithinCampus = distanceFromCampusCenter <= (CAMPUS_RADIUS_METERS + gpsBuffer);

  CAMPUS_LIBRARIES.forEach((library) => {
    const distance = calculateDistance(
      userLat,
      userLon,
      library.latitude,
      library.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestLibrary = library;
    }

    if (distance <= library.radius) {
      isWithinCampus = true;
    }
  });

  return {
    isWithinCampus,
    nearestLibrary,
    distance: Math.round(minDistance),
    campusDistance: Math.round(distanceFromCampusCenter),
    gpsBuffer,
  };
};

// ============================================
// 📍 GET USER GPS LOCATION
// ============================================
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    // TEST MODE - Use fixed coordinates (23.1854, 77.3277)
    if (GEO_TEST_MODE) {
      console.log('🧪 TEST MODE ENABLED');
      console.log('📍 Using fixed location: 23.1854, 77.3277');
      setTimeout(() => {
        resolve({
          latitude: 23.1854,
          longitude: 77.3277,
          accuracy: 10,
        });
      }, 1000); // Simulate network delay
      return;
    }

    // PRODUCTION MODE - Get real GPS
    console.log('🌍 PRODUCTION MODE - Requesting GPS location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ GPS Location obtained:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable. Please check your GPS settings.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
        }
        console.error('❌ GPS Error:', errorMessage);
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// ============================================
// 🔐 VERIFY CAMPUS ACCESS (MAIN FUNCTION)
// ============================================
export const verifyCampusAccess = async () => {
  try {
    console.log('🔍 Starting campus verification...');
    
    const userLocation = await getUserLocation();
    
    const accessCheck = checkCampusAccess(
      userLocation.latitude,
      userLocation.longitude,
      userLocation.accuracy
    );

    const result = {
      success: true,
      isWithinCampus: accessCheck.isWithinCampus,
      nearestLibrary: accessCheck.nearestLibrary,
      distance: accessCheck.distance,
      campusDistance: accessCheck.campusDistance,
      campusRadius: CAMPUS_RADIUS_METERS,
      gpsBuffer: accessCheck.gpsBuffer,
      userLocation,
      timestamp: new Date().toISOString(),
    };

    console.log('📊 Verification Result:', {
      access: result.isWithinCampus ? '✅ GRANTED' : '❌ DENIED',
      library: result.nearestLibrary?.name,
      distance: result.distance + 'm',
    });

    return result;
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return {
      success: false,
      error: error.message,
      isWithinCampus: false,
      nearestLibrary: null,
      distance: null,
    };
  }
};
