import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Volume2, VolumeX, Brain, Zap, MessageCircle, Lightbulb } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useProfile } from '../contexts/ProfileContext';
import { useInteraction } from '../contexts/InteractionContext';
import DoubtSolver from '../components/DoubtSolver';
import { generateGroqCompletion, generatePersonalizedLesson } from '../lib/groq';
import { speakWithElevenLabs } from '../lib/elevenlabs';

const Learn: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDoubtSolver, setShowDoubtSolver] = useState(false);
  const [interactionStep, setInteractionStep] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [lesson, setLesson] = useState<any>(null);
  
  const { addProgress, getCompletedTopics } = useProgress();
  const { profile, getPersonalizedDifficulty } = useProfile();
  const { saveInteraction } = useInteraction();

  const subjectNames: { [key: string]: string } = {
    math: 'Mathematics',
    science: 'Science',
    history: 'History'
  };

  const completedTopics = getCompletedTopics(subject || '');

  const getPersonalizedGreeting = () => {
    if (!profile) return "Hello! Let's explore this topic together! 🌟";
    
    const greetings = [
      `Hey there, Class ${profile.grade_level} superstar! 🌟 Ready to dive into some amazing learning?`,
      `Welcome back! 🎉 As a ${profile.learning_style} learner, you're going to love this topic!`,
      `Hi! 👋 Let's make this topic crystal clear for you, Class ${profile.grade_level} style!`,
      `Great to see you! 🚀 Time to unlock some awesome knowledge together!`
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const getInteractiveQuestions = (topic: string, step: number) => {
    const questions: { [key: string]: string[] } = {
      'quadratic equations': [
        "Before we start, what do you already know about equations? Have you solved any before? 🤔",
        "Great! Now, have you ever seen a U-shaped curve? That's what quadratic equations create! What do you think makes them different from straight lines? 📈",
        "Excellent thinking! The 'squared' term (x²) is what creates that curve. Would you like to explore why this happens, or shall we move to solving them? 🎯"
      ],
      'photosynthesis': [
        "Let's start with something fun! 🌱 Have you ever wondered how plants 'eat'? What do you think they need to survive?",
        "Perfect! Plants are like nature's solar panels! ☀️ They use sunlight to make food. Have you noticed how plants always grow toward light? Why do you think that happens?",
        "Brilliant observation! That's because they need light for photosynthesis. Ready to discover the amazing chemistry behind this process? 🧪"
      ],
      'mughal empire': [
        "Welcome to an incredible journey through time! 🏰 When you think of beautiful buildings in India, which ones come to mind?",
        "The Taj Mahal is a perfect example! 💎 It was built by the Mughals. What do you think made the Mughal Empire so special and powerful?",
        "Excellent insights! The Mughals were master builders, administrators, and brought together different cultures. Ready to meet some fascinating emperors? 👑"
      ]
    };

    const defaultQuestions = [
      `Hi there! 👋 Before we explore ${topic}, what comes to your mind when you hear this term?`,
      `Interesting! Now, have you encountered anything related to ${topic} in your daily life or other subjects?`,
      `Great connection! Let's dive deeper into the fascinating world of ${topic}. Ready to discover something amazing? ✨`
    ];

    return questions[topic.toLowerCase()] || defaultQuestions;
  };

  const generatePersonalizedExplanation = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setLesson(null);
    setExplanation('');
    try {
      const difficulty = getPersonalizedDifficulty();
      const learningStyle = profile?.learning_style || 'text';
      const gradeLevel = profile?.grade_level || 10;
      const lessonData = await generatePersonalizedLesson({
        topic,
        subject: subjectNames[subject || 'math'],
        gradeLevel,
        learningStyle,
        difficulty
      });
      setLesson(lessonData);
      setExplanation(lessonData.explanations.join('\n\n'));
    } catch (error) {
      setExplanation('Sorry, I could not generate an explanation at this time.');
    }
    setLoading(false);
  };

  const handleInteractionResponse = async (response: string) => {
    const newResponses = [...userResponses, response];
    setUserResponses(newResponses);
    setCurrentResponse('');

    // Save interaction
    await saveInteraction({
      subject: subject || '',
      topic,
      interaction_type: 'answer',
      content: response,
      context: { step: interactionStep, question: getInteractiveQuestions(topic, interactionStep)[interactionStep] }
    });

    // Move to next interaction step
    if (interactionStep < 2) {
      setInteractionStep(prev => prev + 1);
    }
  };

  const speakExplanation = async () => {
    if (!explanation) return;
    setIsPlaying(true);
    try {
      await speakWithElevenLabs(explanation);
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
    }
    setIsPlaying(false);
  };

  const stopSpeaking = () => {
    const audios = document.getElementsByTagName('audio');
    for (let audio of audios) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const interactiveQuestions = getInteractiveQuestions(topic, interactionStep);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            to="/dashboard"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Learn {subjectNames[subject || 'math']}
            </h1>
            <p className="text-gray-600 mt-1">
              Interactive AI-powered learning experience
            </p>
          </div>
        </div>

        {/* Personalized Learning Info */}
        {profile && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Personalized for Class {profile.grade_level}</span> • 
                  <span className="capitalize ml-1">{profile.learning_style} Learning Style</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Content difficulty: {getPersonalizedDifficulty().charAt(0).toUpperCase() + getPersonalizedDifficulty().slice(1)}
                </p>
              </div>
              <div className="text-2xl">
                {profile.learning_style === 'visual' ? '👁️' : 
                 profile.learning_style === 'audio' ? '🎧' : '📝'}
              </div>
            </div>
          </div>
        )}

        {/* Topic Input */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Brain className="text-blue-600 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">What would you like to learn?</h2>
          </div>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`Enter a ${subjectNames[subject || 'math'].toLowerCase()} topic...`}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && generatePersonalizedExplanation()}
            />
            <button
              onClick={generatePersonalizedExplanation}
              disabled={loading || !topic.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Zap size={20} className="mr-2" />
                  Learn
                </>
              )}
            </button>
          </div>

          {/* Completed Topics */}
          {completedTopics.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recently Completed Topics:</h3>
              <div className="flex flex-wrap gap-2">
                {completedTopics.slice(0, 5).map((completedTopic, index) => (
                  <button
                    key={index}
                    onClick={() => setTopic(completedTopic)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                  >
                    {completedTopic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lesson Display */}
        {lesson && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Lesson Outline</h2>
            <ol className="list-decimal ml-6 mb-6">
              {lesson.outline.map((section: string, idx: number) => (
                <li key={idx} className="mb-2 font-semibold">{section}</li>
              ))}
            </ol>
            <h3 className="text-xl font-semibold mb-2">Explanations</h3>
            {lesson.explanations.map((exp: string, idx: number) => (
              <div key={idx} className="mb-4 p-4 bg-blue-50 rounded">
                <div className="font-semibold mb-1">{lesson.outline[idx]}</div>
                <div className="prose prose-sm max-w-none">{exp.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
              </div>
            ))}
            <h3 className="text-xl font-semibold mb-2 mt-6">Flashcards</h3>
            <div className="mb-4 p-4 bg-green-50 rounded">
              <div className="prose prose-sm max-w-none">{lesson.flashcards.split('\n').map((line: string, i: number) => <p key={i}>{line}</p>)}</div>
            </div>
            <h3 className="text-xl font-semibold mb-2 mt-6">Quiz</h3>
            <div className="mb-4 p-4 bg-yellow-50 rounded">
              <div className="prose prose-sm max-w-none">{lesson.quiz.split('\n').map((line: string, i: number) => <p key={i}>{line}</p>)}</div>
            </div>
          </div>
        )}

        {/* Interactive Questions */}
        {topic && !loading && interactionStep < 3 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <Lightbulb className="text-purple-600 mr-2" size={24} />
              <h3 className="text-lg font-semibold text-purple-900">Let's Start Interactive! 🤖</h3>
            </div>
            
            <p className="text-purple-800 mb-4">{interactiveQuestions[interactionStep]}</p>
            
            <div className="flex gap-4">
              <input
                type="text"
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && currentResponse.trim() && handleInteractionResponse(currentResponse)}
              />
              <button
                onClick={() => handleInteractionResponse(currentResponse)}
                disabled={!currentResponse.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                Share
              </button>
            </div>
            
            {userResponses.length > 0 && (
              <div className="mt-4 space-y-2">
                {userResponses.map((response, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-purple-200">
                    <p className="text-sm text-gray-600">Your response {index + 1}:</p>
                    <p className="text-purple-800">{response}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Explanation Display */}
        {explanation && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{topic}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDoubtSolver(true)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Ask Doubt
                </button>
                <button
                  onClick={isPlaying ? stopSpeaking : speakExplanation}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
                    isPlaying 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX size={20} className="mr-2" />
                      Stop Audio
                    </>
                  ) : (
                    <>
                      <Volume2 size={20} className="mr-2" />
                      Listen
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {explanation.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-gray-900">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-semibold mt-5 mb-3 text-gray-800">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-700">{line.substring(4)}</h3>;
                } else if (line.startsWith('#### ')) {
                  return <h4 key={index} className="text-base font-medium mt-3 mb-2 text-gray-600">{line.substring(5)}</h4>;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="font-bold text-gray-900 my-2">{line.slice(2, -2)}</p>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4 my-1 text-gray-700">{line.substring(2)}</li>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index} className="my-2 text-gray-700 leading-relaxed">{line}</p>;
                }
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <Link
                to={`/flashcards/${subject}/${encodeURIComponent(topic)}`}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-center flex items-center justify-center"
              >
                <BookOpen size={20} className="mr-2" />
                Create Flashcards
              </Link>
              <Link
                to={`/quiz/${subject}/${encodeURIComponent(topic)}`}
                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium text-center flex items-center justify-center"
              >
                <Brain size={20} className="mr-2" />
                Take Quiz
              </Link>
            </div>
          </div>
        )}

        {/* Doubt Solver Modal */}
        <DoubtSolver
          subject={subject || ''}
          topic={topic}
          isOpen={showDoubtSolver}
          onClose={() => setShowDoubtSolver(false)}
        />
      </div>
    </div>
  );
};

export default Learn;