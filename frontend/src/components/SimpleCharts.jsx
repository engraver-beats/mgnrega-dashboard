// import React from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, LineChart, Line, Legend
// } from 'recharts';
// import { TrendingUp, Users, IndianRupee, Briefcase } from 'lucide-react';

// // Custom tooltip for better Hindi support
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
//         <p className="font-semibold text-gray-800">{label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} style={{ color: entry.color }} className="text-sm">
//             {entry.name}: {entry.value.toLocaleString('hi-IN')}
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

// // Employment Trend Chart (Line Chart)
// export const EmploymentTrendChart = ({ data }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
//       <div className="flex items-center space-x-3 mb-6">
//         <div className="bg-blue-100 p-2 rounded-lg">
//           <TrendingUp className="h-6 w-6 text-blue-600" />
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-gray-800">रोजगार का रुझान</h3>
//           <p className="text-gray-600 text-sm">पिछले 12 महीनों में रोजगार की स्थिति</p>
//         </div>
//       </div>
      
//       <div className="h-80 min-h-[320px]">
//         <ResponsiveContainer width="100%" height="100%" minHeight={320}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis 
//               dataKey="month" 
//               tick={{ fontSize: 12 }}
//               stroke="#666"
//             />
//             <YAxis 
//               tick={{ fontSize: 12 }}
//               stroke="#666"
//               tickFormatter={(value) => `${(value/1000).toFixed(0)}K`}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Line 
//               type="monotone" 
//               dataKey="employment" 
//               stroke="#3b82f6" 
//               strokeWidth={3}
//               dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
//               name="रोजगार (व्यक्ति दिवस)"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
      
//       <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//         <p className="text-sm text-blue-700 text-center">
//           📈 ऊपर की रेखा अच्छा प्रदर्शन दिखाती है
//         </p>
//       </div>
//     </div>
//   );
// };

// // Work Categories Chart (Pie Chart)
// export const WorkCategoriesChart = ({ data }) => {
//   const RADIAN = Math.PI / 180;
  
//   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text 
//         x={x} 
//         y={y} 
//         fill="white" 
//         textAnchor={x > cx ? 'start' : 'end'} 
//         dominantBaseline="central"
//         fontSize={12}
//         fontWeight="bold"
//       >
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
//       <div className="flex items-center space-x-3 mb-6">
//         <div className="bg-green-100 p-2 rounded-lg">
//           <Briefcase className="h-6 w-6 text-green-600" />
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-gray-800">काम के प्रकार</h3>
//           <p className="text-gray-600 text-sm">विभिन्न कार्यों का वितरण</p>
//         </div>
//       </div>

//       <div className="h-80 min-h-[320px]">
//         <ResponsiveContainer width="100%" height="100%" minHeight={320}>
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={renderCustomizedLabel}
//               outerRadius={100}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Legend */}
//       <div className="grid grid-cols-2 gap-2 mt-4">
//         {data.map((entry, index) => (
//           <div key={index} className="flex items-center space-x-2">
//             <div 
//               className="w-4 h-4 rounded-full" 
//               style={{ backgroundColor: entry.color }}
//             ></div>
//             <span className="text-sm text-gray-700">{entry.hindi}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Monthly Wages Chart (Bar Chart)
// export const MonthlyWagesChart = ({ data }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
//       <div className="flex items-center space-x-3 mb-6">
//         <div className="bg-green-100 p-2 rounded-lg">
//           <IndianRupee className="h-6 w-6 text-green-600" />
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-gray-800">मासिक मजदूरी</h3>
//           <p className="text-gray-600 text-sm">हर महीने दी गई मजदूरी की राशि</p>
//         </div>
//       </div>

//       <div className="h-80 min-h-[320px]">
//         <ResponsiveContainer width="100%" height="100%" minHeight={320}>
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis 
//               dataKey="month" 
//               tick={{ fontSize: 12 }}
//               stroke="#666"
//             />
//             <YAxis 
//               tick={{ fontSize: 12 }}
//               stroke="#666"
//               tickFormatter={(value) => `₹${(value/1000000).toFixed(1)}L`}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar 
//               dataKey="wages" 
//               fill="#10b981"
//               radius={[4, 4, 0, 0]}
//               name="मजदूरी (रुपये)"
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="mt-4 p-3 bg-green-50 rounded-lg">
//         <p className="text-sm text-green-700 text-center">
//           💰 ऊंचे बार ज्यादा मजदूरी दिखाते हैं
//         </p>
//       </div>
//     </div>
//   );
// };

