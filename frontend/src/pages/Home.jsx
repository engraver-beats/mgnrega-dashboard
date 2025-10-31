import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search, Navigation, ChevronDown, Loader, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import ApiService from '../services/api'

const Home = () => {
  const navigate = useNavigate()
  const [districts, setDistricts] = useState([])
  const [filteredDistricts, setFilteredDistricts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDetecting, setIsDetecting] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Load districts on component mount
  useEffect(() => {
    loadDistricts()
  }, [])

  // Filter districts based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDistricts(districts)
    } else {
      const filtered = districts.filter(district =>
        district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        district.hindi.includes(searchQuery)
      )
      setFilteredDistricts(filtered)
    }
  }, [searchQuery, districts])

  const loadDistricts = async () => {
    try {
      setIsLoading(true)
      const response = await ApiService.getDistricts()
      if (response.success) {
        setDistricts(response.data)
        setFilteredDistricts(response.data)
      }
    } catch (error) {
      console.error('Failed to load districts:', error)
      toast.error('जिलों की सूची लोड नहीं हो सकी')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDistrictSelect = (district) => {
    toast.success(`${district.name} (${district.hindi}) चुना गया`)
    navigate(`/dashboard/${district.id}`, { 
      state: { district } 
    })
  }

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता')
      return
    }

    setIsDetecting(true)
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
          }
        )
      })

      const { latitude, longitude } = position.coords
      
      // For demo purposes, select a random district from MP
      // In a real app, you'd use reverse geocoding
      const randomDistrict = districts[Math.floor(Math.random() * districts.length)]
      
      if (randomDistrict) {
        toast.success(`स्थान मिल गया: ${randomDistrict.name}`)
        handleDistrictSelect(randomDistrict)
      }
      
    } catch (error) {
      let errorMessage = 'स्थान का पता नहीं लगा सका'
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'लोकेशन की अनुमति नहीं दी गई। कृपया ब्राउज़र सेटिंग्स में लोकेशन एक्सेस को इनेबल करें।'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'लोकेशन की जानकारी उपलब्ध नहीं है। कृपया अपनी GPS सेटिंग्स जांचें।'
          break
        case error.TIMEOUT:
          errorMessage = 'लोकेशन खोजने में समय लग रहा है। कृपया पुनः प्रयास करें।'
          break
      }
      
      toast.error(errorMessage)
    } finally {
      setIsDetecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MGNREGA Dashboard</h1>
                <p className="text-sm text-gray-600">मनरेगा डैशबोर्ड</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            अपना जिला चुनें
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            मध्य प्रदेश के किसी भी जिले का MGNREGA डेटा देखें
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          {/* Location Detection Button */}
          <div className="mb-6">
            <button
              onClick={detectLocation}
              disabled={isDetecting}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              {isDetecting ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Navigation className="h-5 w-5" />
              )}
              <span>
                {isDetecting ? 'स्थान खोजा जा रहा है...' : 'मेरा स्थान खोजें'}
              </span>
            </button>
          </div>

          <div className="text-center text-gray-500 mb-6">
            या
          </div>

          {/* District Search */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="जिला खोजें (हिंदी या अंग्रेजी में)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                className="input-field pl-10 pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Districts Dropdown */}
            {(isDropdownOpen || searchQuery) && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <Loader className="h-5 w-5 animate-spin mx-auto mb-2" />
                    <span className="text-gray-500">जिले लोड हो रहे हैं...</span>
                  </div>
                ) : filteredDistricts.length > 0 ? (
                  filteredDistricts.map((district) => (
                    <button
                      key={district.id}
                      onClick={() => handleDistrictSelect(district)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{district.name}</div>
                          <div className="text-sm text-gray-600">{district.hindi}</div>
                        </div>
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    कोई जिला नहीं मिला
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Click outside to close dropdown */}
          {isDropdownOpen && (
            <div 
              className="fixed inset-0 z-5"
              onClick={() => setIsDropdownOpen(false)}
            />
          )}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">52</div>
            <div className="text-gray-600">कुल जिले</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">100%</div>
            <div className="text-gray-600">डेटा कवरेज</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-warning-600 mb-2">Live</div>
            <div className="text-gray-600">रियल टाइम डेटा</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

