import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, TrendingUp, Users, IndianRupee, Briefcase, Clock, BarChart3, RefreshCw, Wifi, WifiOff, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import ApiService from '../services/api'
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
  const [selectedDistrict, setSelectedDistrict] = useState(location.state?.district || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendStatus, setBackendStatus] = useState({ available: false, status: 'checking' })
  const [refreshing, setRefreshing] = useState(false)

  // Load district data
  useEffect(() => {
    const loadDistrictData = async () => {
      // Check if we have district data from navigation state
      if (!districtId && location.state?.district) {
        console.log("📊 Using district data from navigation state:", location.state.district.name);
        setSelectedDistrict(location.state.district);
        setLoading(false);
        return;
      }
      
      if (!districtId) {
        console.log("⚠️ No districtId provided in URL parameters and no state data");
        setLoading(false)
        return
      }
      
      console.log('📊 Loading district data for:', districtId);

      try {
        setLoading(true)
        setError(null)
        
        // Check backend status
        const healthResponse = await ApiService.getHealth()
        if (healthResponse.status === 'healthy') {
          setBackendStatus({ available: true, status: 'connected' })
          
          // Get district data
          const response = await ApiService.getDistrict(districtId)
          if (response.success) {
            setSelectedDistrict(response.data)
          } else {
            setError('जिले का डेटा नहीं मिला')
          }
        } else {
          setBackendStatus({ available: false, status: 'disconnected' })
          setError('बैकएंड सर्वर से कनेक्शन नहीं हो सका')
        }
      } catch (error) {
        console.error('❌ Error loading district data:', error)
        setBackendStatus({ available: false, status: 'error' })
        setError('डेटा लोड करने में समस्या हुई')
      } finally {
        setLoading(false)
      }
    }

    loadDistrictData()
  }, [districtId, location.state])

  // Handle district selection from selector
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district)
    navigate(`/dashboard/${district.id}`, { 
      state: { district },
      replace: true 
    })
  }

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await ApiService.refreshData()
      // Reload current district data
      if (selectedDistrict) {
        const response = await ApiService.getDistrict(selectedDistrict.id)
        if (response.success) {
          setSelectedDistrict(response.data)
        }
      }
    } catch (error) {
      console.error('❌ Refresh failed:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Generate mock chart data based on district
  const generateChartData = (district) => {
    if (!district) return { employmentTrend: [], workCategories: [], monthlyWages: [], paymentStatus: [] }
    
    const baseValue = district.name.length * 1000 + Math.floor(Math.random() * 5000)
    
    return {
      employmentTrend: [
        { month: 'मई', employment: baseValue + 2000 },
        { month: 'जून', employment: baseValue + 3500 },
        { month: 'जुलाई', employment: baseValue + 4200 },
        { month: 'अगस्त', employment: baseValue + 3800 },
        { month: 'सितंबर', employment: baseValue + 4500 },
        { month: 'अक्टूबर', employment: baseValue + 5200 },
      ],
      workCategories: [
        { name: 'सड़क निर्माण', value: 35, color: '#3b82f6' },
        { name: 'जल संरक्षण', value: 28, color: '#10b981' },
        { name: 'भवन निर्माण', value: 22, color: '#f59e0b' },
        { name: 'अन्य कार्य', value: 15, color: '#ef4444' },
      ],
      monthlyWages: [
        { month: 'मई', wages: 220 },
        { month: 'जून', wages: 235 },
        { month: 'जुलाई', wages: 245 },
        { month: 'अगस्त', wages: 240 },
        { month: 'सितंबर', wages: 250 },
        { month: 'अक्टूबर', wages: 255 },
      ],
      paymentStatus: [
        { status: 'समय पर भुगतान', count: Math.floor(baseValue * 0.7) },
        { status: 'देरी से भुगतान', count: Math.floor(baseValue * 0.2) },
        { status: 'लंबित भुगतान', count: Math.floor(baseValue * 0.1) },
      ]
    }
  }

  const chartData = generateChartData(selectedDistrict)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">डेटा लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>वापस जाएं</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">MGNREGA Dashboard</h1>
                  <p className="text-sm text-gray-600">मनरेगा डैशबोर्ड</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Backend Status */}
              <div className="flex items-center space-x-2">
                {backendStatus.available ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-xs ${backendStatus.available ? 'text-green-600' : 'text-red-600'}`}>
                  {backendStatus.available ? 'Connected' : 'Offline'}
                </span>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* District Selector */}
        <div className="mb-8">
          <div className="max-w-md">
            <DistrictSelector 
              onDistrictSelect={handleDistrictSelect}
              selectedDistrict={selectedDistrict}
            />
          </div>
        </div>

        {selectedDistrict ? (
          <>
            {/* District Header */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedDistrict.hindi}
                    </h2>
                    <p className="text-gray-600">
                      {selectedDistrict.name}, {selectedDistrict.state}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      जिला कोड: {selectedDistrict.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">अक्टूबर 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <QuickStatsCard
                title="कुल जॉब कार्ड"
                value="35,240"
                subtitle="सक्रिय: 22,150"
                icon={Users}
                color="blue"
              />
              <QuickStatsCard
                title="औसत मजदूरी"
                value="₹255"
                subtitle="प्रति दिन"
                icon={IndianRupee}
                color="green"
              />
              <QuickStatsCard
                title="पूर्ण कार्य"
                value="1,245"
                subtitle="इस महीने"
                icon={Briefcase}
                color="purple"
              />
              <QuickStatsCard
                title="लंबित भुगतान"
                value="₹12.5L"
                subtitle="कुल राशि"
                icon={Clock}
                color="orange"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <EmploymentTrendChart data={chartData.employmentTrend} />
              <WorkCategoriesChart data={chartData.workCategories} />
              <MonthlyWagesChart data={chartData.monthlyWages} />
              <PaymentStatusChart data={chartData.paymentStatus} />
            </div>

            {/* Progress Indicators */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">मासिक प्रगति</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ProgressBar 
                    label="रोजगार लक्ष्य" 
                    value={22150} 
                    max={35000} 
                    color="blue" 
                  />
                  <ProgressBar 
                    label="महिला भागीदारी" 
                    value={11500} 
                    max={22150} 
                    color="green" 
                  />
                  <ProgressBar 
                    label="कार्य पूर्णता" 
                    value={1245} 
                    max={1500} 
                    color="purple" 
                  />
                </div>
                <div>
                  <ProgressBar 
                    label="बजट उपयोग" 
                    value={75} 
                    max={100} 
                    color="orange" 
                  />
                  <ProgressBar 
                    label="भुगतान दर" 
                    value={88} 
                    max={100} 
                    color="green" 
                  />
                  <ProgressBar 
                    label="गुणवत्ता स्कोर" 
                    value={92} 
                    max={100} 
                    color="blue" 
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">कोई जिला चुना नहीं गया</h3>
            <p className="text-gray-600 mb-6">
              अपने जिले का MGNREGA डेटा देखने के लिए ऊपर से जिला चुनें
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard

