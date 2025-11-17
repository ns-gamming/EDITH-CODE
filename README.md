# EDITH - Enhanced Development Interface for Technology and Hacking

<div align="center">

![EDITH Banner](https://img.shields.io/badge/EDITH-AI%20Powered%20IDE-00D9FF?style=for-the-badge)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.20-646CFF?logo=vite)](https://vitejs.dev/)

**Even Dead, I Am The Hero**

A next-generation AI-powered IDE with stunning 3D fluid effects, real-time collaboration, and intelligent code generation.

</div>

---

## ✨ Features

### 🎨 Beautiful 3D Fluid Interface
- **Immersive 3D Backgrounds**: Interactive fluid particle systems that respond to your mouse
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Dark/Light Themes**: Fully customizable themes with smooth transitions
- **Responsive Design**: Works flawlessly on desktop, tablet, and mobile devices

### 🤖 AI-Powered Development
- **Smart Code Generation**: Generate complete projects from natural language prompts
- **Multiple AI Models**: Support for Gemini AI models
- **Context-Aware Suggestions**: AI understands your codebase and provides relevant suggestions
- **Code Analysis**: Instant code reviews and optimization suggestions

### 💻 Professional IDE Features
- **Monaco Editor**: The same editor that powers VS Code
- **Multi-File Support**: Work with multiple files simultaneously with tabs
- **Syntax Highlighting**: Support for 20+ programming languages
- **Live Preview**: Real-time preview for HTML/CSS/JavaScript projects
- **Advanced Terminal**: Built-in terminal with multi-language execution support
- **Auto-Save**: Your work is automatically saved to the cloud

### 🔄 GitHub Integration
- **Import Repositories**: Clone any public GitHub repository with one click
- **Project Templates**: Start from pre-built templates or create from scratch

### 📁 Project Management
- **Cloud Storage**: All projects stored securely in Supabase
- **Project Dashboard**: Organize and manage all your projects in one place
- **User Profiles**: Customize your profile with avatar, bio, and social links

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- Supabase account (for backend services)
- Gemini API key (optional - users can provide their own)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd edith
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file or add to Replit Secrets:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI API Keys (Optional)
   GEMINI_API_KEY=your_gemini_api_key
   
   # Encryption Key for storing user API keys
   ENCRYPTION_KEY=your_32_character_encryption_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## 📖 Usage

### Creating a New Project

1. **Blank Project**: Start from scratch with an empty project
2. **AI Generator**: Describe your project and let AI generate the initial code
3. **GitHub Import**: Import any public GitHub repository

### Using the AI Assistant

1. Open any project in the IDE
2. Click the AI chat panel
3. Select your AI model
4. Ask questions or request code generation
5. Get intelligent, context-aware responses

### Working with Files

- **Create**: Click the + icon in the file tree
- **Edit**: Click any file to open it in Monaco editor
- **Delete**: Use the file tree context menu
- **Auto-save**: Files save automatically as you type

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Monaco Editor** - Code editor
- **XTerm.js** - Terminal emulator

### Backend
- **Node.js** - Runtime
- **Express** - Web server
- **Supabase** - Database & Auth
- **PostgreSQL** - Database
- **Drizzle ORM** - Database queries

### AI Integration
- **Google Gemini** - AI code generation
- **Custom prompts** - Optimized for coding tasks

---

## 🏗️ Project Structure

```
edith/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── server/                # Backend Express server
│   ├── lib/              # Server utilities
│   ├── routes.ts         # API routes
│   └── index.ts          # Entry point
├── shared/               # Shared types
│   └── schema.ts         # Database schema
└── package.json          # Dependencies
```

---

## 🔒 Security

- **Encrypted API Keys**: AES-256 encryption for user API keys
- **Supabase Auth**: Secure authentication with JWT
- **Row Level Security**: Database access control
- **HTTPS**: All traffic encrypted in production

---

## 🌟 Features Coming Soon

- Real-time collaboration
- Git integration
- Plugin system
- Mobile apps
- Voice-to-code
- Deployment integration

---

## 📜 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

**NISHANT SARKAR**

Created with 💙 using cutting-edge technologies

---

## 🙏 Acknowledgments

- Monaco Editor team
- Supabase team
- Google Gemini
- Open-source community

---

<div align="center">

**EDITH** - Even Dead, I Am The Hero

Made with ❤️ by developers, for developers

</div>
