import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { useProfile } from '../contexts/ProfileContext';
import { BookOpen, Brain, Trophy, Clock, TrendingUp, Target, Plus, Calendar, BarChart3 } from 'lucide-react';
import ProfileSetup from '../components/ProfileSetup';
import RoadmapCreator from '../components/RoadmapCreator';
import ProgressDashboard from '../components/ProgressDashboard';
import { SUBJECTS, getSubjectsList } from '../lib/constants';

const Dashboard: React.FC = () => {
  const { progress, loading: progressLoading } = useProgress();
  const { profile, roadmaps, loading: profileLoading, updateRoadmapProgress } = useProfile();
  const [showRoadmapCreator, setShowRoadmapCreator] = useState<string | null>(null);
  const navigate = useNavigate();

  const subjects = getSubjectsList();

  const getSubjectStats = (subjectSlug: string) => {
    const subjectProgress = progress.filter(p => p.subject === subjectSlug);
    const completed = subjectProgress.length;
    const avgScore = subjectProgress.length > 0 
      ? subjectProgress.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / subjectProgress.length
      : 0;
    
    return { completed, avgScore };
  };

  const totalCompleted = progress.length;
  const totalAvgScore = progress.length > 0 
    ? progress.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / progress.length
    : 0;

  const getActiveRoadmaps = () => {
    return roadmaps.filter(roadmap => {
      const completedSubtopics = roadmap.progress?.completed || [];
      const totalSubtopics = roadmap.roadmap_data?.subtopics?.length || 0;
      return completedSubtopics.length < totalSubtopics;
    });
  };

  const getRecentScores = () => {
    return progress
      .filter(p => p.quiz_score !== null)
      .slice(0, 7)
      .reverse()
      .map(p => p.quiz_score || 0);
  };

  const getRecommendedTopic = () => {
    if (!profile || progress.length === 0) return null;
    
    const subjectCounts = subjects.reduce((acc, subject) => {
      acc[subject.slug] = progress.filter(p => p.subject === subject.slug).length;
      return acc;
    }, {} as { [key: string]: number });

    const leastStudiedSubject = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => a - b)[0][0];

    const subjectName = subjects.find(s => s.slug === leastStudiedSubject)?.name || 'Mathematics';
    
    const recommendations: { [key: string]: string[] } = {
      mathematics: ['Linear Equations', 'Coordinate Geometry', 'Statistics', 'Probability'],
      science: ['Acids and Bases', 'Light and Reflection', 'Heredity and Evolution', 'Carbon Compounds'],
      history: ['French Revolution', 'Nationalism in Europe', 'Forest Society', 'Age of Industrialization']
    };

    const topics = recommendations[leastStudiedSubject] || recommendations.mathematics;
    return {
      subject: leastStudiedSubject,
      subjectName,
      topic: topics[Math.floor(Math.random() * topics.length)]
    };
  };

  const handleSubtopicComplete = async (roadmapId: string, subtopicId: any) => {
    const roadmap = roadmaps.find(r => r.id === roadmapId);
    if (!roadmap) return;
    const completed = roadmap.progress?.completed || [];
    if (!completed.includes(subtopicId)) {
      const newCompleted = [...completed, subtopicId];
      await updateRoadmapProgress(roadmapId, { ...roadmap.progress, completed: newCompleted });
    }
  };

  if (profileLoading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show profile setup if no profile exists
  if (!profile) {
    return <ProfileSetup onComplete={() => window.location.reload()} />;
  }

  const activeRoadmaps = getActiveRoadmaps();
  const recentScores = getRecentScores();
  const recommendedTopic = getRecommendedTopic();

  // Calculate progress data for ProgressDashboard
  const allSubtopics = roadmaps.flatMap(r => Array.isArray(r.roadmap_data) ? r.roadmap_data : r.roadmap_data?.subtopics || []);
  const completedTopics = roadmaps.reduce((sum, r) => sum + (r.progress?.completed?.length || 0), 0);
  const totalTopics = allSubtopics.length;
  const quizScores = progress.map(p => p.quiz_score || 0).slice(-7); // last 7 quizzes
  const timeSpent = [
    { date: '2024-07-01', minutes: 30 },
    { date: '2024-07-02', minutes: 45 },
    { date: '2024-07-03', minutes: 20 },
    { date: '2024-07-04', minutes: 60 },
    { date: '2024-07-05', minutes: 40 },
  ]; // TODO: Replace with real data
  const estimatedCompletion = '2024-07-20'; // TODO: Calculate based on pace
  const streak = 3; // TODO: Calculate real streak

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Personalized Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700">
                  <span className="font-semibold">Class {profile.grade_level}</span> • 
                  <span className="capitalize ml-1">{profile.learning_style} Learner</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Ready to continue your learning journey? 🚀
                </p>
              </div>
              <div className="text-4xl">
                {profile.learning_style === 'visual' ? '👁️' : 
                 profile.learning_style === 'audio' ? '🎧' : '📝'}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Topic */}
        {recommendedTopic && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <Brain className="mr-2" size={24} />
                    Recommended for You
                  </h2>
                  <p className="text-purple-100 mb-3">
                    Based on your learning pattern, we suggest exploring:
                  </p>
                  <p className="text-lg font-medium">
                    {recommendedTopic.topic} in {recommendedTopic.subjectName}
                  </p>
                </div>
                <Link
                  to={`/learn/${recommendedTopic.subject}`}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Active Roadmaps */}
        {activeRoadmaps.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="mr-2 text-blue-600" size={24} />
              Your Active Learning Roadmaps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRoadmaps.map((roadmap) => {
                const completedSubtopics = roadmap.progress?.completed || [];
                const subtopics = Array.isArray(roadmap.roadmap_data) ? roadmap.roadmap_data : roadmap.roadmap_data?.subtopics || [];
                const totalSubtopics = subtopics.length;
                const progressPercent = totalSubtopics > 0 ? (completedSubtopics.length / totalSubtopics) * 100 : 0;
                return (
                  <div key={roadmap.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 capitalize">{roadmap.topic}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        roadmap.plan_type === 'fast-track' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {roadmap.plan_type === 'fast-track' ? '⚡ Fast-Track' : '🧠 Deep Learning'}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{completedSubtopics.length} of {totalSubtopics} subtopics completed</div>
                      <ul className="space-y-2">
                        {subtopics.slice(0, 3).map((sub: any, idx: number) => (
                          <li key={sub.id || idx} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={completedSubtopics.includes(sub.id || idx)}
                              onChange={() => handleSubtopicComplete(roadmap.id, sub.id || idx)}
                              className="accent-blue-600"
                            />
                            <span className={completedSubtopics.includes(sub.id || idx) ? 'line-through text-gray-400' : ''}>
                              {sub.title || sub.name}
                            </span>
                          </li>
                        ))}
                        {subtopics.length > 3 && (
                          <li className="text-xs text-gray-500">
                            +{subtopics.length - 3} more topics
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Topics Completed</p>
                <p className="text-2xl font-bold text-gray-900">{totalCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Trophy className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{totalAvgScore.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Brain className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Roadmaps</p>
                <p className="text-2xl font-bold text-gray-900">{activeRoadmaps.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Learning Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        {recentScores.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="mr-2 text-blue-600" size={24} />
                Your Quiz Performance Trend
              </h2>
              <div className="flex items-end space-x-2 h-32">
                {recentScores.map((score, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t transition-all duration-500 ${
                        score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${(score / 100) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-1">{score}%</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                Last {recentScores.length} quiz scores • Keep up the great work! 🎉
              </p>
            </div>
          </div>
        )}

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subjects.map((subject) => {
            const stats = getSubjectStats(subject.slug);
            
            return (
              <div key={subject.slug} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`${subject.lightColor} p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 ${subject.color} rounded-xl flex items-center justify-center text-white text-3xl`}>
                      {subject.emoji}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${subject.textColor}`}>
                        {stats.completed} topics completed
                      </p>
                      <p className="text-xs text-gray-500">
                        Avg: {stats.avgScore.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/learn/${subject.slug}`}
                      className={`flex-1 ${subject.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium text-center flex items-center justify-center`}
                    >
                      <BookOpen className="mr-1" size={16} />
                      Learn
                    </Link>
                    <button
                      onClick={() => setShowRoadmapCreator(subject.slug)}
                      className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                {stats.completed > 0 && (
                  <div className="p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                    <div className="space-y-2">
                      {progress
                        .filter(p => p.subject === subject.slug)
                        .slice(0, 2)
                        .map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 truncate">{item.topic}</span>
                            <span className={`font-medium ${subject.textColor}`}>
                              {item.quiz_score || 0}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Activity Section */}
        {progress.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Learning Activity</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Topic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {progress.slice(0, 5).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {item.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.topic}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (item.quiz_score || 0) >= 80 ? 'bg-green-100 text-green-800' :
                            (item.quiz_score || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.quiz_score || 0}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock size={14} className="text-gray-400 mr-1" />
                            {new Date(item.completed_at).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Roadmap Creator Modal */}
        {showRoadmapCreator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-w-2xl w-full">
              <RoadmapCreator
                subject={showRoadmapCreator}
                onRoadmapCreated={() => {
                  setShowRoadmapCreator(null);
                  window.location.reload();
                }}
                onCancel={() => setShowRoadmapCreator(null)}
              />
            </div>
          </div>
        )}

        {/* Progress Dashboard */}
        <ProgressDashboard
          completedTopics={completedTopics}
          totalTopics={totalTopics}
          quizScores={quizScores}
          timeSpent={timeSpent}
          estimatedCompletion={estimatedCompletion}
          streak={streak}
        />
      </div>
    </div>
  );
};

export default Dashboard;