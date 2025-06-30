import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      student_progress: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          topic: string;
          subtopic?: string;
          completed_at: string;
          quiz_score: number | null;
          time_spent?: number;
          difficulty_level?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          topic: string;
          subtopic?: string;
          completed_at?: string;
          quiz_score?: number | null;
          time_spent?: number;
          difficulty_level?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          topic?: string;
          subtopic?: string;
          completed_at?: string;
          quiz_score?: number | null;
          time_spent?: number;
          difficulty_level?: string;
        };
      };
      student_profiles: {
        Row: {
          id: string;
          user_id: string;
          grade_level: number;
          learning_style: 'visual' | 'audio' | 'text';
          preferred_subjects: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          grade_level: number;
          learning_style?: 'visual' | 'audio' | 'text';
          preferred_subjects?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          grade_level?: number;
          learning_style?: 'visual' | 'audio' | 'text';
          preferred_subjects?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      learning_roadmaps: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          topic: string;
          plan_type: 'fast-track' | 'deep-learning';
          roadmap_data: any;
          progress: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          topic: string;
          plan_type?: 'fast-track' | 'deep-learning';
          roadmap_data?: any;
          progress?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          topic?: string;
          plan_type?: 'fast-track' | 'deep-learning';
          roadmap_data?: any;
          progress?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      student_interactions: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          topic: string;
          subtopic?: string;
          interaction_type: 'question' | 'answer' | 'doubt' | 'feedback';
          content: string;
          ai_response?: string;
          context: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          topic: string;
          subtopic?: string;
          interaction_type: 'question' | 'answer' | 'doubt' | 'feedback';
          content: string;
          ai_response?: string;
          context?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          topic?: string;
          subtopic?: string;
          interaction_type?: 'question' | 'answer' | 'doubt' | 'feedback';
          content?: string;
          ai_response?: string;
          context?: any;
          created_at?: string;
        };
      };
    };
  };
};