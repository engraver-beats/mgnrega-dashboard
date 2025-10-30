// import React, { useState, useEffect } from 'react'
// import { useParams, useLocation, useNavigate } from 'react-router-dom'
// import { ArrowLeft, MapPin, Calendar, TrendingUp, Users, IndianRupee, Briefcase, Clock, BarChart3, RefreshCw, Wifi, WifiOff, AlertCircle } from 'lucide-react'
// import { Link } from 'react-router-dom'
// import { getDistrictData, checkBackendStatus, refreshData, getAvailableFinancialYears } from '../services/districtService'
// import { 
//   EmploymentTrendChart, 
//   WorkCategoriesChart, 
//   MonthlyWagesChart, 
//   PaymentStatusChart,
//   QuickStatsCard,
//   ProgressBar
// } from '../components/SimpleCharts'
// import DistrictSelector from '../components/DistrictSelector'
// import FinancialYearSelector from '../components/FinancialYearSelector'

// const Dashboard = () => {
//   const { districtId } = useParams()
//   const location = useLocation()
//   const navigate = useNavigate()
//   const [selectedDistrict, setSelectedDistrict] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [backendStatus, setBackendStatus] = useState({ available: false, status: 'checking' })
//   const [refreshing, setRefreshing] = useState(false)
//   const [availableYears, setAvailableYears] = useState([])
//   const [selectedYear, setSelectedYear] = useState(null)
//   const [yearLoading, setYearLoading] = useState(false)

//   // Load available financial years
//   useEffect(() => {
//     const loadFinancialYears = async () => {
//       try {
//         const yearData = await getAvailableFinancialYears()
//         setAvailableYears(yearData.years)
//         if (!selectedYear && yearData.currentYear) {
//           setSelectedYear(yearData.currentYear)
//         }
//       } catch (error) {
//         console.error('Failed to load financial years:', error)
//         // Set fallback years
//         setAvailableYears(['2024', '2023', '2022', '2021', '2020'])
//         if (!selectedYear) {
//           setSelectedYear('2024')
//         }
//       }
//     }

//     loadFinancialYears()
//   }, [])

//   // Load district data
//   useEffect(() => {
//     const loadDistrictData = async () => {
//       if (!districtId) {
//         setLoading(false)
//         return
//       }

//       try {
//         setLoading(true)
//         setError(null)
        
//         // Check backend status
//         const status = await checkBackendStatus()
//         setBackendStatus(status)
        
//         // Load district data
//         const data = await getDistrictData(districtId, selectedYear)
//         if (data) {
//           setSelectedDistrict(data)
//         } else {
//           setError('जिले का डेटा नहीं मिला')
//         }
//       } catch (err) {
//         console.error('Error loading district data:', err)
//         setError('डेटा लोड करने में त्रुटि हुई')
//         setBackendStatus({ available: false, status: 'error' })
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadDistrictData()
//   }, [districtId, selectedYear])

//   // Handle district selection
//   const handleDistrictSelect = (district) => {
//     setSelectedDistrict(district)
//     navigate(`/dashboard/${district.id}`)
//   }

//   // Handle year change
//   const handleYearChange = async (year) => {
//     setYearLoading(true)
//     setSelectedYear(year)
    
//     try {
//       if (districtId) {
//         const data = await getDistrictData(districtId, year)
//         if (data) {
//           setSelectedDistrict(data)
//         }
//       }
//     } catch (error) {
//       console.error('Failed to load data for year:', error)
//     } finally {
//       setYearLoading(false)
//     }
//   }

//   // Handle data refresh
//   const handleRefreshData = async () => {
//     try {
//       setRefreshing(true)
//       await refreshData()
      
