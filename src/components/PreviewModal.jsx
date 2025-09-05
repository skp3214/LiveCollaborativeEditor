import React from 'react'
import { createPortal } from 'react-dom'
import { X, Check, RefreshCw } from 'lucide-react'

const PreviewModal = ({ 
  isOpen, 
  originalText, 
  suggestedText, 
  isLoading,
  actionType,
  onConfirm, 
  onCancel,
  onRegenerate 
}) => {
  if (!isOpen) return null

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const actionLabels = {
    shorten: 'Shortened Text',
    expand: 'Expanded Text',
    grammar: 'Grammar Fixed',
    formal: 'Formal Version',
    casual: 'Casual Version',
    table: 'Table Format',
    bullet: 'Bullet Points',
    summarize: 'Summary'
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto modal-overlay">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-md"
          onClick={onCancel}
        ></div>

        {/* Modal */}
        <div className="modal-content inline-block w-full max-w-6xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl border border-gray-200 relative z-[10000]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">✨</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  AI Suggestion: {actionLabels[actionType] || 'Edited Text'}
                </h3>
                <p className="text-sm text-gray-600">Review and apply the AI-generated changes</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Original Text */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <h4 className="text-lg font-semibold text-gray-700">Original Text</h4>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-80 overflow-y-auto">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{originalText}</p>
                </div>
              </div>

              {/* Suggested Text */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <h4 className="text-lg font-semibold text-gray-700">AI Suggestion</h4>
                  {!isLoading && suggestedText && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Ready
                    </span>
                  )}
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-blue-600 text-xl">✨</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-700">Generating AI suggestion...</p>
                          <p className="text-xs text-blue-600">This may take a few seconds</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{suggestedText}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onRegenerate}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              
              <button
                onClick={() => {
                  console.log('Apply Changes button clicked')
                  console.log('onConfirm function:', !!onConfirm)
                  console.log('isLoading:', isLoading)
                  console.log('suggestedText:', !!suggestedText)
                  console.log('button disabled:', isLoading || !suggestedText)
                  if (onConfirm) {
                    onConfirm()
                  } else {
                    console.error('onConfirm function is not defined')
                  }
                }}
                disabled={isLoading || !suggestedText}
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default PreviewModal
