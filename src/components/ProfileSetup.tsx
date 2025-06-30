import React, { useState, useEffect } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { User, BookOpen, Eye, Volume2, FileText, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileSetupProps {
  onComplete: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [gradeLevel, setGradeLevel] = useState<number>(10);
  const [learningStyle, setLearningStyle] = useState<'visual' | 'audio' | 'text'>('text');
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>([]);
  const [examType, setExamType] = useState<string>('Boards');
  const [loading, setLoading] = useState(false);
  const { createProfile } = useProfile();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [parentSubjects, setParentSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedParentSubject, setSelectedParentSubject] = useState<string>('');

  const learningStyles = [
    {
      id: 'visual' as const,
      name: 'Visual Learner',
      description: 'I learn best with diagrams, charts, and visual aids',
      icon: <Eye size={24} />
    },
    {
      id: 'audio' as const,
      name: 'Audio Learner',
      description: 'I prefer listening to explanations and discussions',
      icon: <Volume2 size={24} />
    },
    {
      id: 'text' as const,
      name: 'Text Learner',
      description: 'I like reading and taking detailed notes',
      icon: <FileText size={24} />
    }
  ];

  const examTypes = [
    { id: 'Boards', name: 'School Boards (CBSE/ICSE/State)' },
    { id: 'NEET', name: 'NEET (Medical Entrance)' },
    { id: 'JEE', name: 'JEE (Engineering Entrance)' },
    { id: 'UPSC', name: 'UPSC (Civil Services)' },
  ];

  const handleSubjectToggle = (subjectId: string) => {
    setPreferredSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(s => s !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProfile({
        grade_level: gradeLevel,
        learning_style: learningStyle,
        preferred_subjects: [selectedSubject],
        exam_type: examType,
      });
      onComplete();
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects for selected class
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!gradeLevel) return;
      const { data } = await supabase
        .from('syllabus')
        .select('subject')
        .eq('class', gradeLevel.toString())
        .neq('subject', '')
        .order('subject', { ascending: true });
      if (data) {
        const uniqueSubjects = Array.from(new Set(data.map((row) => row.subject)));
        setSubjects(uniqueSubjects);
        setSelectedSubject('');
        setParentSubjects([]);
        setSelectedParentSubject('');
      }
    };
    fetchSubjects();
  }, [gradeLevel]);

  // Fetch parent_subjects for selected subject (if any)
  useEffect(() => {
    const fetchParentSubjects = async () => {
      if (!gradeLevel || !selectedSubject) return;
      const { data } = await supabase
        .from('syllabus')
        .select('parent_subject')
        .eq('class', gradeLevel.toString())
        .eq('subject', selectedSubject)
        .neq('parent_subject', null);
      if (data) {
        const uniqueParents = Array.from(new Set(data.map((row) => row.parent_subject).filter(Boolean)));
        setParentSubjects(uniqueParents);
        setSelectedParentSubject(uniqueParents.length === 1 ? uniqueParents[0] : '');
      } else {
        setParentSubjects([]);
        setSelectedParentSubject('');
      }
    };
    fetchParentSubjects();
  }, [gradeLevel, selectedSubject]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Let's Personalize Your Learning! 🎯
            </h1>
            <p className="text-gray-600">
              Tell us about yourself so we can create the perfect learning experience for you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Grade Level */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                What grade are you in? 📚
              </label>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    onClick={() => setGradeLevel(i + 1)}
                    className={`p-3 rounded-lg border-2 font-medium transition-all ${
                      gradeLevel === i + 1
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    Class {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Style */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                How do you learn best? 🧠
              </label>
              <div className="space-y-3">
                {learningStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setLearningStyle(style.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      learningStyle === style.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-4 ${
                        learningStyle === style.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {style.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          learningStyle === style.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {style.name}
                        </h3>
                        <p className={`text-sm ${
                          learningStyle === style.id ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {style.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Subjects */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Which subjects interest you most? (Select any) ✨
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(subject);
                      setSelectedParentSubject('');
                    }}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      preferredSubjects.includes(subject)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className={`font-semibold ${
                      preferredSubjects.includes(subject) ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {subject}
                    </h3>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Exam</label>
              <div className="flex flex-wrap gap-3">
                {examTypes.map((exam) => (
                  <button
                    type="button"
                    key={exam.id}
                    onClick={() => setExamType(exam.id)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${examType === exam.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    {exam.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Select Subject</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedParentSubject('');
                }}
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {parentSubjects.length > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Select Sub-Subject</label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={selectedParentSubject}
                  onChange={(e) => setSelectedParentSubject(e.target.value)}
                  required
                >
                  <option value="">-- Select Sub-Subject --</option>
                  {parentSubjects.map((ps) => (
                    <option key={ps} value={ps}>{ps}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              disabled={
                loading ||
                !gradeLevel ||
                !selectedSubject ||
                (parentSubjects.length > 0 && !selectedParentSubject)
              }
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;