//       // Reload district data after refresh
//       if (districtId) {
//         const data = await getDistrictData(districtId, selectedYear)
//         if (data) {
//           setSelectedDistrict(data)
//         }
//       }
//     } catch (error) {
//       console.error('Error refreshing data:', error)
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   // If no district is selected, show district selector
//   if (!districtId) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-gray-800 mb-8">जिला चुनें</h1>
//             <div className="max-w-md mx-auto">
//               <DistrictSelector onDistrictSelect={handleDistrictSelect} />
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">डेटा लोड हो रहा है...</p>
//         </div>
//       </div>
//     )
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">त्रुटि</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <Link 
//             to="/" 
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             वापस जाएं
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center space-x-4">
//             <Link 
//               to="/" 
//               className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//             >
//               <ArrowLeft className="h-5 w-5 mr-2" />
//               वापस
//             </Link>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">
//                 {selectedDistrict?.name || 'डैशबोर्ड'}
//               </h1>
//               <div className="flex items-center space-x-4 mt-2">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <MapPin className="h-4 w-4 mr-1" />
//                   मध्य प्रदेश
//                 </div>
//                 <div className="flex items-center text-sm">
//                   {backendStatus.available ? (
//                     <>
//                       <Wifi className="h-4 w-4 mr-1 text-green-500" />
//                       <span className="text-green-600">लाइव डेटा</span>
//                     </>
//                   ) : (
//                     <>
//                       <WifiOff className="h-4 w-4 mr-1 text-orange-500" />
//                       <span className="text-orange-600">ऑफलाइन डेटा</span>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {backendStatus.available && (
//               <button
//                 onClick={handleRefreshData}
//                 disabled={refreshing}
//                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//               >
//                 <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//                 {refreshing ? 'रिफ्रेश हो रहा है...' : 'डेटा रिफ्रेश करें'}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* District Selector */}
//         <div className="mb-6">
//           <DistrictSelector 
//             onDistrictSelect={handleDistrictSelect} 
//             selectedDistrict={selectedDistrict}
//           />
//         </div>

//         {/* Financial Year Selector */}
//         <div className="mb-6">
//           <FinancialYearSelector
//             selectedYear={selectedYear}
//             onYearChange={handleYearChange}
//             availableYears={availableYears}
//             loading={yearLoading}
//             disabled={!selectedDistrict}
//           />
//         </div>

//         {/* Main Content */}
//         {selectedDistrict && (
//           <>
//             {/* Quick Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//               <QuickStatsCard
//                 title="कुल रोजगार कार्ड"
//                 value={selectedDistrict.totalJobCards?.toLocaleString('hi-IN') || 'N/A'}
//                 icon={<Users className="h-6 w-6" />}
//                 color="blue"
//               />
//               <QuickStatsCard
//                 title="सक्रिय कार्ड"
//                 value={selectedDistrict.activeJobCards?.toLocaleString('hi-IN') || 'N/A'}
//                 icon={<Briefcase className="h-6 w-6" />}
//                 color="green"
//               />
//               <QuickStatsCard
//                 title="कुल व्यय (करोड़)"
//                 value={selectedDistrict.totalExpenditure ? `₹${(selectedDistrict.totalExpenditure / 10000000).toFixed(2)}` : 'N/A'}
//                 icon={<IndianRupee className="h-6 w-6" />}
//                 color="purple"
//               />
//               <QuickStatsCard
//                 title="औसत मजदूरी"
//                 value={selectedDistrict.averageWage ? `₹${selectedDistrict.averageWage.toLocaleString('hi-IN')}` : 'N/A'}
//                 icon={<TrendingUp className="h-6 w-6" />}
//                 color="orange"
//               />
//             </div>

//             {/* Charts Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//               {/* Employment Trend */}
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                   <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
//                   रोजगार रुझान
//                 </h3>
//                 <EmploymentTrendChart data={selectedDistrict.employmentTrend || []} />
//               </div>

//               {/* Work Categories */}
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                   <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
//                   कार्य श्रेणियां
//                 </h3>
//                 <WorkCategoriesChart data={selectedDistrict.workCategories || []} />
//               </div>

//               {/* Monthly Wages */}
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                   <IndianRupee className="h-5 w-5 mr-2 text-purple-600" />
//                   मासिक मजदूरी
//                 </h3>
//                 <MonthlyWagesChart data={selectedDistrict.monthlyWages || []} />
//               </div>

//               {/* Payment Status */}
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                   <Clock className="h-5 w-5 mr-2 text-orange-600" />
//                   भुगतान स्थिति
//                 </h3>
//                 <PaymentStatusChart data={selectedDistrict.paymentStatus || []} />
//               </div>
//             </div>

