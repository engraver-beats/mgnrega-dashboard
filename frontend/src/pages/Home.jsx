import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, TrendingUp, Calendar, Award } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    
    try {
      // Simulate location detection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, redirect to dashboard with a sample district
      navigate('/dashboard?district=sample');
    } catch (error) {
      console.error('Location detection failed:', error);
      // Fallback to manual selection
      navigate('/dashboard');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "प्रदर्शन ट्रैकिंग",
      description: "अपने जिले की मनरेगा योजना का वास्तविक समय प्रदर्शन देखें",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "रोजगार डेटा",
      description: "कितने लोगों को काम मिला और कितनी मजदूरी मिली",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "काम की जानकारी",
      description: "कौन से काम हो रहे हैं और कब पूरे होंगे",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "सफलता की कहानी",
      description: "आपके जिले की उपलब्धियां और सुधार के क्षेत्र",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>

      {/* Header */}
      <header className="relative" style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        borderBottom: '3px solid #1d4ed8'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-lg shadow-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MGNREGA Dashboard</h1>
                <p className="text-lg text-blue-100 hindi-text font-medium">मनरेगा डैशबोर्ड</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="#" className="text-white hover:text-blue-200 transition-colors font-medium">Home</a>
                <a href="#dashboard" className="text-white hover:text-blue-200 transition-colors font-medium">Dashboard</a>
                <a href="#about" className="text-white hover:text-blue-200 transition-colors font-medium">About</a>
              </nav>
              <div className="bg-green-600 px-3 py-1 rounded-md">
                <span className="text-white text-sm font-medium">🟢 Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium mb-4">
              🏛️ भारत सरकार | Government of India
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            <span className="text-blue-600">
              अपने जिले का
            </span>
            <br />
            <span className="text-gray-800">मनरेगा प्रदर्शन देखें</span>
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            आसान भाषा में समझें कि आपके जिले में मनरेगा योजना कैसा काम कर रही है। 
            <br className="hidden md:block" />
            <span className="text-blue-700 font-semibold">रोजगार, मजदूरी और काम की जानकारी एक क्लिक में।</span>
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={detectLocation}
              disabled={isDetectingLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg transition-colors duration-200 min-w-[250px] disabled:opacity-50"
            >
              <div className="flex items-center justify-center space-x-3">
                <MapPin className="h-5 w-5" />
                <span>
                  {isDetectingLocation ? 'खोज रहे हैं...' : 'मेरा जिला खोजें'}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-lg px-8 py-4 rounded-lg shadow-lg transition-colors duration-200 min-w-[250px]"
            >
              <div className="flex items-center justify-center space-x-3">
                <span>डैशबोर्ड देखें</span>
              </div>
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border border-gray-200"
            >
              <div className={`bg-gradient-to-r ${feature.color} text-white p-3 rounded-lg inline-block mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">राष्ट्रीय आंकड़े</h3>
            <p className="text-gray-600">मनरेगा योजना के तहत देश भर में हो रहे काम की जानकारी</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">2.8 करोड़</div>
              <div className="text-sm text-gray-600">सक्रिय कार्यकर्ता</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">₹75,000 करोड़</div>
              <div className="text-sm text-gray-600">वार्षिक बजट</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">15 लाख</div>
              <div className="text-sm text-gray-600">चालू प्रोजेक्ट</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">650+</div>
              <div className="text-sm text-gray-600">जिले</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2024 MGNREGA Dashboard | भारत सरकार | Government of India
            </p>
            <p className="text-gray-400 text-sm mt-2">
              महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

