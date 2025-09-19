# 🖋️ Live Collaborative Editor

A sophisticated, AI-powered rich text editor built with React and TipTap. Experience seamless document editing with intelligent AI assistance, premium monochromatic design, and advanced formatting capabilities.

## 🌟 Live Demo
<img width="3200" height="2000" alt="image" src="https://github.com/user-attachments/assets/1a879214-9adc-479d-8f34-a3011b7021a1" />
**[Try it now →](https://live-collaborative-editor-theta.vercel.app/)**

## ✨ Features

### 🤖 AI-Powered Editing
- **Smart Text Enhancement**: Improve grammar, tone, and clarity with AI
- **Intelligent Suggestions**: Get contextual writing recommendations
- **Multiple AI Actions**: Shorten, expand, formalize, or summarize content
- **Content Formatting**: Auto-convert text to tables, bullet points, and more

### 📝 Rich Text Editing
- **Advanced Formatting**: Bold, italic, underline, strikethrough
- **Structure Elements**: Headers, bullet lists, numbered lists, blockquotes
- **Code Support**: Inline code and code blocks with syntax highlighting
- **Tables**: Create and edit tables with intuitive controls
- **Links**: Easy link insertion and management

### 🎨 Premium Design
- **Monochromatic Theme**: Sophisticated white/black/gray color palette
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Floating Toolbar**: Context-sensitive editing controls
- **Smooth Animations**: Elegant transitions and hover effects
- **Dark Mode Ready**: Professional appearance in any lighting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/skp3214/LiveCollaborativeEditor.git
   cd LiveCollaborativeEditor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Google AI API key:
   ```env
   VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
LiveCollaborativeEditor/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── TipTap.jsx    # Main editor component
│   │   ├── ChatSidebar.jsx       # AI chat interface
│   │   ├── FloatingToolbar.jsx   # Context toolbar
│   │   └── PreviewModal.jsx      # AI suggestion modal
│   ├── services/         # API services
│   │   └── aiService.js  # Google AI integration
│   ├── App.jsx          # Main application
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── .env.example         # Environment template
├── package.json         # Dependencies
└── vite.config.js      # Vite configuration
```

## 🛠️ Built With

- **[React](https://reactjs.org/)** - UI framework
- **[TipTap](https://tiptap.dev/)** - Rich text editor framework
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Google Generative AI](https://ai.google.dev/)** - AI content generation
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Vercel](https://vercel.com/)** - Deployment platform

## 🎯 Usage

### Basic Editing
1. Start typing in the editor
2. Use the toolbar for formatting options
3. Select text to access the floating toolbar
4. Right-click for additional context options

### AI Features
1. **Chat with AI**: Use the sidebar to ask questions about your content
2. **Text Enhancement**: Select text and choose AI actions from the floating toolbar
3. **Smart Suggestions**: Get AI recommendations for improving your writing
4. **Content Generation**: Ask AI to help create new content

### Keyboard Shortcuts
- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + U` - Underline
- `Ctrl/Cmd + Shift + S` - Strikethrough
- `Ctrl/Cmd + Shift + C` - Code
- `Ctrl/Cmd + Enter` - Insert line break

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Variables for Production
```env
VITE_GOOGLE_AI_API_KEY=your_production_api_key
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sachin Kumar Prajapati**
- GitHub: [@skp3214](https://github.com/skp3214)
- Portfolio: [Your Portfolio URL]

## 🙏 Acknowledgments

- [TipTap](https://tiptap.dev/) for the excellent rich text editor framework
- [Google AI](https://ai.google.dev/) for powerful AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for seamless deployment

---

<div align="center">
  <strong>⭐ Star this repository if you found it helpful!</strong>
</div>
