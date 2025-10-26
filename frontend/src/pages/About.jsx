import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Shield, Users } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">About</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built for Rural India's Digital Empowerment
          </h2>
          <p className="text-xl text-gray-600">
            Making government data accessible to every citizen
          </p>
        </div>

        <div className="space-y-8">
          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  We believe every citizen has the right to understand how government programs 
                  are performing in their area. This dashboard transforms complex data from 
                  data.gov.in into simple, visual information that anyone can understand.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">For Rural Citizens</h3>
                <p className="text-gray-700 leading-relaxed">
                  Designed specifically for users with low technical literacy. We use:
                </p>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li>• Visual icons and colors instead of complex text</li>
                  <li>• Hindi language support</li>
                  <li>• Mobile-first design for smartphone users</li>
                  <li>• Simple navigation with maximum 2-3 clicks</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Data Source & Reliability</h3>
                <p className="text-gray-700 leading-relaxed">
                  All data comes directly from official government APIs at data.gov.in. 
                  We've built robust systems to handle API downtime and ensure you always 
                  have access to the latest available information.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">About MGNREGA</h3>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is one of 
            the world's largest welfare programs. It guarantees 100 days of employment per 
            year to every rural household. In 2025 alone, 12.15 crore rural Indians have 
            benefited from this program.
          </p>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>This is an independent project and is not affiliated with the Government of India.</p>
          <p className="mt-2">Made with ❤️ for digital inclusion</p>
        </div>
      </main>
    </div>
  )
}

export default About

