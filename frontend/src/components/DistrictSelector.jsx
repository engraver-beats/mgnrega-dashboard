import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, ChevronDown, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { searchDistricts, detectUserLocation, getAllStates, getDistrictsByState } from '../services/districtService';

const DistrictSelector = ({ onDistrictSelect, selectedDistrict }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [states, setStates] = useState([]);
  const [showStateFilter, setShowStateFilter] = useState(false);

  // Load states on component mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        const statesList = await getAllStates();
        setStates(statesList);
      } catch (error) {
        console.error('Failed to load states:', error);
        setStates([]);
      }
    };
    
    loadStates();
  }, []);

  // Handle search query changes
  useEffect(() => {
    const performSearch = async () => {
      try {
        const results = await searchDistricts(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      }
    };
    
    performSearch();
  }, [searchQuery]);

  const handleLocationDetect = async () => {
    setIsDetecting(true);
    try {
      const district = await detectUserLocation();
      onDistrictSelect(district);
      toast.success(`स्थान मिल गया: ${district.name} (${district.hindi})`, { duration: 3000, icon: "✅" });
      setIsOpen(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Location detection failed:', error);
      toast.error(error.message || "स्थान का पता नहीं लगा सका। कृपया मैन्युअल रूप से जिला चुनें।", { duration: 5000, icon: "📍" });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleDistrictSelect = (district) => {
    onDistrictSelect(district);
      toast.success(`स्थान मिल गया: ${district.name} (${district.hindi})`, { duration: 3000, icon: "✅" });
    setIsOpen(false);
    setSearchQuery('');
    setSelectedState('');
  };

  const handleStateFilter = async (stateName) => {
    setSelectedState(stateName);
    try {
      const stateDistricts = await getDistrictsByState(stateName);
      setSearchResults(stateDistricts);
    } catch (error) {
      console.error('Failed to get districts for state:', error);
      setSearchResults([]);
    }
    setShowStateFilter(false);
  };

  const clearFilters = async () => {
    setSelectedState('');
    setSearchQuery('');
    try {
      const results = await searchDistricts('');
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to clear filters:', error);
      setSearchResults([]);
    }
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
              disabled={isDetecting}
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

          {/* Search and Filter Section */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            {/* Search Input */}
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

            {/* State Filter */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowStateFilter(!showStateFilter)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
              >
                {selectedState || 'राज्य से फिल्टर करें'}
              </button>
              {selectedState && (
                <button
                  onClick={clearFilters}
                  className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  साफ करें
                </button>
              )}
            </div>

            {/* State Dropdown */}
            {showStateFilter && (
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                {states.map((state) => (
                  <button
                    key={state}
                    onClick={() => handleStateFilter(state)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {state}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* District List */}
          <div className="max-h-64 overflow-y-auto">
            {searchResults.length > 0 ? (
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
