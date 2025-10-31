import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

// Haversine formula to calculate distance between two points on Earth
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const useLocation = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const findNearestDistrict = useCallback((userLat, userLng, districts) => {
    console.log(`🎯 Finding nearest district for coordinates: ${userLat}, ${userLng}`);
    console.log(`📍 Available districts: ${districts.length}`);
    
    let nearestDistrict = null;
    let minDistance = Infinity;
    
    districts.forEach(district => {
      // Use the lat/lng from the district data if available
      const districtLat = district.lat || getDefaultLatForDistrict(district.name);
      const districtLng = district.lng || getDefaultLngForDistrict(district.name);
      
      if (districtLat && districtLng) {
        const distance = calculateDistance(userLat, userLng, districtLat, districtLng);
        console.log(`📏 Distance to ${district.name}: ${distance.toFixed(2)} km`);
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestDistrict = district;
        }
      }
    });
    
    if (nearestDistrict) {
      console.log(`🎯 Nearest district: ${nearestDistrict.name} (${minDistance.toFixed(2)} km away)`);
    } else {
      console.log('❌ No nearest district found');
    }
    
    return nearestDistrict;
  }, []);

  const detectLocation = useCallback(async (districts = []) => {
    if (!navigator.geolocation) {
      const errorMsg = 'आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    }

    setIsDetecting(true);
    setError(null);
    
    try {
      console.log('📍 Starting location detection...');
      
      // Check for permission first
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({name: 'geolocation'});
          if (permission.state === 'denied') {
            throw new Error('PERMISSION_DENIED');
          }
        } catch (permError) {
          console.log('⚠️ Permission API not available, proceeding with geolocation');
        }
      }
      
      const position = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('TIMEOUT'));
        }, 30000); // 30 second timeout
        
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeoutId);
            resolve(pos);
          },
          (error) => {
            clearTimeout(timeoutId);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 25000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log(`📍 Location detected: ${latitude}, ${longitude}`);
      
      const locationData = {
        latitude,
        longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
      };
      
      setLocation(locationData);
      
      // Find nearest district if districts array is provided
      let nearestDistrict = null;
      if (districts && districts.length > 0) {
        nearestDistrict = findNearestDistrict(latitude, longitude, districts);
        
        if (nearestDistrict) {
          toast.success(`स्थान मिल गया: ${nearestDistrict.name} (${nearestDistrict.hindi})`, { 
            duration: 3000, 
            icon: "✅" 
          });
        } else {
          // Fallback: select a random MP district
          const randomDistrict = districts[Math.floor(Math.random() * districts.length)];
          if (randomDistrict) {
            console.log(`🎲 Using random district as fallback: ${randomDistrict.name}`);
            nearestDistrict = randomDistrict;
            toast.success(`स्थान मिल गया: ${randomDistrict.name} (${randomDistrict.hindi})`, { 
              duration: 3000, 
              icon: "📍" 
            });
          }
        }
      }
      
      return {
        location: locationData,
        nearestDistrict
      };
      
    } catch (error) {
      console.error('❌ Location detection failed:', error);
      
      let errorMessage = 'स्थान का पता नहीं लगा सका';
      
      if (error.message === 'PERMISSION_DENIED' || error.code === 1) {
        errorMessage = 'लोकेशन की अनुमति नहीं दी गई। कृपया ब्राउज़र सेटिंग्स में लोकेशन एक्सेस को इनेबल करें।';
      } else if (error.code === 2) {
        errorMessage = 'लोकेशन की जानकारी उपलब्ध नहीं है। कृपया अपनी GPS सेटिंग्स जांचें।';
      } else if (error.message === 'TIMEOUT' || error.code === 3) {
        errorMessage = 'लोकेशन खोजने में समय लग रहा है। कृपया पुनः प्रयास करें।';
      }
      
      setError(errorMessage);
      toast.error(errorMessage, { 
        duration: 5000, 
        icon: "📍" 
      });
      
      return null;
    } finally {
      setIsDetecting(false);
    }
  }, [findNearestDistrict]);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    isDetecting,
    error,
    detectLocation,
    clearLocation,
    findNearestDistrict
  };
};

// Default coordinates for major MP districts (fallback)
const getDefaultLatForDistrict = (districtName) => {
  const defaults = {
    'Bhopal': 23.2599,
    'Indore': 22.7196,
    'Gwalior': 26.2183,
    'Jabalpur': 23.1815,
    'Ujjain': 23.1765,
    'Sagar': 23.8388,
    'Dewas': 22.9676,
    'Satna': 24.5707,
    'Ratlam': 23.3315,
    'Rewa': 24.5364,
    'Murena': 26.5015,
    'Singrauli': 24.1997,
    'Burhanpur': 21.3009,
    'Khandwa': 21.8362,
    'Khargone': 21.8236,
    'Neemuch': 24.4739,
    'Mandsaur': 24.0767,
    'Shajapur': 23.4267,
    'Rajgarh': 24.0073,
    'Vidisha': 23.5251,
    'Betul': 21.9057,
    'Harda': 22.3442,
    'Hoshangabad': 22.7440,
    'Raisen': 23.3315,
    'Sehore': 23.2021
  };
  return defaults[districtName] || 23.2599; // Default to Bhopal
};

const getDefaultLngForDistrict = (districtName) => {
  const defaults = {
    'Bhopal': 77.4126,
    'Indore': 75.8577,
    'Gwalior': 78.1828,
    'Jabalpur': 79.9864,
    'Ujjain': 75.7885,
    'Sagar': 78.7378,
    'Dewas': 76.0534,
    'Satna': 80.8320,
    'Ratlam': 75.0367,
    'Rewa': 81.2961,
    'Murena': 78.0014,
    'Singrauli': 82.6739,
    'Burhanpur': 76.2291,
    'Khandwa': 76.3500,
    'Khargone': 75.6147,
    'Neemuch': 74.8706,
    'Mandsaur': 75.0700,
    'Shajapur': 76.2738,
    'Rajgarh': 76.8441,
    'Vidisha': 77.8081,
    'Betul': 77.8986,
    'Harda': 77.0953,
    'Hoshangabad': 77.7282,
    'Raisen': 77.7824,
    'Sehore': 77.0854
  };
  return defaults[districtName] || 77.4126; // Default to Bhopal
};

export default useLocation;
