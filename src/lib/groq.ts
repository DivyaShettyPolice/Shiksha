// Utility for Groq API text generation
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateGroqCompletion(prompt: string, model: string = 'llama3-8b-8192') {
  if (!GROQ_API_KEY) {
    console.warn('Groq API key not configured. Using fallback response.');
    return generateFallbackResponse(prompt);
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a friendly, engaging AI teaching assistant for Indian students (Classes 6-12). Use analogies, emojis, and simple examples.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || generateFallbackResponse(prompt);
  } catch (error) {
    console.error('Groq API error:', error);
    return generateFallbackResponse(prompt);
  }
}

function generateFallbackResponse(prompt: string): string {
  // Extract topic from prompt for better fallback responses
  const topicMatch = prompt.match(/topic[:\s]+['"]?([^'".\n]+)['"]?/i);
  const topic = topicMatch ? topicMatch[1].trim() : 'this topic';
  
  return `Great question about ${topic}! 🤔

This is a fundamental concept that's important for your studies. Here's what you need to know:

📚 **Key Points:**
- Understanding ${topic} builds a strong foundation for advanced concepts
- Practice with examples helps reinforce learning
- Connect this topic to real-world applications

💡 **Study Tips:**
- Break down complex concepts into smaller parts
- Use visual aids and diagrams when possible
- Practice regularly with different types of problems

🎯 **Next Steps:**
- Review the basic concepts
- Try practice problems
- Ask specific questions if you need clarification

Would you like me to explain any specific aspect of ${topic} in more detail?`;
}

export async function generatePersonalizedLesson({
  topic,
  subject,
  gradeLevel,
  learningStyle,
  difficulty
}: {
  topic: string;
  subject: string;
  gradeLevel: number;
  learningStyle: string;
  difficulty: string;
}) {
  const outlinePrompt = `Create a lesson outline for "${topic}" in ${subject} for Class ${gradeLevel} students. Learning style: ${learningStyle}. Difficulty: ${difficulty}. Provide 3-5 main sections as a numbered list.`;
  
  const outlineText = await generateGroqCompletion(outlinePrompt);
  const sections = outlineText.split(/\n|\r/).filter((line: string) => line.match(/^\d+\./)).map((line: string) => line.replace(/^\d+\.\s*/, ''));

  const explanations: string[] = [];
  for (const section of sections.slice(0, 5)) { // Limit to 5 sections
    const sectionPrompt = `Explain "${section}" for ${topic} in ${subject}. Target: Class ${gradeLevel}, ${learningStyle} learner, ${difficulty} difficulty. Use analogies, emojis, and examples.`;
    const explanation = await generateGroqCompletion(sectionPrompt);
    explanations.push(explanation);
  }

  const flashcardPrompt = `Create 3-5 flashcards for "${topic}" in ${subject} for Class ${gradeLevel}. Each flashcard: Question and short answer. Use simple language and emojis.`;
  const flashcards = await generateGroqCompletion(flashcardPrompt);

  const quizPrompt = `Create 3-5 MCQs for "${topic}" in ${subject} for Class ${gradeLevel}. Each question: 4 options, indicate correct answer. Use simple language and emojis.`;
  const quiz = await generateGroqCompletion(quizPrompt);

  return {
    outline: sections,
    explanations,
    flashcards,
    quiz
  };
}

export async function generateDynamicRoadmap({
  subject,
  topic,
  examType,
  timeFrame,
  timeUnit
}: {
  subject: string;
  topic: string;
  examType: string;
  timeFrame: number;
  timeUnit: 'days' | 'weeks';
}) {
  const prompt = `Create a study roadmap for "${topic}" in ${subject} for ${examType} exam. Time: ${timeFrame} ${timeUnit}.

Break into subtopics with:
- Title
- Short description  
- Estimated time
- Activities (lesson, practice, quiz, revision)
- Day/week assignment

Format as JSON array. Make it exam-specific and engaging.`;

  const roadmapText = await generateGroqCompletion(prompt);
  
  try {
    const jsonMatch = roadmapText.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.warn('Failed to parse roadmap JSON, using fallback');
  }

  // Fallback roadmap structure
  return generateFallbackRoadmap(topic, timeFrame, timeUnit);
}

function generateFallbackRoadmap(topic: string, timeFrame: number, timeUnit: string) {
  const stepsPerUnit = timeUnit === 'days' ? 1 : 3;
  const totalSteps = Math.min(timeFrame * stepsPerUnit, 10);
  
  return Array.from({ length: totalSteps }, (_, i) => ({
    id: i + 1,
    title: `${topic} - Part ${i + 1}`,
    short_description: `Study session ${i + 1} covering key concepts of ${topic}`,
    estimated_time: '45 minutes',
    activities: ['Read concepts', 'Practice problems', 'Take notes'],
    [timeUnit === 'days' ? 'day' : 'week']: Math.ceil((i + 1) / stepsPerUnit)
  }));
}