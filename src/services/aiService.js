import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyDWjw7CDm4PnwpdwHKPch3t9K_1rYMY67E')

export class AIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  }

  async chat(message) {
    try {
      const result = await this.model.generateContent(message)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('AI Chat Error:', error)
      return 'Sorry, I encountered an error. Please try again.'
    }
  }

  async editText(text, action) {
    const prompts = {
      shorten: `Shorten this text while keeping the main meaning: "${text}"`,
      expand: `Expand this text with more details and context: "${text}"`,
      grammar: `Fix grammar and improve clarity of this text: "${text}"`,
      formal: `Make this text more formal and professional: "${text}"`,
      casual: `Make this text more casual and conversational: "${text}"`,
      table: `Convert this text into a well-formatted HTML table if possible, otherwise explain why it can't be converted: "${text}"`,
      bullet: `Convert this text into bullet points: "${text}"`,
      summarize: `Summarize this text in 2-3 sentences: "${text}"`
    }

    const prompt = prompts[action] || `Edit this text: "${text}"`
    
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
