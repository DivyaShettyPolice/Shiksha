import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface StudentProfile {
  id: string;
  user_id: string;
  grade_level: number;
  learning_style: 'visual' | 'audio' | 'text';
  preferred_subjects: string[];
  exam_type?: string; // 'NEET' | 'JEE' | 'UPSC' | 'Boards'
  created_at: string;
  updated_at: string;
}

interface LearningRoadmap {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  plan_type: 'fast-track' | 'deep-learning';
  roadmap_data: any;
  progress: any;
  created_at: string;
  updated_at: string;
}

interface ProfileContextType {
  profile: StudentProfile | null;
  roadmaps: LearningRoadmap[];
  loading: boolean;
  createProfile: (data: Omit<StudentProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProfile: (data: Partial<StudentProfile>) => Promise<void>;
  createRoadmap: (data: Omit<LearningRoadmap, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRoadmapProgress: (roadmapId: string, progress: any) => Promise<void>;
  getPersonalizedDifficulty: () => string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchRoadmaps();
    } else {
      setProfile(null);
      setRoadmaps([]);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchRoadmaps = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('learning_roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoadmaps(data || []);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (data: Omit<StudentProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data: newProfile, error } = await supabase
        .from('student_profiles')
        .insert({
          user_id: user.id,
          ...data,
          exam_type: data.exam_type || 'Boards',
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(newProfile);
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<StudentProfile>) => {
    if (!user || !profile) return;

    try {
      const { data: updatedProfile, error } = await supabase
        .from('student_profiles')
        .update({ ...data, exam_type: data.exam_type || profile.exam_type || 'Boards' })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const createRoadmap = async (data: Omit<LearningRoadmap, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data: newRoadmap, error } = await supabase
        .from('learning_roadmaps')
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      setRoadmaps(prev => [newRoadmap, ...prev]);
    } catch (error) {
      console.error('Error creating roadmap:', error);
      throw error;
    }
  };

  const updateRoadmapProgress = async (roadmapId: string, progress: any) => {
    try {
      const { data: updatedRoadmap, error } = await supabase
        .from('learning_roadmaps')
        .update({ progress })
        .eq('id', roadmapId)
        .select()
        .single();

      if (error) throw error;
      setRoadmaps(prev => prev.map(r => r.id === roadmapId ? updatedRoadmap : r));
    } catch (error) {
      console.error('Error updating roadmap progress:', error);
      throw error;
    }
  };

  const getPersonalizedDifficulty = () => {
    if (!profile) return 'medium';
    
    // Adjust difficulty based on grade level
    if (profile.grade_level <= 8) return 'easy';
    if (profile.grade_level <= 10) return 'medium';
    return 'hard';
  };

  const value = {
    profile,
    roadmaps,
    loading,
    createProfile,
    updateProfile,
    createRoadmap,
    updateRoadmapProgress,
    getPersonalizedDifficulty,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};