// // Payment Status Chart (Simple Pie Chart)
// export const PaymentStatusChart = ({ data }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
//       <div className="flex items-center space-x-3 mb-6">
//         <div className="bg-orange-100 p-2 rounded-lg">
//           <IndianRupee className="h-6 w-6 text-orange-600" />
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-gray-800">भुगतान की स्थिति</h3>
//           <p className="text-gray-600 text-sm">कितना पैसा मिल गया है</p>
//         </div>
//       </div>

//       <div className="flex items-center justify-center">
//         <div className="h-48 w-48 min-h-[192px] min-w-[192px]">
//           <ResponsiveContainer width="100%" height="100%" minHeight={192}>
//             <PieChart>
//               <Pie
//                 data={data}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={40}
//                 outerRadius={80}
//                 paddingAngle={5}
//                 dataKey="value"
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip content={<CustomTooltip />} />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Status Cards */}
//       <div className="grid grid-cols-2 gap-4 mt-6">
//         {data.map((entry, index) => (
//           <div key={index} className="text-center p-4 rounded-lg" style={{ backgroundColor: `${entry.color}20` }}>
//             <div className="text-2xl font-bold" style={{ color: entry.color }}>
//               {entry.value}%
//             </div>
//             <div className="text-sm text-gray-700 mt-1">{entry.name}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Simple Progress Bar Component
// export const ProgressBar = ({ label, value, maxValue, color = '#3b82f6', unit = '' }) => {
//   const percentage = (value / maxValue) * 100;
  
//   return (
//     <div className="mb-4">
//       <div className="flex justify-between items-center mb-2">
//         <span className="text-sm font-medium text-gray-700">{label}</span>
//         <span className="text-sm font-bold text-gray-800">
//           {value.toLocaleString('hi-IN')}{unit}
//         </span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-3">
//         <div 
//           className="h-3 rounded-full transition-all duration-500 ease-out"
//           style={{ 
//             width: `${Math.min(percentage, 100)}%`,
//             backgroundColor: color 
//           }}
//         ></div>
//       </div>
//       <div className="text-xs text-gray-500 mt-1 text-right">
//         {percentage.toFixed(1)}%
//       </div>
//     </div>
//   );
// };

// // Quick Stats Cards
// export const QuickStatsCard = ({ icon, title, value, subtitle, color, bgColor }) => {
//   return (
//     <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
//       <div className="flex items-center justify-between mb-3">
//         <div className={`${color} p-2 rounded-lg`}>
//           {icon}
//         </div>
//       </div>
//       <div className="space-y-1">
//         <p className="text-sm text-gray-600 font-medium">{title}</p>
//         <p className="text-2xl font-bold text-gray-800">{value}</p>
//         {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
//       </div>
//     </div>
//   );
// };

import React from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ✅ Employment over months (Person Days)
export const MonthlyEmploymentChart = ({ data }) => {
  if (!data || !data.length) return <div className="text-gray-500 text-sm p-4">कोई डेटा उपलब्ध नहीं</div>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="personDays" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// ✅ Wages over months
export const MonthlyWagesChart = ({ data }) => {
  if (!data || !data.length) return <div className="text-gray-500 text-sm p-4">कोई डेटा उपलब्ध नहीं</div>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="wages" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ✅ Work categories distribution
export const WorkCategoryChart = ({ data }) => {
  if (!data || !data.length) return <div className="text-gray-500 text-sm p-4">कोई डेटा उपलब्ध नहीं</div>;

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="percentage" nameKey="category" outerRadius={80} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// ✅ Payment completed vs pending
export const PaymentStatusChart = ({ data }) => {
  if (!data || !data.length) return <div className="text-gray-500 text-sm p-4">कोई डेटा उपलब्ध नहीं</div>;

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="percentage" nameKey="status" outerRadius={80} label>
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
