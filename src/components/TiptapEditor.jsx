import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import React, { useState, useCallback, useEffect } from 'react'
import FloatingToolbar from './FloatingToolbar'
import PreviewModal from './PreviewModal'
import { aiService } from '../services/aiService'

const extensions = [TextStyle, StarterKit]

function MenuBar({ editor }) {
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      if (!ctx.editor) return {}
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })

  if (!editor) return null

  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 px-6 py-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            editorState.isBold 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            editorState.isItalic 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            editorState.isStrike 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            editorState.isCode 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Code
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            editorState.isHeading1 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            editorState.isHeading2 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            editorState.isHeading3 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          H3
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            editorState.isBulletList 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            editorState.isOrderedList 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            editorState.isBlockquote 
              ? 'bg-orange-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Quote
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            editorState.isCodeBlock 
              ? 'bg-gray-800 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Code Block
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button 
          onClick={() => editor.chain().focus().undo().run()} 
          disabled={!editorState.canUndo}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          ↶ Undo
        </button>
        <button 
          onClick={() => editor.chain().focus().redo().run()} 
          disabled={!editorState.canRedo}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          ↷ Redo
        </button>
      </div>
    </div>
  )
}

export default function TiptapEditor({ onContentChange }) {
  const [selectedText, setSelectedText] = useState('')
  const [toolbarPosition, setToolbarPosition] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [selectionRange, setSelectionRange] = useState({ from: 0, to: 0 })
  const [previewData, setPreviewData] = useState({
    original: '',
    suggested: '',
    actionType: '',
    isLoading: false
  })

  const editor = useEditor({
    extensions,
    content: `
<h2>Welcome to your AI-Powered Collaborative Editor</h2>
<p>This is a powerful editor with AI assistance. You can:</p>
<ul>
  <li>Select text to see AI editing options</li>
  <li>Use the chat sidebar to ask questions about your content</li>
  <li>Apply AI suggestions with preview</li>
</ul>
<p>Try selecting some text to see the floating toolbar in action!</p>
<blockquote>
  The future of writing is collaborative - between human creativity and AI assistance.
</blockquote>
`,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      onContentChange?.(content)
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to, empty } = editor.state.selection
      
      if (empty) {
        // Only clear if there's no selection - add delay to prevent flicker
        setTimeout(() => {
          const currentSelection = editor.state.selection
          if (currentSelection.empty) {
            setSelectedText('')
            setToolbarPosition(null)
          }
        }, 150)
        return
      }

      const text = editor.state.doc.textBetween(from, to, ' ')
      if (text.trim().length > 0) {
        setSelectedText(text.trim())
        
        // Get selection coordinates
        const { view } = editor
        const start = view.coordsAtPos(from)
        const end = view.coordsAtPos(to)
        
        const newPosition = {
          x: (start.left + end.left) / 2,
          y: start.top
        }
        
        setToolbarPosition(newPosition)
      } else {
        setSelectedText('')
        setToolbarPosition(null)
      }
    }
  })

  const handleEditAction = useCallback(async (text, actionType) => {
    // Store the current selection range before opening the modal
    if (editor) {
      const { from, to } = editor.state.selection
      setSelectionRange({ from, to })
    }
    
    setPreviewData({
      original: text,
      suggested: '',
      actionType,
      isLoading: true
    })
    setShowPreview(true)

    try {
      const suggestion = await aiService.editText(text, actionType)
      setPreviewData(prev => ({
        ...prev,
        suggested: suggestion,
        isLoading: false
      }))
    } catch (error) {
      setPreviewData(prev => ({
        ...prev,
        suggested: 'Sorry, I encountered an error. Please try again.',
        isLoading: false
      }))
    }
  }, [editor])

  const handleConfirmEdit = useCallback(() => {
    console.log('handleConfirmEdit called')
    console.log('editor:', !!editor)
    console.log('previewData.suggested:', previewData.suggested)
    console.log('selectionRange:', selectionRange)
    
    if (!editor || !previewData.suggested || selectionRange.from === selectionRange.to) {
      console.log('Early return due to missing data')
      return
    }

    // Use the stored selection range instead of current selection
    const { from, to } = selectionRange
    console.log('Replacing text from', from, 'to', to, 'with:', previewData.suggested)
    
    try {
      editor.chain().focus().deleteRange({ from, to }).insertContent(previewData.suggested).run()
      console.log('Text replacement successful')
    } catch (error) {
      console.error('Error replacing text:', error)
    }
    
    setShowPreview(false)
    setSelectedText('')
    setToolbarPosition(null)
    setSelectionRange({ from: 0, to: 0 })
    
    console.log('Modal should be closed now')
  }, [editor, previewData.suggested, selectionRange])

  const handleCancelEdit = useCallback(() => {
    setShowPreview(false)
    setSelectionRange({ from: 0, to: 0 })
  }, [])

  const handleRegenerateEdit = useCallback(async () => {
    if (!previewData.original || !previewData.actionType) return

    setPreviewData(prev => ({
      ...prev,
      suggested: '',
      isLoading: true
    }))

    try {
      const suggestion = await aiService.editText(previewData.original, previewData.actionType)
      setPreviewData(prev => ({
        ...prev,
        suggested: suggestion,
        isLoading: false
      }))
    } catch (error) {
      setPreviewData(prev => ({
        ...prev,
        suggested: 'Sorry, I encountered an error. Please try again.',
        isLoading: false
      }))
    }
  }, [previewData.original, previewData.actionType])

  const closeToolbar = useCallback(() => {
    setSelectedText('')
    setToolbarPosition(null)
  }, [])

  // Close toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!showPreview && toolbarPosition) {
        // Check if click is on floating toolbar or its children
        const toolbar = document.querySelector('.floating-toolbar')
        if (toolbar && (toolbar.contains(event.target) || toolbar === event.target)) {
          return // Don't close if clicking on toolbar
        }
        
        // Check if click is on editor content (text selection)
        const editorContent = document.querySelector('.ProseMirror')
        if (editorContent && (editorContent.contains(event.target) || editorContent === event.target)) {
          // Don't close immediately on editor clicks - let selection update handle it
          return
        }
        
        // Close toolbar for clicks outside editor and toolbar
        closeToolbar()
      }
    }

    // Add a small delay to prevent immediate closure on text selection
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)
    
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showPreview, closeToolbar, toolbarPosition])

  if (!editor) return null

  return (
    <div className="bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden">
      <MenuBar editor={editor} />
      
      <div className="relative bg-white">
        <EditorContent 
          editor={editor} 
          className="prose prose-lg max-w-none"
        />
        
        <FloatingToolbar
          selectedText={selectedText}
          position={toolbarPosition}
          onEditAction={handleEditAction}
          onClose={closeToolbar}
        />
      </div>

      <PreviewModal
        isOpen={showPreview}
        originalText={previewData.original}
        suggestedText={previewData.suggested}
        isLoading={previewData.isLoading}
        actionType={previewData.actionType}
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
        onRegenerate={handleRegenerateEdit}
      />
    </div>
  )
}
