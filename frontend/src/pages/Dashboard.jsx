import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, TrendingUp, Users, IndianRupee, Briefcase, Clock, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDistrictData } from '../services/districtService'
import { 
  EmploymentTrendChart, 
  WorkCategoriesChart, 
  MonthlyWagesChart, 
  PaymentStatusChart,
  QuickStatsCard,
  ProgressBar
} from '../components/SimpleCharts'
import DistrictSelector from '../components/DistrictSelector'

const Dashboard = () => {
  const { districtId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [districtData, setDistrictData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDistrictSelector, setShowDistrictSelector] = useState(false)

  useEffect(() => {
    let district = null
    
    // Try to get district from navigation state first
    if (location.state?.district) {
      district = location.state.district
    }
    // Then try to get from URL parameter
    else if (districtId) {
      const data = getDistrictData(districtId)
      if (data) {
        district = data
      }
    }
    
    if (district) {
      setSelectedDistrict(district)
      const fullData = getDistrictData(district.id)
      setDistrictData(fullData)
    } else {
      // No district selected, show default data
      const defaultData = getDistrictData('UP001') // Default to Agra
      setDistrictData(defaultData)
      setSelectedDistrict(defaultData)
    }
    
    setLoading(false)
  }, [districtId, location.state])

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district)
    const fullData = getDistrictData(district.id)
    setDistrictData(fullData)
    setShowDistrictSelector(false)
    
    // Update URL
    navigate(`/dashboard/${district.id}`, { 
      state: { district },
      replace: true 
    })
  }

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

  if (!districtData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">जिला नहीं मिला</h2>
          <p className="text-gray-600 mb-6">कृपया कोई जिला चुनें</p>
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            वापस होम पेज पर जाएं
          </Link>
        </div>
      </div>
    )
  }

  const quickStats = [
    {
      icon: <Users className="h-6 w-6" />,
      title: 'कुल जॉब कार्ड',
      value: districtData.totalJobCards.toLocaleString('hi-IN'),
      subtitle: `${districtData.activeJobCards.toLocaleString('hi-IN')} सक्रिय`,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <IndianRupee className="h-6 w-6" />,
      title: 'कुल मजदूरी',
      value: `₹${(districtData.totalWagesPaid / 10000000).toFixed(1)} करोड़`,
      subtitle: `औसत ₹${districtData.averageWageRate}/दिन`,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'पूर्ण कार्य',
      value: districtData.worksCompleted.toLocaleString('hi-IN'),
      subtitle: `${districtData.worksOngoing} चालू`,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'महिला भागीदारी',
      value: `${districtData.womenParticipation}%`,
      subtitle: 'बहुत अच्छा प्रदर्शन',
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50'
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
                  {districtData.hindi || districtData.name} जिला डैशबोर्ड
                </h1>
                <p className="text-blue-100">
                  {districtData.state} | {districtData.currentMonth}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDistrictSelector(!showDistrictSelector)}
                className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                जिला बदलें
              </button>
              <div className="bg-green-600 px-4 py-2 rounded-lg">
                <span className="text-white font-medium">🟢 लाइव डेटा</span>
              </div>
            </div>
          </div>
          
          {/* District Selector Dropdown */}
          {showDistrictSelector && (
            <div className="mt-4 max-w-md">
              <DistrictSelector 
                onDistrictSelect={handleDistrictChange}
                selectedDistrict={selectedDistrict}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <QuickStatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Progress Indicators */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
            मुख्य संकेतक
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ProgressBar 
                label="सक्रिय जॉब कार्ड"
                value={districtData.activeJobCards}
                maxValue={districtData.totalJobCards}
                color="#3b82f6"
              />
              <ProgressBar 
                label="महिला भागीदारी"
                value={districtData.womenParticipation}
                maxValue={100}
                color="#ec4899"
                unit="%"
              />
            </div>
            <div>
              <ProgressBar 
                label="पूर्ण कार्य"
                value={districtData.worksCompleted}
                maxValue={districtData.worksCompleted + districtData.worksOngoing}
                color="#10b981"
              />
              <ProgressBar 
                label="रोजगार लक्ष्य"
                value={districtData.employmentProvided}
                maxValue={districtData.totalPersonDays}
                color="#f59e0b"
              />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Employment Trend */}
          <EmploymentTrendChart data={districtData.monthlyData} />
          
          {/* Work Categories */}
          <WorkCategoriesChart data={districtData.workCategories} />
          
          {/* Monthly Wages */}
          <MonthlyWagesChart data={districtData.monthlyData} />
          
          {/* Payment Status */}
          <PaymentStatusChart data={districtData.paymentStatus} />
        </div>

        {/* Detailed Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">विस्तृत जानकारी</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Employment Details */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                रोजगार विवरण
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">कुल व्यक्ति दिवस</span>
                  <span className="font-semibold text-gray-800">
                    {districtData.totalPersonDays.toLocaleString('hi-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">महिला व्यक्ति दिवस</span>
                  <span className="font-semibold text-gray-800">
                    {districtData.womenPersonDays.toLocaleString('hi-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">औसत मजदूरी दर</span>
                  <span className="font-semibold text-gray-800">
                    ₹{districtData.averageWageRate}
                  </span>
                </div>
              </div>
            </div>

            {/* Work Progress */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                कार्य प्रगति
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">पूर्ण कार्य</span>
                  <span className="font-semibold text-green-600">
                    {districtData.worksCompleted}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">चालू कार्य</span>
                  <span className="font-semibold text-orange-600">
                    {districtData.worksOngoing}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">कुल कार्य</span>
                  <span className="font-semibold text-gray-800">
                    {districtData.worksCompleted + districtData.worksOngoing}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <IndianRupee className="h-5 w-5 mr-2 text-purple-600" />
                वित्तीय सारांश
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">कुल भुगतान</span>
                  <span className="font-semibold text-gray-800">
                    ₹{(districtData.totalWagesPaid / 10000000).toFixed(2)} करोड़
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">औसत दैनिक मजदूरी</span>
                  <span className="font-semibold text-gray-800">
                    ₹{districtData.averageWageRate}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">प्रति व्यक्ति औसत</span>
                  <span className="font-semibold text-gray-800">
                    ₹{Math.round(districtData.totalWagesPaid / districtData.activeJobCards)}
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
            <p className="text-gray-400 text-sm mt-1">
              डेटा अपडेट: {districtData.currentMonth} | सभी आंकड़े वास्तविक समय के हैं
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard

