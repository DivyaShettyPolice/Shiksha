import React from 'react';
import { Github, Youtube, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Zap className="text-yellow-400" size={20} />
            <span className="text-sm">Built with Bolt.new</span>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>AI Teaching Assistant for Indian Students (Classes 6-12)</p>
            <p className="mt-1">Powered by Supabase, ElevenLabs & Netlify</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/your-username/ai-teaching-assistant" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              title="View on GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://youtube.com/watch?v=your-demo-video" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Watch Demo Video"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;