//             {/* Additional Metrics */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {/* Work Completion Rate */}
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">कार्य पूर्णता दर</h3>
//                 <div className="space-y-3">
//                   <ProgressBar 
//                     label="पूर्ण कार्य" 
//                     value={selectedDistrict.workCompletionRate || 0} 
//                     color="green" 
//                   />
//                   <ProgressBar 
//                     label="चालू कार्य" 
//                     value={selectedDistrict.ongoingWorkRate || 0} 
//                     color="blue" 
//                   />
//                   <ProgressBar 
//                     label="लंबित कार्य" 
//                     value={selectedDistrict.pendingWorkRate || 0} 
//                     color="orange" 
//                   />
//                 </div>
//               </div>

//               {/* Gender Distribution */}
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">लिंग वितरण</h3>
//                 <div className="space-y-3">
//                   <ProgressBar 
//                     label="महिला श्रमिक" 
//                     value={selectedDistrict.femaleWorkerPercentage || 0} 
//                     color="pink" 
//                   />
//                   <ProgressBar 
//                     label="पुरुष श्रमिक" 
//                     value={selectedDistrict.maleWorkerPercentage || 0} 
//                     color="blue" 
//                   />
//                 </div>
//               </div>

//               {/* Payment Efficiency */}
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">भुगतान दक्षता</h3>
//                 <div className="space-y-3">
//                   <ProgressBar 
//                     label="समय पर भुगतान" 
//                     value={selectedDistrict.timelyPaymentRate || 0} 
//                     color="green" 
//                   />
//                   <ProgressBar 
//                     label="विलंबित भुगतान" 
//                     value={selectedDistrict.delayedPaymentRate || 0} 
//                     color="red" 
//                   />
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Dashboard

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DistrictSelector from "../components/DistrictSelector";
import { getDistrictData } from "../services/districtService";
import {
  MonthlyEmploymentChart,
  MonthlyWagesChart,
  PaymentStatusChart,
  WorkCategoryChart
} from "../components/SimpleCharts";

const Dashboard = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();

  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Load data when route changes
  useEffect(() => {
    async function fetchData() {
      if (!districtId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getDistrictData(districtId);
        setDistrict(data);
        setError("");
      } catch (err) {
        console.error("❌ Failed loading district:", err);
        setError("डेटा लोड करने में समस्या हुई");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [districtId]);

  // ✅ When user selects district, navigate to dashboard
  const handleDistrictSelect = (d) => {
    navigate(`/dashboard/${d.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* ✅ District Selector */}
        <DistrictSelector
          onDistrictSelect={handleDistrictSelect}
          selectedDistrict={district}
        />

        {/* ✅ Loading */}
        {loading && (
          <div className="text-center text-gray-600 py-10">
            डेटा लोड हो रहा है...
          </div>
        )}

        {/* ✅ Error */}
        {!loading && error && (
          <div className="bg-red-100 text-red-700 p-4 rounded text-center">
            {error}
          </div>
        )}

        {/* ✅ No district chosen */}
        {!loading && !district && !error && (
          <div className="text-center bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-2">कृपया जिला चुनें</h2>
            <p className="text-gray-600">
              ऊपर के सर्च बॉक्स से अपना जिला चुनें।
            </p>
          </div>
        )}

        {/* ✅ Show Data When Loaded */}
        {!loading && district && (
          <div className="space-y-6">

            {/* District Header */}
            <div className="bg-white p-6 shadow rounded">
              <h1 className="text-3xl font-bold text-blue-700">
                {district.hindi} ({district.state})
              </h1>
              <p className="text-gray-600 mt-2">
                अंतिम अपडेट: {district.lastUpdated || "—"}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "कुल जॉब कार्ड", value: district.totalJobCards },
                { label: "सक्रिय जॉब कार्ड", value: district.activeJobCards },
                { label: "कार्य दिवस", value: district.totalPersonDays },
                { label: "महिला कार्य दिवस", value: district.womenPersonDays },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded shadow text-center">
                  <div className="text-xl font-bold text-blue-700">{item.value}</div>
                  <div className="text-gray-600 text-sm">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-2">रोजगार ट्रेंड</h2>
                <MonthlyEmploymentChart data={district.monthlyData} />
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-2">भुगतान ट्रेंड</h2>
                <MonthlyWagesChart data={district.monthlyData} />
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-2">कार्य श्रेणी</h2>
                <WorkCategoryChart data={district.workCategories} />
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-2">पेमेन्ट स्टेटस</h2>
                <PaymentStatusChart data={district.paymentStatus} />
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
