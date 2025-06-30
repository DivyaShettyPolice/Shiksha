import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle, Brain, ChevronLeft, ChevronRight } from 'lucide-react';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

const Flashcards: React.FC = () => {
  const { subject, topic } = useParams<{ subject: string; topic: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const subjectNames: { [key: string]: string } = {
    math: 'Mathematics',
    science: 'Science',
    history: 'History'
  };

  useEffect(() => {
    generateFlashcards();
  }, [subject, topic]);

  const generateFlashcards = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate flashcards based on topic and subject
    const flashcardData: { [key: string]: { [key: string]: Flashcard[] } } = {
      math: {
        'quadratic equations': [
          {
            id: 1,
            question: "What is the general form of a quadratic equation?",
            answer: "ax² + bx + c = 0, where a ≠ 0"
          },
          {
            id: 2,
            question: "What is the quadratic formula?",
            answer: "x = (-b ± √(b²-4ac)) / 2a"
          },
          {
            id: 3,
            question: "What is the discriminant in a quadratic equation?",
            answer: "The discriminant is b²-4ac. It determines the nature of roots."
          },
          {
            id: 4,
            question: "How many roots can a quadratic equation have?",
            answer: "A quadratic equation can have at most 2 roots."
          },
          {
            id: 5,
            question: "What happens when the discriminant is negative?",
            answer: "When discriminant < 0, the equation has no real roots (complex roots)."
          }
        ],
        'pythagorean theorem': [
          {
            id: 1,
            question: "State the Pythagorean theorem.",
            answer: "In a right triangle, a² + b² = c², where c is the hypotenuse."
          },
          {
            id: 2,
            question: "Who is the theorem named after?",
            answer: "Pythagoras, a Greek mathematician from the 6th century BC."
          },
          {
            id: 3,
            question: "What is a Pythagorean triple?",
            answer: "Three positive integers a, b, c such that a² + b² = c². Example: 3, 4, 5."
          },
          {
            id: 4,
            question: "What is the converse of the Pythagorean theorem?",
            answer: "If a² + b² = c², then the triangle is a right triangle."
          },
          {
            id: 5,
            question: "Name a real-world application of the Pythagorean theorem.",
            answer: "Navigation, construction, distance calculations, GPS systems."
          }
        ]
      },
      science: {
        'photosynthesis': [
          {
            id: 1,
            question: "What is the chemical equation for photosynthesis?",
            answer: "6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂"
          },
          {
            id: 2,
            question: "Where does photosynthesis occur in plant cells?",
            answer: "In chloroplasts, specifically in the thylakoids and stroma."
          },
          {
            id: 3,
            question: "What pigment is responsible for capturing light energy?",
            answer: "Chlorophyll (primarily chlorophyll-a and chlorophyll-b)."
          },
          {
            id: 4,
            question: "What are the two main stages of photosynthesis?",
            answer: "Light-dependent reactions (photo phase) and Calvin cycle (bio phase)."
          },
          {
            id: 5,
            question: "What factors affect the rate of photosynthesis?",
            answer: "Light intensity, CO₂ concentration, temperature, and water availability."
          }
        ],
        'newton\'s laws': [
          {
            id: 1,
            question: "State Newton's First Law of Motion.",
            answer: "An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force."
          },
          {
            id: 2,
            question: "What is Newton's Second Law mathematically?",
            answer: "F = ma (Force equals mass times acceleration)."
          },
          {
            id: 3,
            question: "State Newton's Third Law of Motion.",
            answer: "For every action, there is an equal and opposite reaction."
          },
          {
            id: 4,
            question: "What is inertia?",
            answer: "The tendency of an object to resist changes in its state of motion."
          },
          {
            id: 5,
            question: "Give an example of Newton's Third Law.",
            answer: "When walking, we push the ground backward and the ground pushes us forward."
          }
        ]
      },
      history: {
        'mughal empire': [
          {
            id: 1,
            question: "Who founded the Mughal Empire?",
            answer: "Babur founded the Mughal Empire in 1526 after winning the Battle of Panipat."
          },
          {
            id: 2,
            question: "Which Mughal emperor is known as 'Akbar the Great'?",
            answer: "Akbar (1556-1605) is known as Akbar the Great for his administrative reforms and religious tolerance."
          },
          {
            id: 3,
            question: "Who built the Taj Mahal and why?",
            answer: "Shah Jahan built the Taj Mahal as a mausoleum for his wife Mumtaz Mahal."
          },
          {
            id: 4,
            question: "What was the Mansabdari system?",
            answer: "An administrative system where officials were ranked by mansabs (ranks) determining their salary and responsibilities."
          },
          {
            id: 5,
            question: "Which Mughal emperor had the longest reign?",
            answer: "Aurangzeb (1658-1707) had the longest reign of 49 years."
          }
        ],
        'independence movement': [
          {
            id: 1,
            question: "When was the Indian National Congress founded?",
            answer: "The Indian National Congress was founded in 1885 by A.O. Hume."
          },
          {
            id: 2,
            question: "What was the Salt March?",
            answer: "A 240-mile march led by Gandhi in 1930 from Sabarmati Ashram to Dandi to break the British salt monopoly."
          },
          {
            id: 3,
            question: "What was the slogan of the Quit India Movement?",
            answer: "'Do or Die' was the slogan given by Mahatma Gandhi during the Quit India Movement in 1942."
          },
          {
            id: 4,
            question: "Who formed the Indian National Army (INA)?",
            answer: "Subhas Chandra Bose formed the Indian National Army to fight against British rule."
          },
          {
            id: 5,
            question: "When did India gain independence?",
            answer: "India gained independence on August 15, 1947, with partition into India and Pakistan."
          }
        ]
      }
    };

    const decodedTopic = decodeURIComponent(topic || '').toLowerCase();
    const subjectKey = subject || 'math';
    
    let cards: Flashcard[] = [];
    if (flashcardData[subjectKey] && flashcardData[subjectKey][decodedTopic]) {
      cards = flashcardData[subjectKey][decodedTopic];
    } else {
      // Generate generic flashcards for unknown topics
      cards = [
        {
          id: 1,
          question: `What is the main concept of ${decodeURIComponent(topic || '')}?`,
          answer: `${decodeURIComponent(topic || '')} is a fundamental concept in ${subjectNames[subjectKey]} that requires understanding of key principles and applications.`
        },
        {
          id: 2,
          question: `Why is ${decodeURIComponent(topic || '')} important?`,
          answer: `Understanding ${decodeURIComponent(topic || '')} helps build a strong foundation for advanced topics and real-world problem solving.`
        },
        {
          id: 3,
          question: `How can you apply ${decodeURIComponent(topic || '')} in practice?`,
          answer: `${decodeURIComponent(topic || '')} can be applied through problem-solving exercises, real-world examples, and connecting to other concepts.`
        },
        {
          id: 4,
          question: `What are the key components of ${decodeURIComponent(topic || '')}?`,
          answer: `The key components include theoretical understanding, practical application, and connection to broader concepts in ${subjectNames[subjectKey]}.`
        },
        {
          id: 5,
          question: `How should you study ${decodeURIComponent(topic || '')}?`,
          answer: `Study through active recall, practice problems, visual aids, and teaching others to reinforce understanding.`
        }
      ];
    }

    setFlashcards(cards);
    setLoading(false);
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const markAsCompleted = () => {
    setCompletedCards(prev => new Set(prev).add(flashcards[currentCard].id));
  };

  const resetProgress = () => {
    setCompletedCards(new Set());
    setCurrentCard(0);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link 
              to={`/learn/${subject}`}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Learn
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Flashcards: {decodeURIComponent(topic || '')}
              </h1>
              <p className="text-gray-600 mt-1">
                {subjectNames[subject || 'math']} • {completedCards.size}/{flashcards.length} completed
              </p>
            </div>
          </div>
          
          <button
            onClick={resetProgress}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={20} className="mr-2" />
            Reset
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((completedCards.size / flashcards.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCards.size / flashcards.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <div 
            className={`relative w-full h-80 cursor-pointer transition-transform duration-500 preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of card */}
            <div className="absolute inset-0 bg-white rounded-xl shadow-lg border border-gray-200 p-8 flex flex-col justify-center items-center backface-hidden">
              <div className="flex items-center mb-4">
                <Brain className="text-blue-600 mr-2" size={24} />
                <span className="text-blue-600 font-medium">Question</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
                {flashcards[currentCard]?.question}
              </h2>
              <p className="text-gray-500 text-sm text-center">Click to reveal answer</p>
            </div>

            {/* Back of card */}
            <div 
              className="absolute inset-0 bg-blue-50 rounded-xl shadow-lg border border-blue-200 p-8 flex flex-col justify-center items-center backface-hidden rotate-y-180"
            >
              <div className="flex items-center mb-4">
                <CheckCircle className="text-green-600 mr-2" size={24} />
                <span className="text-green-600 font-medium">Answer</span>
              </div>
              <p className="text-lg text-gray-900 text-center mb-4">
                {flashcards[currentCard]?.answer}
              </p>
              <p className="text-gray-500 text-sm text-center">Click to see question again</p>
            </div>
          </div>
        </div>

        {/* Card Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={prevCard}
            disabled={flashcards.length <= 1}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Previous
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {currentCard + 1} of {flashcards.length}
            </span>
            
            {!completedCards.has(flashcards[currentCard]?.id) && (
              <button
                onClick={markAsCompleted}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={20} className="mr-2" />
                Mark Complete
              </button>
            )}
            
            {completedCards.has(flashcards[currentCard]?.id) && (
              <span className="flex items-center text-green-600 text-sm font-medium">
                <CheckCircle size={16} className="mr-1" />
                Completed
              </span>
            )}
          </div>

          <button
            onClick={nextCard}
            disabled={flashcards.length <= 1}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>

        {/* All Completed */}
        {completedCards.size === flashcards.length && flashcards.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-green-700 mb-4">
              You've completed all flashcards for {decodeURIComponent(topic || '')}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetProgress}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Review Again
              </button>
              <Link
                to={`/quiz/${subject}/${topic}`}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Quiz
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Flashcards;