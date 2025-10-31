import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, ChevronDown, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import ApiService from '../services/api';
import useLocation from '../hooks/useLocation';

const DistrictSelector = ({ onDistrictSelect, selectedDistrict }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allDistricts, setAllDistricts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the custom location hook
  const { isDetecting, detectLocation } = useLocation();

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
    const result = await detectLocation(allDistricts);
    
    if (result && result.nearestDistrict) {
      onDistrictSelect(result.nearestDistrict);
      setIsOpen(false);
      setSearchQuery('');
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
