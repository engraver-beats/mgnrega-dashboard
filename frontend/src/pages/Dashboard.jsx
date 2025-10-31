import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, IndianRupee, Briefcase, Calendar, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import toast from 'react-hot-toast'
import ApiService from '../services/api'

const Dashboard = () => {
  const { districtId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [district, setDistrict] = useState(location.state?.district || null)
  const [districtData, setDistrictData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDistrictData()
  }, [districtId])

  const loadDistrictData = async () => {
    try {
      setIsLoading(true)
      
      // If we have district from navigation state, use it
      if (location.state?.district && !districtId) {
        setDistrict(location.state.district)
        generateMockData(location.state.district)
        return
      }
      
      // If we have districtId, fetch district data
      if (districtId) {
        const response = await ApiService.getDistrict(districtId)
        if (response.success) {
          setDistrict(response.data)
          generateMockData(response.data)
        }
      }
    } catch (error) {
      console.error('Failed to load district data:', error)
      toast.error('जिले का डेटा लोड नहीं हो सका')
    } finally {
      setIsLoading(false)
    }
  }

  // Generate mock MGNREGA data for demonstration
  const generateMockData = (districtInfo) => {
    const mockData = {
      totalJobCards: Math.floor(Math.random() * 50000) + 20000,
      activeWorkers: Math.floor(Math.random() * 30000) + 15000,
      completedWorks: Math.floor(Math.random() * 1000) + 500,
      ongoingWorks: Math.floor(Math.random() * 200) + 50,
      totalExpenditure: Math.floor(Math.random() * 10000000) + 5000000,
      averageWage: Math.floor(Math.random() * 50) + 200,
      
      monthlyData: [
        { month: 'जन', workers: Math.floor(Math.random() * 5000) + 2000, expenditure: Math.floor(Math.random() * 1000000) + 500000 },
        { month: 'फर', workers: Math.floor(Math.random() * 5000) + 2000, expenditure: Math.floor(Math.random() * 1000000) + 500000 },
        { month: 'मार', workers: Math.floor(Math.random() * 5000) + 2000, expenditure: Math.floor(Math.random() * 1000000) + 500000 },
        { month: 'अप्र', workers: Math.floor(Math.random() * 5000) + 2000, expenditure: Math.floor(Math.random() * 1000000) + 500000 },
        { month: 'मई', workers: Math.floor(Math.random() * 5000) + 2000, expenditure: Math.floor(Math.random() * 1000000) + 500000 },
        { month: 'जून', workers: Math.floor(Math.random() * 5000) + 2000, expenditure: Math.floor(Math.random() * 1000000) + 500000 },
      ],
      
      workCategories: [
        { name: 'जल संरक्षण', value: Math.floor(Math.random() * 200) + 100, color: '#3b82f6' },
        { name: 'सड़क निर्माण', value: Math.floor(Math.random() * 150) + 80, color: '#10b981' },
        { name: 'भवन निर्माण', value: Math.floor(Math.random() * 100) + 50, color: '#f59e0b' },
        { name: 'कृषि कार्य', value: Math.floor(Math.random() * 120) + 60, color: '#ef4444' },
      ]
    }
    
    setDistrictData(mockData)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('hi-IN').format(num)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">डेटा लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  if (!district) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">कोई जिला नहीं मिला</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            होम पर वापस जाएं
          </button>
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
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-8 w-8 text-primary-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{district.name}</h1>
                  <p className="text-sm text-gray-600">{district.hindi} - MGNREGA डैशबोर्ड</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>मध्य प्रदेश</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {districtData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">कुल जॉब कार्ड</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(districtData.totalJobCards)}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">सक्रिय श्रमिक</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(districtData.activeWorkers)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">कुल व्यय</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(districtData.totalExpenditure)}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <IndianRupee className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">औसत मजदूरी</p>
                    <p className="text-2xl font-bold text-gray-900">₹{districtData.averageWage}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Workers Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">मासिक श्रमिक गतिविधि</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={districtData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        formatNumber(value), 
                        name === 'workers' ? 'श्रमिक' : 'व्यय'
                      ]}
                    />
                    <Bar dataKey="workers" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Work Categories Pie Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">कार्य श्रेणियां</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={districtData.workCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {districtData.workCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatNumber(value), 'कार्य']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Work Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">पूर्ण कार्य</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatNumber(districtData.completedWorks)}
                </div>
                <p className="text-gray-600">कुल पूर्ण किए गए कार्य</p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">चालू कार्य</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {formatNumber(districtData.ongoingWorks)}
                </div>
                <p className="text-gray-600">वर्तमान में चल रहे कार्य</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard

