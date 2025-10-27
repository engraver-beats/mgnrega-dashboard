import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, TrendingUp, Users, IndianRupee, Briefcase, Clock, BarChart3, RefreshCw, Wifi, WifiOff, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDistrictData, checkBackendStatus, refreshData } from '../services/districtService'
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendStatus, setBackendStatus] = useState({ available: false, status: 'checking' })
  const [refreshing, setRefreshing] = useState(false)

  // Load district data
  useEffect(() => {
    const loadDistrictData = async () => {
      if (!districtId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Check backend status
        const status = await checkBackendStatus()
        setBackendStatus(status)
        
        // Load district data
        const data = await getDistrictData(districtId)
        if (data) {
          setSelectedDistrict(data)
        } else {
          setError('जिले का डेटा नहीं मिला')
        }
      } catch (err) {
        console.error('Error loading district data:', err)
        setError('डेटा लोड करने में समस्या हुई')
      } finally {
        setLoading(false)
      }
    }

    loadDistrictData()
  }, [districtId])

  // Handle district selection
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district)
    navigate(`/dashboard/${district.id}`)
  }

  // Handle data refresh
  const handleRefreshData = async () => {
    try {
      setRefreshing(true)
      await refreshData()
      
      // Reload current district data
      if (districtId) {
        const data = await getDistrictData(districtId)
        if (data) {
          setSelectedDistrict(data)
        }
      }
      
      // Update backend status
      const status = await checkBackendStatus()
      setBackendStatus(status)
      
    } catch (error) {
      console.error('Failed to refresh data:', error)
      alert('डेटा रिफ्रेश करने में समस्या हुई')
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">डेटा लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">समस्या हुई</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            to="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            वापस जाएं
          </Link>
        </div>
      </div>
    )
  }

  if (!selectedDistrict) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">जिला चुनें</h1>
            <div className="max-w-md mx-auto">
              <DistrictSelector onDistrictSelect={handleDistrictSelect} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">वापस</span>
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">MGNREGA डैशबोर्ड</h1>
                  <p className="text-sm text-gray-600">जिला प्रदर्शन विश्लेषण</p>
                </div>
              </div>
            </div>

            {/* Backend Status & Refresh */}
            <div className="flex items-center space-x-4">
              {/* Data Source Indicator */}
              <div className="flex items-center space-x-2">
                {selectedDistrict?.dataSource?.includes('Real Government') ? (
                  <>
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">🏛️ सरकारी डेटा</span>
                  </>
                ) : selectedDistrict?.dataSource?.includes('Government District Database') ? (
                  <>
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-600 font-medium">📊 सरकारी जिला डेटाबेस</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-orange-600 font-medium">📱 स्थानीय डेटा</span>
                  </>
                )}
              </div>

              {/* Backend Status Indicator */}
              <div className="flex items-center space-x-2">
                {backendStatus.available ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">लाइव कनेक्शन</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-orange-600 font-medium">ऑफलाइन मोड</span>
                  </>
                )}
              </div>

              {/* Refresh Button */}
              {backendStatus.available && (
                <button
                  onClick={handleRefreshData}
                  disabled={refreshing}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">
                    {refreshing ? 'रिफ्रेश हो रहा है...' : 'डेटा रिफ्रेश करें'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* District Info Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedDistrict.hindi}</h2>
                <p className="text-gray-600">{selectedDistrict.name}, {selectedDistrict.state}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{selectedDistrict.currentMonth}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">डेटा स्रोत</div>
              <div className="flex items-center space-x-2">
                {selectedDistrict?.dataSource?.includes('Real Government') ? (
                  <>
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">🟢 वास्तविक सरकारी डेटा</span>
                  </>
                ) : selectedDistrict?.dataSource?.includes('Government District Database') ? (
                  <>
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-700">🟡 सरकारी जिला डेटाबेस</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium text-orange-700">📱 पैटर्न आधारित डेटा</span>
                  </>
                )}
              </div>
              {selectedDistrict.lastUpdated && (
                <div className="text-xs text-gray-500 mt-1">
                  अपडेट: {new Date(selectedDistrict.lastUpdated).toLocaleDateString('hi-IN')}
                </div>
              )}
            </div>
          </div>

          {/* District Selector */}
          <div className="mb-6">
            <DistrictSelector 
              onDistrictSelect={handleDistrictSelect} 
              selectedDistrict={selectedDistrict}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickStatsCard
              icon={<Users className="h-6 w-6" />}
              title="कुल जॉब कार्ड"
              value={selectedDistrict.totalJobCards?.toLocaleString('hi-IN') || '0'}
              subtitle={`${selectedDistrict.activeJobCards?.toLocaleString('hi-IN') || '0'} सक्रिय`}
              color="bg-blue-100 text-blue-600"
              bgColor="bg-blue-50"
            />
            
            <QuickStatsCard
              icon={<Briefcase className="h-6 w-6" />}
              title="रोजगार प्रदान"
              value={selectedDistrict.employmentProvided?.toLocaleString('hi-IN') || '0'}
              subtitle="व्यक्ति दिवस"
              color="bg-green-100 text-green-600"
              bgColor="bg-green-50"
            />
            
            <QuickStatsCard
              icon={<IndianRupee className="h-6 w-6" />}
              title="कुल मजदूरी"
              value={`₹${(selectedDistrict.totalWagesPaid / 1000000)?.toFixed(1) || '0'}L`}
              subtitle={`औसत ₹${selectedDistrict.averageWageRate || '0'}/दिन`}
              color="bg-yellow-100 text-yellow-600"
              bgColor="bg-yellow-50"
            />
            
            <QuickStatsCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="महिला भागीदारी"
              value={`${selectedDistrict.womenParticipation || '0'}%`}
              subtitle={`${selectedDistrict.womenPersonDays?.toLocaleString('hi-IN') || '0'} व्यक्ति दिवस`}
              color="bg-purple-100 text-purple-600"
              bgColor="bg-purple-50"
            />
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">प्रगति सूचक</h3>
          <div className="space-y-4">
            <ProgressBar
              label="सक्रिय जॉब कार्ड"
              value={selectedDistrict.activeJobCards || 0}
              maxValue={selectedDistrict.totalJobCards || 1}
              color="#3b82f6"
              unit=""
            />
            <ProgressBar
              label="पूर्ण कार्य"
              value={selectedDistrict.worksCompleted || 0}
              maxValue={(selectedDistrict.worksCompleted || 0) + (selectedDistrict.worksOngoing || 0)}
              color="#10b981"
              unit=" कार्य"
            />
            <ProgressBar
              label="महिला भागीदारी"
              value={selectedDistrict.womenPersonDays || 0}
              maxValue={selectedDistrict.totalPersonDays || 1}
              color="#8b5cf6"
              unit=" दिन"
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Employment Trend */}
          <EmploymentTrendChart data={selectedDistrict.monthlyData || []} />
          
          {/* Work Categories */}
          <WorkCategoriesChart data={selectedDistrict.workCategories || []} />
          
          {/* Monthly Wages */}
          <MonthlyWagesChart data={selectedDistrict.monthlyData || []} />
          
          {/* Payment Status */}
          <PaymentStatusChart data={selectedDistrict.paymentStatus || []} />
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              📊 यह डैशबोर्ड महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (MGNREGA) के तहत जिला स्तरीय प्रदर्शन दिखाता है
            </p>
            <p className="text-xs text-gray-500">
              डेटा स्रोत: ग्रामीण विकास मंत्रालय, भारत सरकार | 
              {backendStatus.available ? ' 🟢 लाइव डेटा' : ' 🟡 ऑफलाइन मोड'}
            </p>
            {backendStatus.lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                अंतिम अपडेट: {new Date(backendStatus.lastUpdated).toLocaleString('hi-IN')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
