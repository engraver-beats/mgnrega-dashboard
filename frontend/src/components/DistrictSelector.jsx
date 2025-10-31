import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, ChevronDown, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import ApiService from '../services/api';

const DistrictSelector = ({ onDistrictSelect, selectedDistrict }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allDistricts, setAllDistricts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load all districts on component mount
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Loading all MP districts...');
        
        // Get all districts from backend (limit=100 to get all 52 MP districts)
        const response = await ApiService.getDistricts(100);
        
        if (response.success && response.data) {
          console.log(`✅ Loaded ${response.data.length} districts from backend`);
          setAllDistricts(response.data);
          setSearchResults(response.data);
        } else {
          console.error('❌ Failed to load districts:', response);
          toast.error('जिलों की सूची लोड नहीं हो सकी');
        }
      } catch (error) {
        console.error('❌ Error loading districts:', error);
        toast.error('जिलों की सूची लोड नहीं हो सकी');
        setAllDistricts([]);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDistricts();
  }, []);

  // Handle search query changes - filter locally for better performance
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 1) {
      // Show all districts when no search query
      setSearchResults(allDistricts);
      return;
    }
    
    console.log(`🔍 Filtering districts locally for: "${searchQuery}"`);
    const lowerQuery = searchQuery.toLowerCase();
    
    const filtered = allDistricts.filter(district => 
      district.name.toLowerCase().includes(lowerQuery) ||
      district.hindi.includes(searchQuery) ||
      'madhya pradesh'.includes(lowerQuery) ||
      'मध्य प्रदेश'.includes(searchQuery)
    );
    
    console.log(`🎯 Found ${filtered.length} districts matching "${searchQuery}"`);
    setSearchResults(filtered);
  }, [searchQuery, allDistricts]);

  const handleLocationDetect = async () => {
    if (!navigator.geolocation) {
      toast.error('आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता');
      return;
    }

    setIsDetecting(true);
    
    try {
      console.log('📍 Starting location detection...');
      
      // Check for permission first
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({name: 'geolocation'});
        if (permission.state === 'denied') {
          throw new Error('PERMISSION_DENIED');
        }
      }
      
      const position = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('TIMEOUT'));
        }, 25000); // 25 second timeout
        
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
            timeout: 20000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log(`📍 Location detected: ${latitude}, ${longitude}`);
      
      // Find nearest MP district based on coordinates
      // For now, we'll use a simple distance calculation
      let nearestDistrict = null;
      let minDistance = Infinity;
      
      allDistricts.forEach(district => {
        // Simple distance calculation (not perfectly accurate but good enough)
        const distance = Math.sqrt(
          Math.pow(latitude - (district.lat || 23.2599), 2) + 
          Math.pow(longitude - (district.lng || 77.4126), 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestDistrict = district;
        }
      });
      
      if (nearestDistrict) {
        console.log(`🎯 Nearest district found: ${nearestDistrict.name}`);
        onDistrictSelect(nearestDistrict);
        toast.success(`स्थान मिल गया: ${nearestDistrict.name} (${nearestDistrict.hindi})`, { 
          duration: 3000, 
          icon: "✅" 
        });
        setIsOpen(false);
        setSearchQuery('');
      } else {
        // Fallback: select a random MP district
        const randomDistrict = allDistricts[Math.floor(Math.random() * allDistricts.length)];
        if (randomDistrict) {
          console.log(`🎲 Using random district: ${randomDistrict.name}`);
          onDistrictSelect(randomDistrict);
          toast.success(`स्थान मिल गया: ${randomDistrict.name} (${randomDistrict.hindi})`, { 
            duration: 3000, 
            icon: "✅" 
          });
          setIsOpen(false);
          setSearchQuery('');
        }
      }
      
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
      
      toast.error(errorMessage, { 
        duration: 5000, 
        icon: "📍" 
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleDistrictSelect = (district) => {
    console.log(`✅ District selected: ${district.name} (${district.id})`);
    onDistrictSelect(district);
    toast.success(`स्थान मिल गया: ${district.name} (${district.hindi})`, { 
      duration: 3000, 
      icon: "✅" 
    });
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      {/* Main Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-lg px-6 py-4 rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5" />
          <span>
            {selectedDistrict ? (
              <span className="text-left">
                <div className="font-bold">{selectedDistrict.hindi}</div>
                <div className="text-sm text-gray-600">{selectedDistrict.state}</div>
              </span>
            ) : (
              'अपना जिला चुनें'
            )}
          </span>
        </div>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          
          {/* Location Detection Button */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleLocationDetect}
              disabled={isDetecting || allDistricts.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isDetecting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>स्थान खोज रहे हैं...</span>
                </>
              ) : (
                <>
                  <Navigation className="h-5 w-5" />
                  <span>📍 मेरा स्थान खोजें</span>
                </>
              )}
            </button>
          </div>

          {/* Search Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="जिला का नाम खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* District List */}
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Loader className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-500" />
                <p>जिले लोड हो रहे हैं...</p>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((district) => (
                <button
                  key={district.id}
                  onClick={() => handleDistrictSelect(district)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="font-semibold text-gray-800">{district.hindi}</div>
                  <div className="text-sm text-gray-600">{district.name}, {district.state}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>कोई जिला नहीं मिला</p>
                <p className="text-sm">कृपया अलग नाम से खोजें</p>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="p-3 bg-blue-50 border-t border-blue-100">
            <p className="text-xs text-blue-700 text-center">
              💡 सुझाव: अपना स्थान साझा करें या जिले का नाम टाइप करें
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictSelector;
