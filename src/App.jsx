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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">✨</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Collaborative Editor
                </h1>
                <p className="text-gray-600 text-sm font-medium">Write smarter with AI assistance</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Select text for AI assistance</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
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
            <div className="h-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default App
