import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, TrendingUp, Users, IndianRupee, Briefcase, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { districtCode } = useParams()
  const [searchParams] = useSearchParams()
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock data for now - will be replaced with API calls in Day 2
  const mockPerformance = {
    districtName: 'Agra',
    stateName: 'Uttar Pradesh',
    currentMonth: 'October 2024',
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
          <div className="relative">
            <div className="loading-spinner mx-auto mb-6 w-16 h-16 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
          <p className="text-xl text-gray-700 hindi-text font-semibold mb-2">डेटा लोड हो रहा है...</p>
          <p className="text-gray-500">कृपया प्रतीक्षा करें</p>
        </div>
      </div>
    )
  }

  const metrics = [
    {
      title: 'कुल जॉब कार्ड',
      value: selectedDistrict.totalJobCards.toLocaleString('hi-IN'),
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'सक्रिय जॉब कार्ड',
      value: selectedDistrict.activeJobCards.toLocaleString('hi-IN'),
      icon: <Briefcase className="h-6 w-6" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'कुल व्यक्ति दिवस',
      value: selectedDistrict.totalPersonDays.toLocaleString('hi-IN'),
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'औसत मजदूरी दर',
      value: `₹${selectedDistrict.averageWageRate}`,
      icon: <IndianRupee className="h-6 w-6" />,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'कुल मजदूरी भुगतान',
      value: `₹${(selectedDistrict.totalWagesPaid / 10000000).toFixed(1)} करोड़`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      title: 'पूर्ण कार्य',
      value: selectedDistrict.worksCompleted.toLocaleString('hi-IN'),
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {selectedDistrict.districtName} जिला डैशबोर्ड
                </h1>
                <p className="text-blue-100">
                  {selectedDistrict.stateName} | {selectedDistrict.currentMonth}
                </p>
              </div>
            </div>
            <div className="bg-green-600 px-4 py-2 rounded-lg">
              <span className="text-white font-medium">🟢 लाइव डेटा</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* District Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedDistrict.districtName} जिला
              </h2>
              <p className="text-gray-600">{selectedDistrict.stateName}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">महिला भागीदारी</div>
              <div className="text-2xl font-bold text-blue-600">
                {selectedDistrict.womenParticipation}%
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">चालू कार्य</div>
              <div className="text-2xl font-bold text-green-600">
                {selectedDistrict.worksOngoing}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">रोजगार प्रदान</div>
              <div className="text-2xl font-bold text-purple-600">
                {selectedDistrict.employmentProvided.toLocaleString('hi-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.color} text-white p-3 rounded-lg`}>
                  {metric.icon}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">{metric.title}</p>
                <p className={`text-3xl font-bold ${metric.textColor}`}>
                  {metric.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">प्रदर्शन सारांश</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Employment Stats */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">रोजगार आंकड़े</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">कुल जॉब कार्ड</span>
                  <span className="font-semibold text-gray-800">
                    {selectedDistrict.totalJobCards.toLocaleString('hi-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">सक्रिय जॉब कार्ड</span>
                  <span className="font-semibold text-gray-800">
                    {selectedDistrict.activeJobCards.toLocaleString('hi-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">महिला व्यक्ति दिवस</span>
                  <span className="font-semibold text-gray-800">
                    {selectedDistrict.womenPersonDays.toLocaleString('hi-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Work Progress */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">कार्य प्रगति</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">पूर्ण कार्य</span>
                  <span className="font-semibold text-green-600">
                    {selectedDistrict.worksCompleted}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">चालू कार्य</span>
                  <span className="font-semibold text-orange-600">
                    {selectedDistrict.worksOngoing}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">औसत मजदूरी दर</span>
                  <span className="font-semibold text-blue-600">
                    ₹{selectedDistrict.averageWageRate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2024 MGNREGA Dashboard | भारत सरकार | Government of India
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard

