import React, { useState, useEffect } from 'react'
import { Calendar, ChevronDown, RefreshCw } from 'lucide-react'

const FinancialYearSelector = ({ 
  selectedYear, 
  onYearChange, 
  availableYears = [], 
  loading = false,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.year-selector')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleYearSelect = async (year) => {
    if (year === selectedYear || disabled) return
    
    setLocalLoading(true)
    setIsOpen(false)
    
    try {
      await onYearChange(year)
    } catch (error) {
      console.error('Failed to change year:', error)
    } finally {
      setLocalLoading(false)
    }
  }

  const isLoading = loading || localLoading

  return (
    <div className="year-selector relative">
      <div className="flex items-center space-x-2 mb-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">वित्तीय वर्ष</span>
      </div>
      
      <div className="relative">
        <button
          onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className={`
            w-full flex items-center justify-between px-4 py-2 
            bg-white border border-gray-300 rounded-lg shadow-sm
            hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isOpen ? 'border-blue-500 ring-2 ring-blue-500' : ''}
          `}
        >
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
            ) : (
              <Calendar className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-900">
              {selectedYear ? `${selectedYear}-${(parseInt(selectedYear) + 1).toString().slice(-2)}` : 'वर्ष चुनें'}
            </span>
          </div>
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && !disabled && !isLoading && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {availableYears.length > 0 ? (
              availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`
                    w-full px-4 py-2 text-left text-sm hover:bg-blue-50 
                    transition-colors duration-150 flex items-center justify-between
                    ${selectedYear === year 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:text-blue-600'
                    }
                    ${year === availableYears[0] ? 'rounded-t-lg' : ''}
                    ${year === availableYears[availableYears.length - 1] ? 'rounded-b-lg' : ''}
                  `}
                >
                  <span>{year}-{(parseInt(year) + 1).toString().slice(-2)}</span>
                  {selectedYear === year && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                कोई वित्तीय वर्ष उपलब्ध नहीं
              </div>
            )}
          </div>
        )}
      </div>

      {/* Year Info */}
      {selectedYear && !isLoading && (
        <div className="mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
            <span>वर्तमान: {selectedYear}-{(parseInt(selectedYear) + 1).toString().slice(-2)}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-2 text-xs text-blue-600 flex items-center space-x-1">
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>डेटा लोड हो रहा है...</span>
        </div>
      )}

      {/* Available Years Count */}
      {availableYears.length > 0 && !isLoading && (
        <div className="mt-1 text-xs text-gray-400">
          {availableYears.length} वर्ष उपलब्ध
        </div>
      )}
    </div>
  )
}

export default FinancialYearSelector
