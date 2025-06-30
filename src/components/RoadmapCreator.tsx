import React, { useState } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { Calendar, Clock, Target, BookOpen, ArrowRight, Zap, Brain } from 'lucide-react';
import { generateDynamicRoadmap } from '../lib/groq';

interface RoadmapCreatorProps {
  subject: string;
  onRoadmapCreated: (roadmapId: string) => void;
  onCancel: () => void;
}

const RoadmapCreator: React.FC<RoadmapCreatorProps> = ({ subject, onRoadmapCreated, onCancel }) => {
  const [topic, setTopic] = useState('');
  const [planType, setPlanType] = useState<'fast-track' | 'deep-learning'>('deep-learning');
  const [loading, setLoading] = useState(false);
  const { createRoadmap, profile } = useProfile();
  const [timeFrame, setTimeFrame] = useState<number>(5);
  const [timeUnit, setTimeUnit] = useState<'days' | 'weeks'>('days');
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null);

  const subjectNames: { [key: string]: string } = {
    math: 'Mathematics',
    science: 'Science',
    history: 'History'
  };

  const generateRoadmapData = (topic: string, planType: 'fast-track' | 'deep-learning') => {
    const roadmaps: { [key: string]: { [key: string]: any } } = {
      math: {
        'quadratic equations': {
          'fast-track': {
            duration: '2 days',
            subtopics: [
              {
                id: 1,
                title: 'Introduction to Quadratic Equations',
                description: 'Understanding the standard form ax² + bx + c = 0',
                estimatedTime: '30 minutes',
                activities: ['Watch intro video', 'Read basic concepts', 'Solve 5 simple problems']
              },
              {
                id: 2,
                title: 'Solving Methods',
                description: 'Factoring, quadratic formula, and completing the square',
                estimatedTime: '45 minutes',
                activities: ['Learn factoring method', 'Practice quadratic formula', 'Try completing square']
              },
              {
                id: 3,
                title: 'Applications & Practice',
                description: 'Real-world problems and exam-style questions',
                estimatedTime: '45 minutes',
                activities: ['Solve word problems', 'Take practice quiz', 'Review mistakes']
              }
            ]
          },
          'deep-learning': {
            duration: '5 days',
            subtopics: [
              {
                id: 1,
                title: 'Foundations of Quadratic Equations',
                description: 'Deep dive into the nature and properties',
                estimatedTime: '1 hour',
                activities: ['Understand polynomial degree', 'Explore parabolic graphs', 'Historical context']
              },
              {
                id: 2,
                title: 'Discriminant and Nature of Roots',
                description: 'Understanding b² - 4ac and its significance',
                estimatedTime: '1 hour',
                activities: ['Calculate discriminants', 'Predict root types', 'Graph analysis']
              },
              {
                id: 3,
                title: 'Multiple Solving Techniques',
                description: 'Master all methods with practice',
                estimatedTime: '1.5 hours',
                activities: ['Factoring mastery', 'Quadratic formula derivation', 'Completing square technique']
              },
              {
                id: 4,
                title: 'Advanced Applications',
                description: 'Complex problems and real-world scenarios',
                estimatedTime: '1 hour',
                activities: ['Physics applications', 'Optimization problems', 'Business scenarios']
              },
              {
                id: 5,
                title: 'Mastery Assessment',
                description: 'Comprehensive testing and review',
                estimatedTime: '45 minutes',
                activities: ['Full practice test', 'Error analysis', 'Concept reinforcement']
              }
            ]
          }
        },
        'pythagorean theorem': {
          'fast-track': {
            duration: '2 days',
            subtopics: [
              {
                id: 1,
                title: 'The Basic Theorem',
                description: 'Understanding a² + b² = c²',
                estimatedTime: '30 minutes',
                activities: ['Learn the formula', 'Identify right triangles', 'Basic calculations']
              },
              {
                id: 2,
                title: 'Pythagorean Triples',
                description: 'Common integer solutions',
                estimatedTime: '30 minutes',
                activities: ['Memorize common triples', 'Generate new triples', 'Pattern recognition']
              },
              {
                id: 3,
                title: 'Real-World Applications',
                description: 'Distance, construction, and navigation',
                estimatedTime: '60 minutes',
                activities: ['Distance problems', 'Construction examples', 'Practice quiz']
              }
            ]
          },
          'deep-learning': {
            duration: '5 days',
            subtopics: [
              {
                id: 1,
                title: 'Historical and Theoretical Foundation',
                description: 'Origins and mathematical proof',
                estimatedTime: '1 hour',
                activities: ['Historical context', 'Geometric proof', 'Algebraic proof']
              },
              {
                id: 2,
                title: 'Pythagorean Triples Deep Dive',
                description: 'Generation and properties',
                estimatedTime: '1 hour',
                activities: ['Triple generation formulas', 'Primitive vs non-primitive', 'Pattern analysis']
              },
              {
                id: 3,
                title: 'Coordinate Geometry Connection',
                description: 'Distance formula and applications',
                estimatedTime: '1 hour',
                activities: ['Derive distance formula', 'Coordinate problems', 'Circle equations']
              },
              {
                id: 4,
                title: 'Advanced Applications',
                description: 'Engineering, physics, and complex problems',
                estimatedTime: '1.5 hours',
                activities: ['Engineering applications', 'Physics problems', '3D extensions']
              },
              {
                id: 5,
                title: 'Mastery and Extensions',
                description: 'Advanced concepts and assessment',
                estimatedTime: '45 minutes',
                activities: ['Law of cosines connection', 'Comprehensive test', 'Concept mapping']
              }
            ]
          }
        }
      },
      science: {
        'photosynthesis': {
          'fast-track': {
            duration: '2 days',
            subtopics: [
              {
                id: 1,
                title: 'Basic Process Overview',
                description: 'What is photosynthesis and why is it important?',
                estimatedTime: '30 minutes',
                activities: ['Learn the equation', 'Identify inputs/outputs', 'Importance to life']
              },
              {
                id: 2,
                title: 'Where It Happens',
                description: 'Chloroplasts and chlorophyll',
                estimatedTime: '30 minutes',
                activities: ['Cell structure review', 'Chloroplast anatomy', 'Pigment functions']
              },
              {
                id: 3,
                title: 'Factors and Applications',
                description: 'What affects photosynthesis rate',
                estimatedTime: '60 minutes',
                activities: ['Limiting factors', 'Environmental impact', 'Practice quiz']
              }
            ]
          },
          'deep-learning': {
            duration: '5 days',
            subtopics: [
              {
                id: 1,
                title: 'Photosynthesis Fundamentals',
                description: 'Complete understanding of the process',
                estimatedTime: '1 hour',
                activities: ['Detailed equation analysis', 'Energy transformation', 'Evolutionary significance']
              },
              {
                id: 2,
                title: 'Light-Dependent Reactions',
                description: 'Photo phase in detail',
                estimatedTime: '1.5 hours',
                activities: ['Thylakoid structure', 'Electron transport chain', 'ATP and NADPH production']
              },
              {
                id: 3,
                title: 'Calvin Cycle (Light-Independent)',
                description: 'Bio phase mechanisms',
                estimatedTime: '1.5 hours',
                activities: ['Carbon fixation', 'Reduction phase', 'Regeneration of RuBP']
              },
              {
                id: 4,
                title: 'Environmental Factors',
                description: 'How environment affects photosynthesis',
                estimatedTime: '1 hour',
                activities: ['Light intensity effects', 'CO₂ concentration', 'Temperature optimization']
              },
              {
                id: 5,
                title: 'Global Impact and Assessment',
                description: 'Ecological importance and testing',
                estimatedTime: '1 hour',
                activities: ['Climate change connection', 'Food chain foundation', 'Comprehensive assessment']
              }
            ]
          }
        }
      },
      history: {
        'mughal empire': {
          'fast-track': {
            duration: '2 days',
            subtopics: [
              {
                id: 1,
                title: 'Empire Overview',
                description: 'Timeline and major rulers',
                estimatedTime: '45 minutes',
                activities: ['Timeline creation', 'Key rulers', 'Territory map']
              },
              {
                id: 2,
                title: 'Cultural Achievements',
                description: 'Architecture, art, and administration',
                estimatedTime: '45 minutes',
                activities: ['Famous monuments', 'Administrative system', 'Cultural synthesis']
              },
              {
                id: 3,
                title: 'Legacy and Impact',
                description: 'Influence on modern India',
                estimatedTime: '30 minutes',
                activities: ['Modern connections', 'Cultural legacy', 'Practice quiz']
              }
            ]
          },
          'deep-learning': {
            duration: '5 days',
            subtopics: [
              {
                id: 1,
                title: 'Foundation and Early Rulers',
                description: 'Babur to Akbar era',
                estimatedTime: '1.5 hours',
                activities: ['Babur\'s conquest', 'Humayun\'s struggles', 'Akbar\'s consolidation']
              },
              {
                id: 2,
                title: 'Golden Age Under Akbar',
                description: 'Administrative and cultural policies',
                estimatedTime: '1.5 hours',
                activities: ['Mansabdari system', 'Religious tolerance', 'Cultural synthesis']
              },
              {
                id: 3,
                title: 'Architectural Marvels',
                description: 'Shah Jahan\'s contributions',
                estimatedTime: '1 hour',
                activities: ['Taj Mahal study', 'Red Fort analysis', 'Architectural evolution']
              },
              {
                id: 4,
                title: 'Decline Under Aurangzeb',
                description: 'Policies and their consequences',
                estimatedTime: '1 hour',
                activities: ['Religious policies', 'Maratha resistance', 'Economic strain']
              },
              {
                id: 5,
                title: 'Legacy and Modern Impact',
                description: 'Lasting influence on India',
                estimatedTime: '1 hour',
                activities: ['Cultural heritage', 'Administrative influence', 'Comprehensive assessment']
              }
            ]
          }
        }
      }
    };

    const subjectData = roadmaps[subject.toLowerCase()] || {};
    const topicData = subjectData[topic.toLowerCase()] || {};
    const planData = topicData[planType];

    if (planData) {
      return planData;
    }

    // Generic roadmap for unknown topics
    const genericSubtopics = planType === 'fast-track' ? [
      {
        id: 1,
        title: `Introduction to ${topic}`,
        description: `Basic concepts and overview of ${topic}`,
        estimatedTime: '30 minutes',
        activities: ['Read introduction', 'Watch overview video', 'Take notes']
      },
      {
        id: 2,
        title: `Core Concepts`,
        description: `Main principles and theories of ${topic}`,
        estimatedTime: '45 minutes',
        activities: ['Study key concepts', 'Practice problems', 'Create summary']
      },
      {
        id: 3,
        title: `Applications and Practice`,
        description: `Real-world applications and practice exercises`,
        estimatedTime: '45 minutes',
        activities: ['Solve practice problems', 'Take quiz', 'Review and reinforce']
      }
    ] : [
      {
        id: 1,
        title: `Foundations of ${topic}`,
        description: `Deep understanding of fundamental concepts`,
        estimatedTime: '1 hour',
        activities: ['Comprehensive reading', 'Concept mapping', 'Historical context']
      },
      {
        id: 2,
        title: `Detailed Analysis`,
        description: `In-depth exploration of key principles`,
        estimatedTime: '1.5 hours',
        activities: ['Detailed study', 'Compare different approaches', 'Critical analysis']
      },
      {
        id: 3,
        title: `Advanced Applications`,
        description: `Complex problems and real-world scenarios`,
        estimatedTime: '1 hour',
        activities: ['Advanced problems', 'Case studies', 'Research connections']
      },
      {
        id: 4,
        title: `Connections and Extensions`,
        description: `Links to other topics and advanced concepts`,
        estimatedTime: '1 hour',
        activities: ['Cross-topic connections', 'Advanced extensions', 'Future applications']
      },
      {
        id: 5,
        title: `Mastery Assessment`,
        description: `Comprehensive evaluation and reinforcement`,
        estimatedTime: '45 minutes',
        activities: ['Comprehensive test', 'Self-assessment', 'Knowledge consolidation']
      }
    ];

    return {
      duration: planType === 'fast-track' ? '2 days' : '5 days',
      subtopics: genericSubtopics
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedRoadmap(null);
    try {
      const roadmap = await generateDynamicRoadmap({
        subject: subjectNames[subject] || subject,
        topic,
        examType: profile?.exam_type || 'Boards',
        timeFrame,
        timeUnit,
      });
      setGeneratedRoadmap(roadmap);
      await createRoadmap({
        subject,
        topic: topic.trim(),
        plan_type: planType,
        roadmap_data: roadmap,
        progress: { completed: [], current: 0 },
      });
      onRoadmapCreated('');
    } catch (error) {
      console.error('Error creating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Target className="text-blue-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">
          Create Learning Roadmap for {subjectNames[subject]}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            What topic would you like to master? 🎯
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={`Enter a ${subjectNames[subject].toLowerCase()} topic...`}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Examples: Quadratic Equations, Photosynthesis, Mughal Empire
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Choose your learning pace 🚀
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPlanType('fast-track')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                planType === 'fast-track'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <Zap className={`mr-2 ${planType === 'fast-track' ? 'text-orange-600' : 'text-gray-600'}`} size={20} />
                <h3 className={`font-semibold ${planType === 'fast-track' ? 'text-orange-900' : 'text-gray-900'}`}>
                  Fast-Track (2 Days)
                </h3>
              </div>
              <p className={`text-sm ${planType === 'fast-track' ? 'text-orange-700' : 'text-gray-600'}`}>
                Quick overview with essential concepts. Perfect for exam prep or quick revision.
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Clock size={14} className="mr-1" />
                ~2 hours total
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPlanType('deep-learning')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                planType === 'deep-learning'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <Brain className={`mr-2 ${planType === 'deep-learning' ? 'text-blue-600' : 'text-gray-600'}`} size={20} />
                <h3 className={`font-semibold ${planType === 'deep-learning' ? 'text-blue-900' : 'text-gray-900'}`}>
                  Deep Learning (5 Days)
                </h3>
              </div>
              <p className={`text-sm ${planType === 'deep-learning' ? 'text-blue-700' : 'text-gray-600'}`}>
                Comprehensive understanding with detailed explanations and advanced applications.
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Clock size={14} className="mr-1" />
                ~6 hours total
              </div>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">How much time do you want to spend on this topic?</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min={1}
              value={timeFrame}
              onChange={e => setTimeFrame(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={timeUnit}
              onChange={e => setTimeUnit(e.target.value as 'days' | 'weeks')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="days">days</option>
              <option value="weeks">weeks</option>
            </select>
          </div>
        </div>

        {profile && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Personalized for you:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📚 Grade Level: Class {profile.grade_level}</p>
              <p>🧠 Learning Style: {profile.learning_style.charAt(0).toUpperCase() + profile.learning_style.slice(1)}</p>
              <p>⭐ This roadmap will be customized to match your learning preferences!</p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Roadmap...
              </>
            ) : (
              <>
                Create My Roadmap
                <ArrowRight size={20} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>

      {generatedRoadmap && Array.isArray(generatedRoadmap) && (
        <div className="my-6">
          <h3 className="text-xl font-bold mb-4">Your Personalized Roadmap</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedRoadmap.map((step, idx) => (
              <div key={idx} className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 shadow-sm">
                <div className="font-semibold text-blue-700 mb-1">{step.title} <span className="text-xs text-gray-500">({step.estimated_time || step.estimatedTime})</span></div>
                <div className="text-gray-700 mb-2">{step.short_description || step.description}</div>
                <ul className="list-disc ml-5 text-sm text-blue-900">
                  {step.activities && step.activities.map((act: string, i: number) => <li key={i}>{act}</li>)}
                </ul>
                <div className="text-xs text-gray-500 mt-2">{step.day ? `Day ${step.day}` : step.week ? `Week ${step.week}` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapCreator;