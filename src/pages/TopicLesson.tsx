import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { generateGroqCompletion } from '../lib/groq';
import { speakWithElevenLabs } from '../lib/elevenlabs';
import DoubtSolver from '../components/DoubtSolver';
import { Loader2, MessageCircle, Volume2 } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

const TopicLesson: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get('chapter');
  const topicIdx = Number(searchParams.get('topic') || 0);
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState('');
  const [flashcards, setFlashcards] = useState('');
  const [quiz, setQuiz] = useState('');
  const [showDoubtSolver, setShowDoubtSolver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { roadmaps, updateRoadmapProgress } = useProfile();

  // For demo, use mock topic name
  const topicName = `Topic ${topicIdx + 1}`;

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      // Generate explanation
      const explanationPrompt = `You are a friendly AI teacher. Explain the topic '${topicName}' in ${subject} (chapter: ${chapterId}) step-by-step for a high school student. Use analogies, emojis, and simple examples.`;
      const exp = await generateGroqCompletion(explanationPrompt);
      setExplanation(exp);
      // Generate flashcards
      const flashcardPrompt = `Create 3 flashcards for the topic '${topicName}' in ${subject}. Each flashcard should have a question and a short answer. Use simple language and emojis.`;
      setFlashcards(await generateGroqCompletion(flashcardPrompt));
      // Generate quiz
      const quizPrompt = `Create a mini quiz (3 MCQs) for the topic '${topicName}' in ${subject}. Each question should have 4 options and indicate the correct answer. Use simple language and emojis.`;
      setQuiz(await generateGroqCompletion(quizPrompt));
      setLoading(false);
    };
    fetchContent();
  }, [subject, chapterId, topicIdx, topicName]);

  const handleSpeak = async () => {
    setIsPlaying(true);
    try {
      await speakWithElevenLabs(explanation);
    } catch (e) {}
    setIsPlaying(false);
  };

  const handleMarkComplete = async () => {
    // Find the roadmap for this chapter
    const roadmap = roadmaps.find(r => r.roadmap_data && (r.roadmap_data.chapterId === chapterId || r.topic === chapterId));
    if (!roadmap) return;
    const completed = roadmap.progress?.completed || [];
    const topicKey = topicIdx;
    if (!completed.includes(topicKey)) {
      await updateRoadmapProgress(roadmap.id, { ...roadmap.progress, completed: [...completed, topicKey] });
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{topicName}</h1>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <>
            <div className="mb-6 bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-2">
                <span className="font-semibold text-blue-700 mr-2">AI Teacher:</span>
                <button
                  className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded flex items-center"
                  onClick={handleSpeak}
                  disabled={isPlaying}
                >
                  <Volume2 className="mr-1" size={18} /> Listen
                </button>
                <button
                  className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded flex items-center"
                  onClick={() => setShowDoubtSolver(true)}
                >
                  <MessageCircle className="mr-1" size={18} /> Ask Doubt
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-gray-900 whitespace-pre-line">{explanation}</div>
            </div>
            <div className="mb-6 bg-green-50 rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-2">Flashcards</h2>
              <div className="prose prose-sm max-w-none whitespace-pre-line">{flashcards}</div>
            </div>
            <div className="mb-6 bg-yellow-50 rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-2">Mini Quiz</h2>
              <div className="prose prose-sm max-w-none whitespace-pre-line">{quiz}</div>
            </div>
            {!loading && (
              <div className="flex justify-end mt-8">
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  onClick={handleMarkComplete}
                >
                  Mark as Complete
                </button>
              </div>
            )}
          </>
        )}
        {showDoubtSolver && (
          <DoubtSolver
            subject={subject || ''}
            topic={topicName}
            isOpen={showDoubtSolver}
            onClose={() => setShowDoubtSolver(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TopicLesson; 