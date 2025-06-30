import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { generateDynamicRoadmap } from '../lib/groq';
import { Lock, Unlock, Loader2 } from 'lucide-react';

const ChapterOnboarding: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get('chapter');
  const [hours, setHours] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [unlockedIdx, setUnlockedIdx] = useState(0);
  const navigate = useNavigate();

  // For demo, use chapter name as topic
  const chapterName = chapterId ? chapterId.replace(/\d+/, '').replace(/_/g, ' ') : 'Chapter';

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRoadmap([]);
    // For demo, use subject, chapterName, hours
    const roadmapData = await generateDynamicRoadmap({
      subject: subject || 'science',
      topic: chapterName,
      examType: 'Boards', // TODO: get from profile
      timeFrame: hours,
      timeUnit: 'days',
    });
    setRoadmap(Array.isArray(roadmapData) ? roadmapData : []);
    setUnlockedIdx(0);
    setLoading(false);
  };

  const handleStartLesson = (idx: number) => {
    // For now, just navigate to /learn/:subject?chapter=chapterId&topic=topicIdx
    navigate(`/learn/${subject}?chapter=${chapterId}&topic=${idx}`);
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Plan Your Learning for {chapterName}</h1>
        <form onSubmit={handleGenerateRoadmap} className="mb-8 flex items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How many hours do you want to spend on this chapter?</label>
            <input
              type="number"
              min={1}
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Generate Roadmap
          </button>
        </form>
        {roadmap.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Personalized Roadmap</h2>
            <div className="flex flex-col gap-4">
              {roadmap.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${idx <= unlockedIdx ? 'border-blue-600 bg-blue-100' : 'border-gray-300 bg-gray-100'}`}>
                    {idx < unlockedIdx ? <Unlock className="text-blue-600" /> : idx === unlockedIdx ? <Unlock className="text-green-600" /> : <Lock className="text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{step.title}</div>
                    <div className="text-gray-600 text-sm">{step.short_description || step.description}</div>
                    <div className="text-xs text-gray-500">Estimated time: {step.estimated_time || step.estimatedTime}</div>
                  </div>
                  {idx === unlockedIdx && (
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      onClick={() => handleStartLesson(idx)}
                    >
                      Start Lesson
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterOnboarding; 