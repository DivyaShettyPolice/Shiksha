// Utility for Groq API text generation
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateGroqCompletion(prompt: string, model: string = 'meta-llama/llama-4-scout-17b-16e-instruct') {
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
  if (!response.ok) throw new Error('Groq API error');
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
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
  // Step 1: Generate an outline
  const outlinePrompt = `You are a friendly, engaging AI teaching assistant for Indian students (Classes 6-12).\nStudent Profile:\n- Grade: ${gradeLevel}\n- Learning Style: ${learningStyle}\n- Subject: ${subject}\n- Topic: ${topic}\n- Difficulty: ${difficulty}\n\nGenerate a concise, step-by-step lesson outline for this topic. Use 3-5 main sections. Respond with a numbered list only.`;
  const outlineText = await generateGroqCompletion(outlinePrompt);
  const sections = outlineText.split(/\n|\r/).filter((line: string) => line.match(/^\d+\./)).map((line: string) => line.replace(/^\d+\.\s*/, ''));

  // Step 2: Generate detailed explanations for each section
  const explanations: string[] = [];
  for (const section of sections) {
    const sectionPrompt = `You are a friendly, engaging AI teaching assistant for Indian students (Classes 6-12).\nStudent Profile:\n- Grade: ${gradeLevel}\n- Learning Style: ${learningStyle}\n- Subject: ${subject}\n- Topic: ${topic}\n- Difficulty: ${difficulty}\n\nExplain the following lesson section in detail, using analogies, emojis, and simple examples.\nSection: ${section}`;
    const explanation = await generateGroqCompletion(sectionPrompt);
    explanations.push(explanation);
  }

  // Step 3: Generate a flashcard summary
  const flashcardPrompt = `Create 3-5 flashcards for the topic '${topic}' in ${subject} for a Class ${gradeLevel} student. Each flashcard should have a question and a short answer. Use simple language and emojis.`;
  const flashcards = await generateGroqCompletion(flashcardPrompt);

  // Step 4: Generate a short quiz
  const quizPrompt = `Create a short quiz (3-5 MCQs) for the topic '${topic}' in ${subject} for a Class ${gradeLevel} student. Each question should have 4 options and indicate the correct answer. Use simple language and emojis.`;
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
  const prompt = `You are an expert exam coach and curriculum planner for Indian students.\nExam: ${examType}\nSubject: ${subject}\nTopic: ${topic}\nTime Available: ${timeFrame} ${timeUnit}\n\nBreak down this topic into a Duolingo-style roadmap.\n- List all key subtopics/skills in logical order.\n- Assign each subtopic to a specific ${timeUnit === 'days' ? 'day' : 'week'} (spread them evenly).\n- For each subtopic, include:\n  - Title\n  - Short description\n  - Estimated time\n  - Activities (lesson, practice, quiz, revision, etc.)\n- Format as a JSON array.\n- Make it visually engaging and exam-specific.`;
  const roadmapJson = await generateGroqCompletion(prompt);
  try {
    // Try to parse the JSON from the response
    const roadmap = JSON.parse(roadmapJson.match(/\[.*\]/s)?.[0] || roadmapJson);
    return roadmap;
  } catch (e) {
    // If parsing fails, return the raw text
    return roadmapJson;
  }
} 