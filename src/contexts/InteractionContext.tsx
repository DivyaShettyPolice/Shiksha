import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';
import { supabase } from '../lib/supabase';

interface StudentInteraction {
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
}

interface InteractionContextType {
  interactions: StudentInteraction[];
  loading: boolean;
  askDoubt: (subject: string, topic: string, question: string, subtopic?: string) => Promise<string>;
  saveInteraction: (data: Omit<StudentInteraction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  getTopicInteractions: (subject: string, topic: string) => StudentInteraction[];
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export const useInteraction = () => {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
};

export const InteractionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interactions, setInteractions] = useState<StudentInteraction[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();

  const generateAIResponse = async (question: string, context: any): Promise<string> => {
    // Simulate AI response generation based on context
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { subject, topic, subtopic, gradeLevel, learningStyle } = context;

    // Generate contextual responses based on the question and context
    const responses: { [key: string]: { [key: string]: string[] } } = {
      math: {
        'quadratic equations': [
          `Great question! 🤔 Let me explain this step by step. In quadratic equations, we're dealing with expressions where the highest power of x is 2. Think of it like a U-shaped curve - that's what we call a parabola! 

For your grade level (Class ${gradeLevel}), the key thing to remember is the standard form: ax² + bx + c = 0. 

${learningStyle === 'visual' ? '📊 Imagine this as a graph - it always makes a U or upside-down U shape!' : learningStyle === 'audio' ? '🎵 Try saying "a-x-squared plus b-x plus c equals zero" - it has a nice rhythm!' : '📝 Write it down: ax² + bx + c = 0, where a cannot be zero.'}

Would you like me to show you a specific example or explain why 'a' cannot be zero?`,
          
          `Excellent doubt! 💡 This is exactly the kind of thinking that makes you a great student. 

The discriminant (b² - 4ac) is like a detective 🕵️ - it tells us what kind of roots our equation will have before we even solve it!

${learningStyle === 'visual' ? '🎨 Picture it like this: If discriminant > 0, you get two different real roots (like two different x-intercepts on a graph). If = 0, you get one repeated root (the parabola just touches the x-axis). If < 0, no real roots (the parabola doesn\'t touch the x-axis at all)!' : '📚 Remember: Positive discriminant = 2 real roots, Zero discriminant = 1 repeated root, Negative discriminant = complex roots.'}

This concept will be super useful in Class ${gradeLevel + 1} when you study more advanced algebra! 

Want to try calculating the discriminant for a specific equation?`
        ],
        'pythagorean theorem': [
          `Awesome question! 🏗️ The Pythagorean theorem is like the superhero of geometry - it's everywhere!

a² + b² = c² isn't just a formula, it's a relationship that describes right triangles perfectly. Think of it as the "triangle rule" that never breaks!

${learningStyle === 'visual' ? '📐 Imagine a right triangle: the two shorter sides (legs) when squared and added together always equal the longest side (hypotenuse) squared. It\'s like a perfect mathematical balance!' : learningStyle === 'audio' ? '🎵 Try this rhythm: "a-squared plus b-squared equals c-squared" - it\'s the triangle song!' : '✏️ Practice with the famous 3-4-5 triangle: 3² + 4² = 9 + 16 = 25 = 5²'}

For Class ${gradeLevel}, this is super important because it connects to coordinate geometry, trigonometry, and even physics later!

Would you like to see how this applies to real-world problems like finding distances or heights?`
        ]
      },
      science: {
        'photosynthesis': [
          `Fantastic question! 🌱 Photosynthesis is literally how plants "eat" sunlight - isn't that amazing?

The equation 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂ tells a beautiful story: Plants take in carbon dioxide (what we breathe out) and water, use sunlight as energy, and make glucose (food) while giving us oxygen (what we breathe in)!

${learningStyle === 'visual' ? '🌞🌿 Picture this: Sunlight hits the green leaves (chlorophyll), water comes up from roots, CO₂ enters through tiny pores, and BOOM - glucose is made and oxygen is released!' : learningStyle === 'audio' ? '🎵 Think of it as nature\'s recipe: "Six CO₂ plus six H₂O, add some light, and glucose will grow!"' : '📝 Remember: Input (CO₂ + H₂O + light) → Output (glucose + O₂)'}

This process is why we can breathe and why plants are called the "lungs of Earth"! 

For Class ${gradeLevel}, understanding this helps with ecology, food chains, and even climate change topics.

Want to know more about where exactly this happens in the leaf?`
        ],
        'newton\'s laws': [
          `Brilliant question! 🚀 Newton's laws are like the rules of the universe - they explain why everything moves the way it does!

Let's break it down for Class ${gradeLevel}:

1st Law (Inertia): "Things keep doing what they're doing unless something stops them" - like how you slide forward when a bus suddenly stops! 🚌

2nd Law (F=ma): "The harder you push, the faster it goes" - but heavier things need more force to move the same speed 💪

3rd Law (Action-Reaction): "Every push gets a push back" - when you walk, you push the ground back, and it pushes you forward! 👟

${learningStyle === 'visual' ? '🎬 Think of action movies: rockets work because they push gas down (action) and the gas pushes the rocket up (reaction)!' : learningStyle === 'audio' ? '🎵 Remember: "For every action, there\'s a reaction, equal and opposite in every situation!"' : '📋 List examples: walking, swimming, rocket launching, car braking - all follow these laws!'}

These laws explain everything from why seatbelts save lives to how rockets reach space!

Which law would you like to explore with more examples?`
        ]
      },
      history: {
        'mughal empire': [
          `Excellent question! 👑 The Mughal Empire is one of the most fascinating periods in Indian history!

From Babur's victory at Panipat (1526) to the last emperor Bahadur Shah Zafar (1857), the Mughals shaped India for over 300 years! 

${learningStyle === 'visual' ? '🏰 Picture the magnificent Taj Mahal, Red Fort, and Fatehpur Sikri - these aren\'t just buildings, they\'re stories in stone!' : learningStyle === 'audio' ? '🎵 The Mughal story has drama, romance, battles, and art - like the greatest epic ever told!' : '📚 Key timeline: Babur (founder) → Akbar (greatest) → Shah Jahan (builder) → Aurangzeb (largest empire)'}

For Class ${gradeLevel}, focus on how the Mughals:
- Brought new architectural styles 🏛️
- Created efficient administration 📋
- Promoted cultural synthesis 🎨
- Connected India to Central Asia and Persia 🌍

The Mughal period shows how different cultures can blend beautifully - just look at Hindustani music, Urdu language, and Indo-Islamic architecture!

Which Mughal emperor interests you most, or would you like to know about their impact on modern India?`
        ],
        'independence movement': [
          `What an inspiring question! 🇮🇳 The Indian Independence Movement is the story of how ordinary people did extraordinary things!

From the Revolt of 1857 to Independence in 1947, it's 90 years of courage, sacrifice, and determination. 

${learningStyle === 'visual' ? '🚶‍♂️ Picture Gandhi\'s Salt March - 240 miles of walking to break an unjust law, with thousands joining along the way!' : learningStyle === 'audio' ? '🎵 Imagine the sound of "Quit India" echoing across the nation, or the midnight speech "At the stroke of midnight hour..."' : '📝 Key movements: Non-Cooperation (1920) → Salt March (1930) → Quit India (1942) → Independence (1947)'}

For Class ${gradeLevel}, understand that this wasn't just about politics - it was about:
- Economic freedom (Swadeshi movement) 💰
- Social reform (fighting untouchability) 🤝
- Cultural pride (reviving Indian traditions) 🎭
- Non-violent resistance (Satyagraha) ☮️

The movement gave us heroes like Gandhi, Nehru, Bose, Bhagat Singh, and countless unnamed freedom fighters.

Which aspect interests you most - the political strategies, the social reforms, or the role of youth in the movement?`
        ]
      }
    };

    const subjectResponses = responses[subject.toLowerCase()] || {};
    const topicResponses = subjectResponses[topic.toLowerCase()] || [];
    
    if (topicResponses.length > 0) {
      return topicResponses[Math.floor(Math.random() * topicResponses.length)];
    }

    // Generic response for unknown topics
    return `Great question about ${topic}! 🤔 

Based on your profile (Class ${gradeLevel}, ${learningStyle} learner), let me help you understand this better.

${learningStyle === 'visual' ? '📊 Let me paint a picture for you:' : learningStyle === 'audio' ? '🎵 Listen to this explanation:' : '📝 Here\'s a clear breakdown:'}

This topic in ${subject} is important because it builds the foundation for more advanced concepts you'll learn in higher classes. 

${question.toLowerCase().includes('why') ? 'The "why" behind this concept connects to real-world applications and helps you see the bigger picture.' : question.toLowerCase().includes('how') ? 'The "how" involves understanding the process step by step, which is exactly what we\'ll do!' : 'This is a fundamental concept that will help you in your academic journey.'}

Would you like me to:
1. Explain with a simple example 📝
2. Show you a real-world application 🌍
3. Break it down into smaller parts 🧩
4. Connect it to what you already know 🔗

What would help you understand this better?`;
  };

  const askDoubt = async (subject: string, topic: string, question: string, subtopic?: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      const context = {
        subject,
        topic,
        subtopic,
        gradeLevel: profile?.grade_level || 10,
        learningStyle: profile?.learning_style || 'text',
        question
      };

      const aiResponse = await generateAIResponse(question, context);

      // Save the interaction
      await saveInteraction({
        subject,
        topic,
        subtopic,
        interaction_type: 'doubt',
        content: question,
        ai_response: aiResponse,
        context
      });

      return aiResponse;
    } catch (error) {
      console.error('Error asking doubt:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveInteraction = async (data: Omit<StudentInteraction, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data: newInteraction, error } = await supabase
        .from('student_interactions')
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      setInteractions(prev => [newInteraction, ...prev]);
    } catch (error) {
      console.error('Error saving interaction:', error);
      throw error;
    }
  };

  const getTopicInteractions = (subject: string, topic: string) => {
    return interactions.filter(i => i.subject === subject && i.topic === topic);
  };

  const value = {
    interactions,
    loading,
    askDoubt,
    saveInteraction,
    getTopicInteractions,
  };

  return <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>;
};