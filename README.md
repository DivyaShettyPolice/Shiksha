# AI Teaching Assistant

An AI-powered learning platform designed specifically for Indian students (Classes 6-12). Get personalized explanations, interactive flashcards, and smart quizzes for Mathematics, Science, and History.

## Features

- 🤖 **AI-Powered Explanations**: Get structured, easy-to-understand explanations for any topic
- 📚 **Interactive Flashcards**: Create and study with AI-generated flashcards for better retention
- 🏆 **Smart Quizzes**: Test your knowledge with personalized MCQ quizzes
- 🎧 **Audio Lessons**: Listen to lessons with natural-sounding AI voice
- 📊 **Progress Tracking**: Monitor your learning journey across all subjects
- 🎯 **Personalized Learning**: Adaptive content based on your grade level and learning style
- 🗺️ **Learning Roadmaps**: Create structured learning paths for any topic

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **AI Services**: Groq API (Text Generation), ElevenLabs (Text-to-Speech)
- **Build Tool**: Vite
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- (Optional) Groq API key for enhanced AI features
- (Optional) ElevenLabs API key for text-to-speech

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-teaching-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Required - Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Optional - AI Services (for enhanced features)
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in the `supabase/migrations/` folder
   - Enable Row Level Security (RLS) on all tables
   - Update your environment variables with the project URL and anon key

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Database Schema

The application uses the following main tables:

- `student_profiles` - User learning preferences and settings
- `student_progress` - Track completed topics and quiz scores
- `learning_roadmaps` - Custom learning paths created by users
- `student_interactions` - Store AI conversations and doubts
- `syllabus` - Course structure and chapter organization

## API Integration

### Groq API (Optional)
Used for generating AI explanations, lessons, and roadmaps. If not configured, the app falls back to predefined content.

### ElevenLabs API (Optional)
Provides high-quality text-to-speech for audio lessons. Falls back to browser speech synthesis if not available.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── lib/               # Utility functions and API clients
├── pages/             # Route components
└── types/             # TypeScript type definitions
```

## Key Features Explained

### Personalized Learning
- Adapts content difficulty based on grade level
- Customizes explanations for visual, audio, or text learners
- Tracks progress and suggests next topics

### AI Doubt Solver
- Students can ask questions about any topic
- AI provides contextual, grade-appropriate answers
- Supports voice input and audio responses

### Learning Roadmaps
- Create structured study plans for any topic
- Choose between fast-track (2 days) or deep learning (5 days)
- Track progress through interactive checklists

### Progress Analytics
- Visual charts showing quiz performance trends
- Learning streaks and time spent tracking
- Subject-wise completion statistics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aiteachingassistant.com or join our Discord community.

## Acknowledgments

- Built with [Bolt.new](https://bolt.new) - AI-powered development platform
- Powered by [Supabase](https://supabase.com) for backend infrastructure
- AI capabilities by [Groq](https://groq.com) and [ElevenLabs](https://elevenlabs.io)
- Deployed on [Netlify](https://netlify.com)