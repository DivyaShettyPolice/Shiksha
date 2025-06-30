// Application constants for consistent data handling

export const SUBJECTS = {
  MATHEMATICS: {
    slug: 'mathematics',
    name: 'Mathematics',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    emoji: '📐',
    description: 'Algebra, Geometry, Trigonometry & more'
  },
  SCIENCE: {
    slug: 'science',
    name: 'Science',
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
    emoji: '🔬',
    description: 'Physics, Chemistry, Biology'
  },
  HISTORY: {
    slug: 'history',
    name: 'History',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    emoji: '📚',
    description: 'Ancient, Medieval & Modern History'
  }
} as const;

export const LEARNING_STYLES = {
  VISUAL: {
    id: 'visual' as const,
    name: 'Visual Learner',
    description: 'I learn best with diagrams, charts, and visual aids',
    emoji: '👁️'
  },
  AUDIO: {
    id: 'audio' as const,
    name: 'Audio Learner',
    description: 'I prefer listening to explanations and discussions',
    emoji: '🎧'
  },
  TEXT: {
    id: 'text' as const,
    name: 'Text Learner',
    description: 'I like reading and taking detailed notes',
    emoji: '📝'
  }
} as const;

export const EXAM_TYPES = {
  BOARDS: { id: 'Boards', name: 'School Boards (CBSE/ICSE/State)' },
  NEET: { id: 'NEET', name: 'NEET (Medical Entrance)' },
  JEE: { id: 'JEE', name: 'JEE (Engineering Entrance)' },
  UPSC: { id: 'UPSC', name: 'UPSC (Civil Services)' }
} as const;

export const GRADE_LEVELS = Array.from({ length: 7 }, (_, i) => i + 6); // Classes 6-12

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const;

// Helper functions
export const getSubjectBySlug = (slug: string) => {
  return Object.values(SUBJECTS).find(subject => subject.slug === slug);
};

export const getSubjectsList = () => {
  return Object.values(SUBJECTS);
};

export const getLearningStylesList = () => {
  return Object.values(LEARNING_STYLES);
};

export const getExamTypesList = () => {
  return Object.values(EXAM_TYPES);
};