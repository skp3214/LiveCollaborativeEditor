import React from 'react'
import { 
  Scissors, 
  Expand, 
  CheckSquare, 
  Type, 
  FileText, 
  List,
  Sparkles,
  MessageSquare 
} from 'lucide-react'

const FloatingToolbar = ({ selectedText, position, onEditAction, onClose }) => {
  if (!selectedText || !position) return null

  const actions = [
    { id: 'shorten', label: 'Shorten', icon: Scissors, description: 'Make text concise' },
    { id: 'expand', label: 'Expand', icon: Expand, description: 'Add more details' },
    { id: 'grammar', label: 'Fix Grammar', icon: CheckSquare, description: 'Fix grammar issues' },
    { id: 'formal', label: 'Formal', icon: Type, description: 'Make more formal' },
    { id: 'casual', label: 'Casual', icon: MessageSquare, description: 'Make more casual' },
    { id: 'table', label: 'To Table', icon: FileText, description: 'Convert to table' },
    { id: 'bullet', label: 'Bullet Points', icon: List, description: 'Convert to bullets' },
    { id: 'summarize', label: 'Summarize', icon: Sparkles, description: 'Create summary' }
  ]

  const handleAction = (actionId) => {
    onEditAction(selectedText, actionId)
    onClose()
  }

  return (
    <div
      className="fixed z-50 floating-toolbar"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 80}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="bg-white/95 rounded-xl shadow-2xl border border-gray-200 p-3 backdrop-blur-sm">
        <div className="flex flex-wrap gap-1.5 max-w-sm">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                className="group flex items-center space-x-1.5 px-3 py-2 text-xs font-medium bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 text-gray-700 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md hover:scale-105"
                title={action.description}
              >
                <Icon className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                <span>{action.label}</span>
              </button>
            )
          })}
        </div>
        
        <div className="mt-2.5 pt-2.5 border-t border-gray-100">
          <div className="text-xs text-gray-500 font-medium truncate max-w-sm">
            ✨ Selected: "{selectedText.substring(0, 40)}{selectedText.length > 40 ? '...' : ''}"
          </div>
        </div>
      </div>
      
      {/* Enhanced arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
        <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-200"></div>
        <div className="w-0 h-0 border-l-5 border-r-5 border-t-5 border-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-px"></div>
      </div>
    </div>
  )
}

export default FloatingToolbar
