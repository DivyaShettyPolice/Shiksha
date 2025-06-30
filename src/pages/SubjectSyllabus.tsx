import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../contexts/ProfileContext';

const SubjectSyllabus: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [parentSubjects, setParentSubjects] = useState<string[]>([]);
  const [selectedParentSubject, setSelectedParentSubject] = useState<string>('');
  // TODO: Integrate with real progress data
  const completedChapters: string[] = [];

  // Fetch parent_subjects for this subject/class
  useEffect(() => {
    const fetchParentSubjects = async () => {
      if (!profile?.grade_level || !subject) return;
      const { data } = await supabase
        .from('syllabus')
        .select('parent_subject')
        .eq('class', profile.grade_level.toString())
        .eq('subject', subject)
        .neq('parent_subject', null);
      if (data) {
        const uniqueParents = Array.from(new Set(data.map((row) => row.parent_subject).filter(Boolean)));
        setParentSubjects(uniqueParents);
        if (uniqueParents.length === 1) setSelectedParentSubject(uniqueParents[0]);
        else setSelectedParentSubject('');
      }
    };
    fetchParentSubjects();
  }, [profile?.grade_level, subject]);

  // Fetch chapters for subject/class/parent_subject
  useEffect(() => {
    const fetchChapters = async () => {
      if (!profile?.grade_level || !subject) return;
      let query = supabase
        .from('syllabus')
        .select('*')
        .eq('class', profile.grade_level.toString())
        .eq('subject', subject)
        .order('order', { ascending: true });
      if (parentSubjects.length > 0 && selectedParentSubject) {
        query = query.eq('parent_subject', selectedParentSubject);
      }
      const { data } = await query;
      if (data) setChapters(data);
    };
    fetchChapters();
  }, [profile?.grade_level, subject, parentSubjects, selectedParentSubject]);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <BookOpen className="mr-3 text-blue-600" size={32} />
          {subject} Syllabus
        </h1>
        {parentSubjects.length > 0 && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Select Sub-Subject</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={selectedParentSubject}
              onChange={e => setSelectedParentSubject(e.target.value)}
            >
              <option value="">-- Select Sub-Subject --</option>
              {parentSubjects.map(ps => (
                <option key={ps} value={ps}>{ps}</option>
              ))}
            </select>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {chapters.map((chapter) => (
            <div key={chapter.chapter_id} className="mb-4 border-b last:border-b-0">
              <button
                className="w-full flex items-center justify-between py-4 text-left focus:outline-none"
                onClick={() => setOpenChapter(openChapter === chapter.chapter_id ? null : chapter.chapter_id)}
              >
                <span className="font-semibold text-lg text-gray-900 flex items-center">
                  {completedChapters.includes(chapter.chapter_id) && (
                    <CheckCircle className="text-green-500 mr-2" size={20} />
                  )}
                  {chapter.chapter_name}
                </span>
                {openChapter === chapter.chapter_id ? (
                  <ChevronUp className="text-blue-600" size={24} />
                ) : (
                  <ChevronDown className="text-blue-600" size={24} />
                )}
              </button>
              {openChapter === chapter.chapter_id && (
                <div className="pl-6 pb-4">
                  <div className="mb-2 text-gray-700">Completion: {completedChapters.includes(chapter.chapter_id) ? 'Completed' : 'Not Started'}</div>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => navigate(`/chapter-onboarding/${subject}?chapter=${chapter.chapter_id}`)}
                  >
                    Start Learning
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectSyllabus; 