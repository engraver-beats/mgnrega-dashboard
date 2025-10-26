import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { districtCode } = useParams()
  const [searchParams] = useSearchParams()
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock data for now - will be replaced with API calls in Day 2
  const mockPerformance = {
    districtName: 'Agra',
    currentMonth: 'October 2025',
    totalJobCards: 45000,
    activeJobCards: 28000,
    totalPersonDays: 450000,
    womenPersonDays: 225000,
    averageWageRate: 220,
    totalWagesPaid: 9900000,
    worksCompleted: 450,
    worksOngoing: 120,
    womenParticipation: 50,
    employmentProvided: 450000
  }

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setSelectedDistrict(mockPerformance)
      setLoading(false)
    }, 1000)
  }, [districtCode])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="loading-spinner mx-auto mb-6 w-16 h-16 border-4 border-orange-500/30 border-t-orange-500"></div>
            <div className="absolute inset-0 loading-spinner mx-auto w-16 h-16 border-4 border-transparent border-t-pink-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <p className="text-2xl text-white hindi-text font-semibold mb-2">डेटा लोड हो रहा है...</p>
          <p className="text-gray-300">कृपया प्रतीक्षा करें</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-bg" style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #7c2d92 50%, #be185d 100%)',
      minHeight: '100vh'
    }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/" className="group bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all duration-200">
                <ArrowLeft className="h-6 w-6 text-white group-hover:text-orange-200" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  🏛️ {selectedDistrict?.districtName} जिला
                </h1>
                <p className="text-lg text-orange-200 flex items-center font-semibold">
                  <Calendar className="h-5 w-5 mr-2" />
                  📅 {selectedDistrict?.currentMonth}
                </p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>🔄 जिला बदलें</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Total Job Cards */}
          <div className="group relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md rounded-3xl p-8 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <span className="text-4xl font-bold text-blue-300">
                  {(selectedDistrict?.totalJobCards / 1000).toFixed(0)}K
                </span>
              </div>
              <h3 className="font-bold text-white text-xl mb-2">📋 कुल जॉब कार्ड</h3>
              <p className="text-blue-200 text-lg">पंजीकृत परिवार</p>
            </div>
          </div>

          {/* Active Job Cards */}
          <div className="group relative bg-gradient-to-br from-green-500/20 to-emerald-600/10 backdrop-blur-md rounded-3xl p-8 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-4 rounded-2xl shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <span className="text-4xl font-bold text-green-300">
                  {(selectedDistrict?.activeJobCards / 1000).toFixed(0)}K
                </span>
              </div>
              <h3 className="font-bold text-white text-xl mb-2">✅ सक्रिय जॉब कार्ड</h3>
              <p className="text-green-200 text-lg">काम पाने वाले परिवार</p>
            </div>
          </div>

          {/* Person Days */}
          <div className="group relative bg-gradient-to-br from-purple-500/20 to-pink-600/10 backdrop-blur-md rounded-3xl p-8 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-purple-400 to-pink-600 p-4 rounded-2xl shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <span className="text-4xl font-bold text-purple-300">
                  {(selectedDistrict?.totalPersonDays / 1000).toFixed(0)}K
                </span>
              </div>
              <h3 className="font-bold text-white text-xl mb-2">📅 कुल व्यक्ति दिवस</h3>
              <p className="text-purple-200 text-lg">रोजगार के दिन</p>
            </div>
          </div>

          {/* Average Wage */}
          <div className="group relative bg-gradient-to-br from-yellow-500/20 to-orange-600/10 backdrop-blur-md rounded-3xl p-8 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-600 p-4 rounded-2xl shadow-lg">
                  <span className="text-white font-bold text-2xl">₹</span>
                </div>
                <span className="text-4xl font-bold text-yellow-300">
                  ₹{selectedDistrict?.averageWageRate}
                </span>
              </div>
              <h3 className="font-bold text-white text-xl mb-2">💰 औसत मजदूरी</h3>
              <p className="text-yellow-200 text-lg">प्रति दिन</p>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Women Participation */}
          <div className="relative bg-gradient-to-br from-pink-500/20 to-rose-600/10 backdrop-blur-md rounded-3xl p-8 border border-pink-400/30 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 to-rose-600/5 rounded-3xl"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-pink-400 to-rose-600 p-3 rounded-2xl mr-4">
                  <span className="text-white text-2xl">👩‍💼</span>
                </div>
                <h3 className="text-2xl font-bold text-white">महिला भागीदारी</h3>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-pink-200 text-lg">महिला कामगार</span>
                <span className="font-bold text-3xl text-pink-300">{selectedDistrict?.womenParticipation}%</span>
              </div>
              
              <div className="w-full bg-white/20 rounded-full h-4 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-pink-400 to-rose-500 h-4 rounded-full transition-all duration-1000 shadow-lg"
                  style={{ width: `${selectedDistrict?.womenParticipation}%` }}
                ></div>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-pink-200 text-lg font-semibold">
                  📊 {(selectedDistrict?.womenPersonDays / 1000).toFixed(0)}K महिला व्यक्ति दिवस
                </p>
              </div>
            </div>
          </div>

          {/* Works Progress */}
          <div className="relative bg-gradient-to-br from-emerald-500/20 to-teal-600/10 backdrop-blur-md rounded-3xl p-8 border border-emerald-400/30 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-600/5 rounded-3xl"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-3 rounded-2xl mr-4">
                  <span className="text-white text-2xl">🏗️</span>
                </div>
                <h3 className="text-2xl font-bold text-white">कार्य प्रगति</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-200 text-lg">✅ पूरे हुए कार्य</span>
                    <span className="font-bold text-3xl text-emerald-300">
                      {selectedDistrict?.worksCompleted}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200 text-lg">🔄 चालू कार्य</span>
                    <span className="font-bold text-3xl text-blue-300">
                      {selectedDistrict?.worksOngoing}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-4 border border-emerald-400/30">
                  <div className="text-center">
                    <span className="text-white text-lg font-semibold">
                      📊 कुल: {selectedDistrict?.worksCompleted + selectedDistrict?.worksOngoing} कार्य
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="relative bg-gradient-to-r from-indigo-500/20 to-purple-600/20 backdrop-blur-md rounded-3xl p-10 border border-indigo-400/30 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-3xl"></div>
          <div className="relative">
            <div className="text-center mb-8">
              <span className="text-4xl mb-4 block">🎯</span>
              <h3 className="text-3xl font-bold text-white mb-2">महीने की खास बातें</h3>
              <p className="text-indigo-200">प्रमुख उपलब्धियां और आंकड़े</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-bold text-blue-300 mb-3">
                  💰 ₹{(selectedDistrict?.totalWagesPaid / 10000000).toFixed(1)}Cr
                </div>
                <div className="text-blue-200 text-lg font-semibold">कुल मजदूरी भुगतान</div>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-bold text-green-300 mb-3">
                  📊 {Math.round(selectedDistrict?.totalPersonDays / selectedDistrict?.activeJobCards)}
                </div>
                <div className="text-green-200 text-lg font-semibold">औसत दिन प्रति परिवार</div>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-bold text-purple-300 mb-3">
                  📈 {Math.round((selectedDistrict?.activeJobCards / selectedDistrict?.totalJobCards) * 100)}%
                </div>
                <div className="text-purple-200 text-lg font-semibold">जॉब कार्ड उपयोग</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
