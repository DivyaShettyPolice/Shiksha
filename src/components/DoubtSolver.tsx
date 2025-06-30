import React, { useState } from 'react';
import { useInteraction } from '../contexts/InteractionContext';
import { MessageCircle, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { generateGroqCompletion } from '../lib/groq';
import { speakWithElevenLabs } from '../lib/elevenlabs';

interface DoubtSolverProps {
  subject: string;
  topic: string;
  subtopic?: string;
  isOpen: boolean;
  onClose: () => void;
}

const DoubtSolver: React.FC<DoubtSolverProps> = ({ subject, topic, subtopic, isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { askDoubt, loading } = useInteraction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setResponse('');
    try {
      // Compose a prompt with context
      const prompt = `Student Profile:\n- Grade: ${subject}\n- Topic: ${topic}${subtopic ? `\n- Subtopic: ${subtopic}` : ''}\n\nQuestion: ${question}\n\nAnswer as a friendly, engaging AI teacher for Indian students (Classes 6-12). Use analogies, emojis, and simple examples.`;
      setResponse('');
      const aiResponse = await generateGroqCompletion(prompt);
      setResponse(aiResponse);
    } catch (error) {
      console.error('Error asking doubt:', error);
      setResponse('Sorry, I encountered an error while processing your question. Please try again.');
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const speakResponse = async () => {
    if (!response) return;
    setIsPlaying(true);
    try {
      await speakWithElevenLabs(response);
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
    }
    setIsPlaying(false);
  };

  const stopSpeaking = () => {
    // ElevenLabs audio is played via Audio object, so we can just pause all audio
    const audios = document.getElementsByTagName('audio');
    for (let audio of audios) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle size={24} className="mr-3" />
              <div>
                <h2 className="text-xl font-semibold">AI Doubt Solver 🤖</h2>
                <p className="text-blue-100 text-sm">
                  Ask me anything about {topic} {subtopic && `(${subtopic})`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                What's your doubt? 🤔
              </label>
              <div className="relative">
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here... or use the mic button to speak!"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  rows={3}
                  required
                />
                <button
                  type="button"
                  onClick={startListening}
                  disabled={isListening}
                  className={`absolute right-3 top-3 p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isListening ? 'Listening...' : 'Click to speak'}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>
              {isListening && (
                <p className="text-sm text-red-600 mt-1 animate-pulse">
                  🎤 Listening... Speak your question clearly
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  AI is thinking...
                </>
              ) : (
                <>
                  Get Answer
                  <Send size={20} className="ml-2" />
                </>
              )}
            </button>
          </form>

          {response && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900 flex items-center">
                  <MessageCircle size={18} className="mr-2" />
                  AI Teacher's Response
                </h3>
                <button
                  onClick={isPlaying ? stopSpeaking : speakResponse}
                  className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center transition-colors ${
                    isPlaying 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX size={16} className="mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Volume2 size={16} className="mr-1" />
                      Listen
                    </>
                  )}
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-blue-800">
                {response.split('\n').map((line, index) => {
                  if (line.trim() === '') return <br key={index} />;
                  return <p key={index} className="mb-2">{line}</p>;
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            💡 Tip: Be specific with your questions for better answers. You can ask "Why?", "How?", or "Can you explain with an example?"
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoubtSolver;