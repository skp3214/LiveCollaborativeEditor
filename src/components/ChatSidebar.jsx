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
      // More precise table detection
      const tablePattern = /^\s*\|.*\|\s*\n\s*\|[-:\s|]+\|\s*\n(\s*\|.*\|\s*\n?)+/gm;
      const tableMatches = [...content.matchAll(tablePattern)];
      
      if (tableMatches.length > 0) {
        let lastIndex = 0;
        
        // Process each table match
        for (const match of tableMatches) {
          const tableStart = match.index;
          const tableContent = match[0];
          const tableEnd = tableStart + tableContent.length;
          
          // Insert content before this table
          if (tableStart > lastIndex) {
            const beforeContent = content.substring(lastIndex, tableStart).trim();
            if (beforeContent) {
              insertMarkdownContent(beforeContent);
            }
          }
          
          // Process the table
          const lines = tableContent.trim().split('\n').filter(line => line.trim());
          const dataLines = lines.filter(line => 
            line.includes('|') && !line.match(/^\s*\|[-:\s|]+\|\s*$/)
          );
          
          if (dataLines.length >= 2) {
            const rows = dataLines.map(line => 
              line.split('|').map(cell => cell.trim()).filter(cell => cell !== '')
            );
            
            if (rows.length > 0 && rows[0].length > 0) {
              const [headerRow, ...dataRows] = rows;
              
              let tableHTML = '<table><thead><tr>';
              headerRow.forEach(header => {
                // Process markdown in header cells
                const processedHeader = header
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/`(.*?)`/g, '<code>$1</code>');
                tableHTML += `<th>${processedHeader}</th>`;
              });
              tableHTML += '</tr></thead><tbody>';
              
              dataRows.forEach(row => {
                tableHTML += '<tr>';
                headerRow.forEach((_, colIndex) => {
                  const cellContent = row[colIndex] || '';
                  // Process markdown in data cells
                  const processedCell = cellContent
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>');
                  tableHTML += `<td>${processedCell}</td>`;
                });
                tableHTML += '</tr>';
              });
              
              tableHTML += '</tbody></table>';
              
              // Insert the table with some spacing
              editor.chain().focus().insertContent(tableHTML + '<p></p>').run();
            }
          }
          
          lastIndex = tableEnd;
        }
        
        // Insert any remaining content after the last table
        if (lastIndex < content.length) {
          const remainingContent = content.substring(lastIndex).trim();
          if (remainingContent) {
            // Add a small delay to ensure proper insertion order
            setTimeout(() => {
              insertMarkdownContent(remainingContent);
            }, 50);
          }
        }
      } else {
        // No tables found, process as regular markdown
        insertMarkdownContent(content);
      }
    }
  }
  
  const insertMarkdownContent = (content) => {
    // Check if content contains markdown syntax
    const hasMarkdown = content.includes('**') || content.includes('*') || 
                       content.includes('#') || content.includes('`') ||
                       content.includes('- ') || content.includes('> ') ||
                       content.includes('```');
    
    if (hasMarkdown) {
      try {
        // Configure marked options for better parsing
        marked.setOptions({
          breaks: true,
          gfm: true, // GitHub Flavored Markdown
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
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-black to-gray-800 border-l border-gray-600/30 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-600/50 bg-gradient-to-r from-gray-800 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-transparent"></div>
        <div className="relative flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-300 rounded-full border-2 border-black animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Assistant</h2>
            <p className="text-gray-300 text-sm">Ready to help with your writing</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-900/50 to-black">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message flex items-start space-x-3 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.type === 'ai' && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-500/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-br-md border border-gray-600/30'
                  : 'bg-gray-800/80 text-gray-100 border border-gray-600/30 rounded-bl-md shadow-xl backdrop-blur-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              
              {/* Insert to Editor button for AI messages */}
              {message.type === 'ai' && message.id !== 1 && (
                <div className="mt-3 pt-3 border-t border-gray-600/30">
                  <button
                    onClick={() => insertToEditor(message.content)}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-900/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert to Editor</span>
                  </button>
                </div>
              )}
            </div>

            {message.type === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-500/30">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="bg-gray-800/80 text-gray-100 px-4 py-3 rounded-2xl rounded-bl-md border border-gray-600/30 shadow-xl backdrop-blur-sm">
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
      <div className="p-6 border-t border-gray-600/50 bg-gradient-to-r from-gray-900 to-black">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your document..."
              className="w-full resize-none border border-gray-600/30 bg-gray-800/50 text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition-all duration-200 shadow-lg backdrop-blur-sm placeholder-gray-400"
              rows="2"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl hover:from-gray-600 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-600/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400 flex items-center space-x-1">
          <span>💡</span>
          <span>Try: "Make this more professional" or "Fix grammar errors"</span>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar
