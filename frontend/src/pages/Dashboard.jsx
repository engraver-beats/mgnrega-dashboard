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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 hindi-text">डेटा लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {selectedDistrict?.districtName} जिला
                </h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {selectedDistrict?.currentMonth}
                </p>
              </div>
            </div>
            <button className="btn-secondary">
              <MapPin className="h-4 w-4 mr-2" />
              जिला बदलें
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Job Cards */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {(selectedDistrict?.totalJobCards / 1000).toFixed(0)}K
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">कुल जॉब कार्ड</h3>
            <p className="text-sm text-gray-600">पंजीकृत परिवार</p>
          </div>

          {/* Active Job Cards */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">
                {(selectedDistrict?.activeJobCards / 1000).toFixed(0)}K
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">सक्रिय जॉब कार्ड</h3>
            <p className="text-sm text-gray-600">काम पाने वाले परिवार</p>
          </div>

          {/* Person Days */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {(selectedDistrict?.totalPersonDays / 1000).toFixed(0)}K
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">कुल व्यक्ति दिवस</h3>
            <p className="text-sm text-gray-600">रोजगार के दिन</p>
          </div>

          {/* Average Wage */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <span className="text-yellow-600 font-bold text-lg">₹</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                ₹{selectedDistrict?.averageWageRate}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">औसत मजदूरी</h3>
            <p className="text-sm text-gray-600">प्रति दिन</p>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Women Participation */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">महिला भागीदारी</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">महिला कामगार</span>
              <span className="font-semibold">{selectedDistrict?.womenParticipation}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${selectedDistrict?.womenParticipation}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {(selectedDistrict?.womenPersonDays / 1000).toFixed(0)}K महिला व्यक्ति दिवस
            </p>
          </div>

          {/* Works Progress */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">कार्य प्रगति</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">पूरे हुए कार्य</span>
                <span className="font-semibold text-green-600">
                  {selectedDistrict?.worksCompleted}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">चालू कार्य</span>
                <span className="font-semibold text-blue-600">
                  {selectedDistrict?.worksOngoing}
                </span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-sm text-gray-600">
                  कुल: {selectedDistrict?.worksCompleted + selectedDistrict?.worksOngoing} कार्य
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="text-xl font-bold mb-4 text-blue-900">महीने की खास बातें</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                ₹{(selectedDistrict?.totalWagesPaid / 10000000).toFixed(1)}Cr
              </div>
              <div className="text-sm text-gray-700">कुल मजदूरी भुगतान</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round(selectedDistrict?.totalPersonDays / selectedDistrict?.activeJobCards)}
              </div>
              <div className="text-sm text-gray-700">औसत दिन प्रति परिवार</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round((selectedDistrict?.activeJobCards / selectedDistrict?.totalJobCards) * 100)}%
              </div>
              <div className="text-sm text-gray-700">जॉब कार्ड उपयोग</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

