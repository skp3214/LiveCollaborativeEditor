import React, { useState } from 'react'
import TiptapEditor from './components/TiptapEditor'
import ChatSidebar from './components/ChatSidebar'
import './App.css'

const App = () => {
  const [editorContent, setEditorContent] = useState('')
  const [editorInstance, setEditorInstance] = useState(null)

  const handleContentChange = (content) => {
    setEditorContent(content)
  }

  const handleEditorReady = (editor) => {
    setEditorInstance(editor)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-gray-500/30">
                <span className="text-black font-bold text-xl">✨</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  AI Collaborative Editor
                </h1>
                <p className="text-gray-400 text-sm font-medium">Write smarter with AI assistance</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                <span>Select text for AI assistance</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                <span>Chat with AI for help</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8 overflow-hidden">
            <div className="h-full bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/30 overflow-hidden ring-1 ring-gray-500/20">
              <TiptapEditor 
                onContentChange={handleContentChange} 
                onEditorReady={handleEditorReady}
              />
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-96 h-full">
          <ChatSidebar 
            editorContent={editorContent}
            editor={editorInstance}
            onAIEdit={() => {}} // This could be expanded for direct AI edits from chat
          />
        </div>
      </div>
      
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-gray-300/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default App
