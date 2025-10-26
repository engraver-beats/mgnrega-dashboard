import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Users, TrendingUp, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const Home = () => {
  const navigate = useNavigate()
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  const detectLocation = () => {
    setIsDetectingLocation(true)
    
    if (!navigator.geolocation) {
      toast.error('आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता')
      setIsDetectingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        // For now, redirect to dashboard with coordinates
        // In Day 2, we'll implement actual API call
        toast.success('लोकेशन मिल गई!')
        navigate(`/dashboard?lat=${latitude}&lng=${longitude}`)
        setIsDetectingLocation(false)
      },
      (error) => {
        console.error('Location error:', error)
        toast.error('लोकेशन नहीं मिल सकी। कृपया मैन्युअल चुनें।')
        setIsDetectingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MGNREGA Dashboard</h1>
                <p className="text-sm text-gray-600 hindi-text">मनरेगा डैशबोर्ड</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            अपने जिले का मनरेगा प्रदर्शन देखें
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            आसान भाषा में समझें कि आपके जिले में मनरेगा योजना कैसा काम कर रही है। 
            रोजगार, मजदूरी और काम की जानकारी एक क्लिक में।
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={detectLocation}
              disabled={isDetectingLocation}
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 min-w-[200px]"
            >
              <MapPin className="h-5 w-5" />
              <span>
                {isDetectingLocation ? 'खोज रहे हैं...' : 'मेरा जिला खोजें'}
              </span>
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4 min-w-[200px]"
            >
              <span>मैन्युअल चुनें</span>
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">प्रदर्शन ट्रैकिंग</h3>
            <p className="text-gray-600 hindi-text">
              अपने जिले में कितने लोगों को काम मिला, कितनी मजदूरी मिली - सब कुछ एक जगह देखें
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">आसान समझ</h3>
            <p className="text-gray-600 hindi-text">
              जटिल सरकारी डेटा को सरल चार्ट और रंगों में दिखाया गया है
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">सरकारी डेटा</h3>
            <p className="text-gray-600 hindi-text">
              data.gov.in से सीधे लिया गया असली और अपडेटेड डेटा
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 hindi-text">मनरेगा क्या है?</h3>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto hindi-text">
            महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा) भारत की सबसे बड़ी 
            रोजगार योजना है। यह हर ग्रामीण परिवार को साल में कम से कम 100 दिन काम की गारंटी देती है। 
            2025 में 12.15 करोड़ ग्रामीण भारतीयों को इससे फायदा हुआ है।
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            Made with ❤️ for rural India's digital empowerment
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Data source: data.gov.in | Not affiliated with Government of India
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home

