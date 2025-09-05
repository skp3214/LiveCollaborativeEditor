import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { createLowlight, common } from 'lowlight'
import { marked } from 'marked'
import React, { useState, useCallback, useEffect } from 'react'
import FloatingToolbar from './FloatingToolbar'
import PreviewModal from './PreviewModal'
import { aiService } from '../services/aiService'

// Create lowlight instance with common languages
const lowlight = createLowlight(common)

const extensions = [
  StarterKit,
  TextStyle, 
  Typography,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  CodeBlockLowlight.configure({
    lowlight,
  })
]

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

export default function TiptapEditor({ onContentChange, onEditorReady }) {
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
    content: `<p>Start writing...</p>`,
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

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor)
    }
  }, [editor, onEditorReady])

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

  const insertMarkdownContent = useCallback((content) => {
    if (!editor) return;
    
    // Check if content contains table markdown
    const hasTable = content.includes('|') && content.includes('---');
    
    if (hasTable) {
      // Parse table markdown more carefully
      const lines = content.split('\n').filter(line => line.trim());
      let tableStart = -1;
      let tableEnd = -1;
      
      // Find table boundaries
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('|')) {
          if (tableStart === -1) tableStart = i;
          tableEnd = i;
        } else if (tableStart !== -1) {
          break; // End of table found
        }
      }
      
      if (tableStart !== -1 && tableEnd > tableStart) {
        const tableLines = lines.slice(tableStart, tableEnd + 1);
        
        // Filter out separator row (contains --- or similar)
        const dataLines = tableLines.filter(line => !line.includes('---') && !line.includes('==='));
        
        if (dataLines.length >= 1) {
          // Parse table data
          const rows = dataLines.map(line => 
            line.split('|')
              .map(cell => cell.trim())
              .filter(cell => cell !== '')
          );
          
          // Filter out any empty rows
          const validRows = rows.filter(row => row.length > 0);
          
          if (validRows.length > 0) {
            const headerRow = validRows[0];
            const dataRows = validRows.slice(1);
            
            // Insert content before table
            const beforeTable = lines.slice(0, tableStart).join('\n');
            if (beforeTable.trim()) {
              insertMarkdownContent(beforeTable);
            }
            
            // Create HTML table instead of using Tiptap table commands
            let tableHTML = '<table><thead><tr>';
            
            // Add header cells
            headerRow.forEach(header => {
              tableHTML += `<th>${header}</th>`;
            });
            tableHTML += '</tr></thead><tbody>';
            
            // Add data rows
            dataRows.forEach(row => {
              tableHTML += '<tr>';
              row.forEach((cell, colIndex) => {
                if (colIndex < headerRow.length) {
                  tableHTML += `<td>${cell}</td>`;
                }
              });
              // Fill missing cells if row is shorter than header
              for (let i = row.length; i < headerRow.length; i++) {
                tableHTML += '<td></td>';
              }
              tableHTML += '</tr>';
            });
            
            tableHTML += '</tbody></table>';
            
            // Insert the HTML table
            editor.chain().focus().insertContent(tableHTML).run();
            
            // Insert content after table
            const afterTable = lines.slice(tableEnd + 1).join('\n');
            if (afterTable.trim()) {
              setTimeout(() => {
                editor.chain().focus().insertContent('<p></p>').run(); // Add spacing
                insertMarkdownContent(afterTable);
              }, 200);
            }
          }
        }
      }
    } else {
      // Handle other markdown content - use marked for conversion
      const hasMarkdown = content.includes('**') || content.includes('*') || 
                         content.includes('#') || content.includes('`') ||
                         content.includes('- ') || content.includes('> ') ||
                         content.includes('```');
      
      if (hasMarkdown) {
        try {
          marked.setOptions({
            breaks: true,
            gfm: true,
            sanitize: false
          });
          
          const htmlContent = marked(content);
          editor.chain().focus().insertContent(htmlContent).run();
        } catch (error) {
          console.error('Markdown parsing error:', error);
          editor.chain().focus().insertContent(content).run();
        }
      } else {
        editor.chain().focus().insertContent(content).run();
      }
    }
  }, [editor]);

  const handleConfirmEdit = useCallback(() => {
    if (!editor || !previewData.suggested || selectionRange.from === selectionRange.to) {
      return
    }

    // Use the stored selection range instead of current selection
    const { from, to } = selectionRange
    
    try {
      // Delete the selected range first
      editor.chain().focus().deleteRange({ from, to }).run()
      
      // Insert the content using our markdown-aware function
      insertMarkdownContent(previewData.suggested)
    } catch (error) {
      console.error('Error replacing text:', error)
    }
    
    setShowPreview(false)
    setSelectedText('')
    setToolbarPosition(null)
    setSelectionRange({ from: 0, to: 0 })
  }, [editor, previewData.suggested, selectionRange, insertMarkdownContent])

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
    <div className="flex flex-col h-full bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden">
      {/* Fixed Header with MenuBar */}
      <div className="flex-shrink-0 border-b border-gray-200">
        <MenuBar editor={editor} />
      </div>
      
      {/* Scrollable Editor Content */}
      <div className="flex-1 relative bg-white overflow-y-auto">
        <EditorContent 
          editor={editor} 
          className="prose prose-lg max-w-none h-full"
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
