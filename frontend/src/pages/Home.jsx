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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-3 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MGNREGA Dashboard</h1>
                <p className="text-lg text-orange-200 hindi-text font-semibold">मनरेगा डैशबोर्ड</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-green-500/20 px-3 py-1 rounded-full">
                <span className="text-green-300 text-sm font-medium">🟢 Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text text-lg font-semibold mb-4">
              🚀 भारत का #1 मनरेगा ट्रैकर
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 text-transparent bg-clip-text">
              अपने जिले का
            </span>
            <br />
            <span className="text-white">मनरेगा प्रदर्शन देखें</span>
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            आसान भाषा में समझें कि आपके जिले में मनरेगा योजना कैसा काम कर रही है। 
            <br className="hidden md:block" />
            <span className="text-yellow-300 font-semibold">रोजगार, मजदूरी और काम की जानकारी एक क्लिक में।</span>
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={detectLocation}
              disabled={isDetectingLocation}
              className="group relative bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[250px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <MapPin className="h-6 w-6" />
                <span>
                  {isDetectingLocation ? '🔍 खोज रहे हैं...' : '📍 मेरा जिला खोजें'}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-lg px-10 py-5 rounded-2xl border-2 border-white/30 hover:border-white/50 shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[250px]"
            >
              <div className="flex items-center justify-center space-x-3">
                <span>⚡ मैन्युअल चुनें</span>
              </div>
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">📊 प्रदर्शन ट्रैकिंग</h3>
              <p className="text-gray-200 hindi-text text-lg leading-relaxed">
                अपने जिले में कितने लोगों को काम मिला, कितनी मजदूरी मिली - 
                <span className="text-green-300 font-semibold"> सब कुछ एक जगह देखें</span>
              </p>
            </div>
          </div>

          <div className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">🎯 आसान समझ</h3>
              <p className="text-gray-200 hindi-text text-lg leading-relaxed">
                जटिल सरकारी डेटा को 
                <span className="text-blue-300 font-semibold"> सरल चार्ट और रंगों</span> में दिखाया गया है
              </p>
            </div>
          </div>

          <div className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-400 to-pink-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">🛡️ सरकारी डेटा</h3>
              <p className="text-gray-200 hindi-text text-lg leading-relaxed">
                data.gov.in से सीधे लिया गया 
                <span className="text-purple-300 font-semibold"> असली और अपडेटेड डेटा</span>
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="relative bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-3xl p-12 text-center border border-white/30 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-pink-500/10 rounded-3xl"></div>
          <div className="relative">
            <div className="mb-8">
              <span className="text-6xl mb-4 block">🇮🇳</span>
              <h3 className="text-4xl font-bold mb-6 hindi-text bg-gradient-to-r from-orange-300 to-pink-300 text-transparent bg-clip-text">
                मनरेगा क्या है?
              </h3>
            </div>
            <p className="text-xl text-gray-100 leading-relaxed max-w-5xl mx-auto hindi-text">
              <span className="text-yellow-300 font-bold">महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा)</span> भारत की सबसे बड़ी 
              रोजगार योजना है। यह हर ग्रामीण परिवार को साल में कम से कम 
              <span className="bg-green-500/30 px-2 py-1 rounded-lg text-green-200 font-bold"> 100 दिन काम की गारंटी</span> देती है। 
              <br /><br />
              <span className="text-orange-300 font-semibold">2025 में 12.15 करोड़ ग्रामीण भारतीयों को इससे फायदा हुआ है।</span>
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-bold text-green-400">12.15Cr</div>
                <div className="text-sm text-gray-300">लाभार्थी</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-bold text-blue-400">100</div>
                <div className="text-sm text-gray-300">दिन गारंटी</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-bold text-purple-400">₹220</div>
                <div className="text-sm text-gray-300">औसत मजदूरी</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-bold text-orange-400">50%</div>
                <div className="text-sm text-gray-300">महिला भागीदारी</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-black/30 backdrop-blur-md border-t border-white/20 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl">❤️</span>
              <p className="text-xl text-gray-200 font-semibold">
                Made with love for rural India's digital empowerment
              </p>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <span>📊 Data source: data.gov.in</span>
              <span>•</span>
              <span>🚫 Not affiliated with Government of India</span>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <div className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-200">
              <span className="text-white">🌐</span>
            </div>
            <div className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-200">
              <span className="text-white">📱</span>
            </div>
            <div className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-200">
              <span className="text-white">📧</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
