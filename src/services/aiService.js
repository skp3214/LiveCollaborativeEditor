import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the AI with your API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY)

export class AIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  }

  async chat(message) {
    try {
      const enhancedPrompt = `${message}

Please format your response using markdown syntax where appropriate. Use:
- **bold** for emphasis
- *italics* for secondary emphasis  
- # ## ### for headings
- - or * for bullet points
- \`code\` for inline code
- \`\`\`language code blocks for multi-line code
- > for blockquotes
- Tables with | separators when showing data

Provide a well-formatted, readable response.`

      const result = await this.model.generateContent(enhancedPrompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('AI Chat Error:', error)
      return 'Sorry, I encountered an error. Please try again.'
    }
  }

  async editText(text, action) {
    const prompts = {
      shorten: `Shorten this text while keeping the main meaning: "${text}"

Please format your response using markdown syntax where appropriate.`,
      expand: `Expand this text with more details and context: "${text}"

Please format your response using proper markdown syntax with headings, bold text, bullet points, etc. where appropriate.`,
      grammar: `Fix grammar and improve clarity of this text: "${text}"

Please return the corrected text using markdown formatting.`,
      formal: `Make this text more formal and professional: "${text}"

Please format your response using markdown syntax where appropriate.`,
      casual: `Make this text more casual and conversational: "${text}"

Please format your response using markdown syntax where appropriate.`,
      table: `Convert this text into a well-formatted markdown table if possible, otherwise explain why it can't be converted: "${text}"

Use proper markdown table syntax with | separators and alignment.`,
      bullet: `Convert this text into bullet points using markdown syntax: "${text}"

Use - or * for bullet points and format with proper markdown.`,
      summarize: `Summarize this text in 2-3 sentences: "${text}"

Please format your response using markdown syntax with **bold** for key points.`
    }

    const prompt = prompts[action] || `Edit this text using markdown formatting: "${text}"`
    
    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('AI Edit Error:', error)
      return 'Sorry, I encountered an error while editing. Please try again.'
    }
  }

  async processEditorContent(content, instruction) {
    const prompt = `
    You are an AI assistant helping with document editing. 
    Current document content: "${content}"
    
    User instruction: "${instruction}"
    
    Please provide a response that either:
    1. Answers the user's question about the content
    2. Suggests edits to specific parts of the content
    3. Provides general writing advice
    
    If you're suggesting edits, be specific about what parts to change.
    
    Please format your response using markdown syntax where appropriate:
    - Use **bold** for emphasis
    - Use *italics* for secondary emphasis  
    - Use # ## ### for headings
    - Use - or * for bullet points
    - Use \`code\` for inline code
    - Use > for blockquotes
    - Use tables with | separators when showing data
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('AI Process Error:', error)
      return 'Sorry, I encountered an error. Please try again.'
    }
  }
}

export const aiService = new AIService()
