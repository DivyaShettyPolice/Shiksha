import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Brain, Headphones, Trophy, Users, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Brain className="text-blue-600" size={24} />,
      title: "AI-Powered Explanations",
      description: "Get structured, easy-to-understand explanations for any topic"
    },
    {
      icon: <BookOpen className="text-green-600" size={24} />,
      title: "Interactive Flashcards",
      description: "Create and study with AI-generated flashcards for better retention"
    },
    {
      icon: <Trophy className="text-yellow-600" size={24} />,
      title: "Smart Quizzes",
      description: "Test your knowledge with personalized MCQ quizzes"
    },
    {
      icon: <Headphones className="text-purple-600" size={24} />,
      title: "Audio Lessons",
      description: "Listen to lessons with natural-sounding AI voice"
    },
    {
      icon: <Users className="text-indigo-600" size={24} />,
      title: "Progress Tracking",
      description: "Monitor your learning journey across all subjects"
    },
    {
      icon: <Zap className="text-orange-600" size={24} />,
      title: "Built with Bolt.new",
      description: "Powered by cutting-edge AI technology"
    }
  ];

  const subjects = [
    { name: 'Mathematics', color: 'bg-blue-500', emoji: '📐' },
    { name: 'Science', color: 'bg-green-500', emoji: '🔬' },
    { name: 'History', color: 'bg-purple-500', emoji: '📚' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn Smarter with
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                AI Teaching Assistant
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Designed for Indian students (Classes 6-12). Get personalized explanations, 
              interactive flashcards, and smart quizzes for Math, Science, and History.
            </p>
            
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Go to Dashboard
                <BookOpen className="ml-2" size={20} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started Free
                <BookOpen className="ml-2" size={20} />
              </Link>
            )}
          </div>

          {/* Subject Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {subjects.map((subject) => (
              <div key={subject.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                  {subject.emoji}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Interactive lessons and AI-powered explanations
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform combines the best learning techniques with modern technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Indian students who are already learning smarter with AI
          </p>
          {!user && (
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Learning Today
              <BookOpen className="ml-2" size={20} />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;