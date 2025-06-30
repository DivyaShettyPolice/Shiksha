import React, { useState, useEffect } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { User, BookOpen, Eye, Volume2, FileText, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LEARNING_STYLES, EXAM_TYPES, GRADE_LEVELS, getLearningStylesList, getExamTypesList } from '../lib/constants';

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

  const learningStyles = getLearningStylesList();
  const examTypes = getExamTypesList();

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
        preferred_subjects: selectedSubject ? [selectedSubject] : [],
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
      try {
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
      } catch (error) {
        console.error('Error fetching subjects:', error);
        // Fallback subjects
        setSubjects(['Mathematics', 'Science', 'History']);
      }
    };
    fetchSubjects();
  }, [gradeLevel]);

  // Fetch parent_subjects for selected subject (if any)
  useEffect(() => {
    const fetchParentSubjects = async () => {
      if (!gradeLevel || !selectedSubject) return;
      try {
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
      } catch (error) {
        console.error('Error fetching parent subjects:', error);
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
                {GRADE_LEVELS.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setGradeLevel(grade)}
                    className={`p-3 rounded-lg border-2 font-medium transition-all ${
                      gradeLevel === grade
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    Class {grade}
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
                      <div className={`p-2 rounded-lg mr-4 text-2xl ${
                        learningStyle === style.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {style.emoji}
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

            {/* Target Exam */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                What's your target exam? 🎯
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examTypes.map((exam) => (
                  <button
                    type="button"
                    key={exam.id}
                    onClick={() => setExamType(exam.id)}
                    className={`p-4 rounded-lg border-2 text-left font-medium transition-all ${
                      examType === exam.id 
                        ? 'border-green-500 bg-green-50 text-green-900' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {exam.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selection */}
            {subjects.length > 0 && (
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Which subject interests you most? ✨
                </label>
                <div className="mb-4">
                  <select
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Sub-Subject</label>
                    <select
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
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