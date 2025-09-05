import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Plus } from 'lucide-react'
import { marked } from 'marked'
import { aiService } from '../services/aiService'

const ChatSidebar = ({ editorContent, onAIEdit, editor }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you edit your document, answer questions, or chat about your content. How can I help you today?'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const insertToEditor = (content) => {
    if (editor) {
      // Check if content contains markdown syntax
      const hasMarkdown = content.includes('**') || content.includes('*') || 
                         content.includes('#') || content.includes('`') ||
                         content.includes('- ') || content.includes('> ') ||
                         content.includes('|') || content.includes('```');
      
      if (hasMarkdown) {
        try {
          // Configure marked options for better parsing
          marked.setOptions({
            breaks: true,
            gfm: true, // GitHub Flavored Markdown
            tables: true,
            sanitize: false
          });
          
          // Parse markdown to HTML
          const htmlContent = marked(content);
          
          // Insert the parsed HTML content
          editor.chain().focus().insertContent(htmlContent).run();
          
        } catch (error) {
          console.error('Markdown parsing error:', error);
          // Fallback: Try inserting raw markdown with proper line breaks
          const formattedContent = content.replace(/\n/g, '<br>');
          try {
            editor.chain().focus().insertContent(formattedContent).run();
          } catch (fallbackError) {
            // Last resort: plain text insertion
            editor.chain().focus().insertContent(content).run();
          }
        }
      } else {
        // For plain text, just insert normally
        editor.chain().focus().insertContent(content).run();
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Check if the message is asking for document edits
      const isEditRequest = inputMessage.toLowerCase().includes('edit') || 
                           inputMessage.toLowerCase().includes('fix') ||
                           inputMessage.toLowerCase().includes('improve') ||
                           inputMessage.toLowerCase().includes('change')

      let aiResponse
      if (isEditRequest && editorContent) {
        aiResponse = await aiService.processEditorContent(editorContent, inputMessage)
      } else {
        aiResponse = await aiService.chat(inputMessage)
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-l border-gray-200 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Assistant</h2>
            <p className="text-blue-100 text-sm">Ready to help with your writing</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message flex items-start space-x-3 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.type === 'ai' && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              
              {/* Insert to Editor button for AI messages */}
              {message.type === 'ai' && message.id !== 1 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => insertToEditor(message.content)}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert to Editor</span>
                  </button>
                </div>
              )}
            </div>

            {message.type === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md border border-gray-100 shadow-md">
              <div className="flex space-x-2 items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500 font-medium">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your document..."
              className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              rows="2"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
          <span>💡</span>
          <span>Try: "Make this more professional" or "Fix grammar errors"</span>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar
