import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface Progress {
  id: string;
  subject: string;
  topic: string;
  completed_at: string;
  quiz_score: number | null;
}

interface ProgressContextType {
  progress: Progress[];
  loading: boolean;
  addProgress: (subject: string, topic: string, quizScore?: number) => Promise<void>;
  getCompletedTopics: (subject: string) => string[];
  getQuizScore: (subject: string, topic: string) => number | null;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgress([]);
      setLoading(false);
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProgress = async (subject: string, topic: string, quizScore?: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('student_progress')
        .upsert({
          user_id: user.id,
          subject,
          topic,
          quiz_score: quizScore || null,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProgress(prev => [data, ...prev.filter(p => !(p.subject === subject && p.topic === topic))]);
      }
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  const getCompletedTopics = (subject: string) => {
    return progress
      .filter(p => p.subject === subject)
      .map(p => p.topic);
  };

  const getQuizScore = (subject: string, topic: string) => {
    const entry = progress.find(p => p.subject === subject && p.topic === topic);
    return entry?.quiz_score || null;
  };

  const value = {
    progress,
    loading,
    addProgress,
    getCompletedTopics,
    getQuizScore,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};