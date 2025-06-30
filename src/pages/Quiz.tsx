import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Brain } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const Quiz: React.FC = () => {
  const { subject, topic } = useParams<{ subject: string; topic: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addProgress } = useProgress();
  const navigate = useNavigate();

  const subjectNames: { [key: string]: string } = {
    math: 'Mathematics',
    science: 'Science',
    history: 'History'
  };

  useEffect(() => {
    generateQuiz();
  }, [subject, topic]);

  const generateQuiz = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate quiz questions based on topic and subject
    const quizData: { [key: string]: { [key: string]: Question[] } } = {
      math: {
        'quadratic equations': [
          {
            id: 1,
            question: "What is the standard form of a quadratic equation?",
            options: ["ax + b = 0", "ax² + bx + c = 0", "ax³ + bx² + cx + d = 0", "ax² + b = 0"],
            correct: 1,
            explanation: "The standard form is ax² + bx + c = 0, where a ≠ 0."
          },
          {
            id: 2,
            question: "What is the discriminant of the quadratic equation 2x² - 3x + 1 = 0?",
            options: ["1", "5", "9", "11"],
            correct: 0,
            explanation: "Discriminant = b² - 4ac = (-3)² - 4(2)(1) = 9 - 8 = 1"
          },
          {
            id: 3,
            question: "If the discriminant of a quadratic equation is negative, the roots are:",
            options: ["Real and equal", "Real and unequal", "Complex/Imaginary", "Rational"],
            correct: 2,
            explanation: "When discriminant < 0, the quadratic equation has complex or imaginary roots."
          },
          {
            id: 4,
            question: "The quadratic formula is:",
            options: ["x = (-b ± √(b² - 4ac)) / 2a", "x = (b ± √(b² + 4ac)) / 2a", "x = (-b ± √(b² + 4ac)) / 2a", "x = (b ± √(b² - 4ac)) / 2a"],
            correct: 0,
            explanation: "The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a"
          },
          {
            id: 5,
            question: "What are the roots of x² - 5x + 6 = 0?",
            options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 2, -3"],
            correct: 0,
            explanation: "Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3"
          }
        ],
        'pythagorean theorem': [
          {
            id: 1,
            question: "The Pythagorean theorem states that:",
            options: ["a + b = c", "a² + b² = c²", "a² - b² = c²", "ab = c²"],
            correct: 1,
            explanation: "In a right triangle, a² + b² = c², where c is the hypotenuse."
          },
          {
            id: 2,
            question: "In a right triangle with legs 3 and 4, what is the hypotenuse?",
            options: ["5", "6", "7", "8"],
            correct: 0,
            explanation: "Using a² + b² = c²: 3² + 4² = 9 + 16 = 25, so c = √25 = 5"
          },
          {
            id: 3,
            question: "Which of these is a Pythagorean triple?",
            options: ["(2, 3, 4)", "(5, 12, 13)", "(1, 2, 3)", "(4, 5, 6)"],
            correct: 1,
            explanation: "(5, 12, 13) is a Pythagorean triple because 5² + 12² = 25 + 144 = 169 = 13²"
          },
          {
            id: 4,
            question: "If one leg is 8 and the hypotenuse is 10, what is the other leg?",
            options: ["4", "6", "12", "14"],
            correct: 1,
            explanation: "Using a² + b² = c²: 8² + b² = 10², so b² = 100 - 64 = 36, b = 6"
          },
          {
            id: 5,
            question: "The Pythagorean theorem applies to:",
            options: ["All triangles", "Equilateral triangles", "Right triangles only", "Isosceles triangles"],
            correct: 2,
            explanation: "The Pythagorean theorem applies specifically to right triangles."
          }
        ]
      },
      science: {
        'photosynthesis': [
          {
            id: 1,
            question: "The chemical equation for photosynthesis is:",
            options: [
              "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
              "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O",
              "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
              "CO₂ + H₂O → glucose + O₂"
            ],
            correct: 2,
            explanation: "Photosynthesis: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂"
          },
          {
            id: 2,
            question: "Photosynthesis occurs in which part of the plant cell?",
            options: ["Mitochondria", "Nucleus", "Chloroplasts", "Ribosomes"],
            correct: 2,
            explanation: "Photosynthesis occurs in chloroplasts, which contain chlorophyll."
          },
          {
            id: 3,
            question: "What gas is released as a byproduct of photosynthesis?",
            options: ["Carbon dioxide", "Nitrogen", "Hydrogen", "Oxygen"],
            correct: 3,
            explanation: "Oxygen (O₂) is released as a byproduct when water molecules are split."
          },
          {
            id: 4,
            question: "Which pigment is primarily responsible for photosynthesis?",
            options: ["Carotene", "Chlorophyll", "Anthocyanin", "Xanthophyll"],
            correct: 1,
            explanation: "Chlorophyll is the primary pigment that captures light energy for photosynthesis."
          },
          {
            id: 5,
            question: "The two main stages of photosynthesis are:",
            options: [
              "Light and dark reactions",
              "Oxidation and reduction",
              "Glycolysis and respiration",
              "Absorption and emission"
            ],
            correct: 0,
            explanation: "Photosynthesis has light-dependent reactions and light-independent reactions (Calvin cycle)."
          }
        ],
        'newton\'s laws': [
          {
            id: 1,
            question: "Newton's First Law is also known as:",
            options: ["Law of acceleration", "Law of inertia", "Law of action-reaction", "Law of gravitation"],
            correct: 1,
            explanation: "Newton's First Law is called the Law of Inertia."
          },
          {
            id: 2,
            question: "According to Newton's Second Law, F = ma. If force doubles and mass stays the same:",
            options: ["Acceleration halves", "Acceleration doubles", "Acceleration stays same", "Acceleration quadruples"],
            correct: 1,
            explanation: "If F = ma and force doubles while mass stays constant, acceleration must double."
          },
          {
            id: 3,
            question: "Newton's Third Law states:",
            options: [
              "Objects at rest stay at rest",
              "F = ma",
              "For every action, there's an equal and opposite reaction",
              "Energy is conserved"
            ],
            correct: 2,
            explanation: "Newton's Third Law: For every action, there is an equal and opposite reaction."
          },
          {
            id: 4,
            question: "Which is an example of Newton's Third Law?",
            options: [
              "A car accelerating",
              "Walking on the ground",
              "A ball falling",
              "A book on a table"
            ],
            correct: 1,
            explanation: "Walking: we push ground backward, ground pushes us forward (action-reaction pair)."
          },
          {
            id: 5,
            question: "What is inertia?",
            options: [
              "The force of gravity",
              "The tendency to resist changes in motion",
              "The speed of an object",
              "The weight of an object"
            ],
            correct: 1,
            explanation: "Inertia is the tendency of an object to resist changes in its state of motion."
          }
        ]
      },
      history: {
        'mughal empire': [
          {
            id: 1,
            question: "Who founded the Mughal Empire?",
            options: ["Akbar", "Babur", "Humayun", "Shah Jahan"],
            correct: 1,
            explanation: "Babur founded the Mughal Empire in 1526 after defeating Ibrahim Lodi at Panipat."
          },
          {
            id: 2,
            question: "The Taj Mahal was built by:",
            options: ["Akbar", "Babur", "Shah Jahan", "Aurangzeb"],
            correct: 2,
            explanation: "Shah Jahan built the Taj Mahal as a mausoleum for his wife Mumtaz Mahal."
          },
          {
            id: 3,
            question: "Which Mughal emperor is known for religious tolerance?",
            options: ["Aurangzeb", "Akbar", "Babur", "Humayun"],
            correct: 1,
            explanation: "Akbar is known for his policy of religious tolerance and the Din-i-Ilahi."
          },
          {
            id: 4,
            question: "The Mansabdari system was introduced by:",
            options: ["Babur", "Akbar", "Shah Jahan", "Aurangzeb"],
            correct: 1,
            explanation: "Akbar introduced the Mansabdari system for administrative efficiency."
          },
          {
            id: 5,
            question: "The Mughal Empire reached its largest territorial extent under:",
            options: ["Akbar", "Shah Jahan", "Aurangzeb", "Babur"],
            correct: 2,
            explanation: "Under Aurangzeb, the Mughal Empire reached its greatest territorial extent."
          }
        ],
        'independence movement': [
          {
            id: 1,
            question: "The Indian National Congress was founded in:",
            options: ["1885", "1905", "1920", "1947"],
            correct: 0,
            explanation: "The Indian National Congress was founded in 1885 by A.O. Hume."
          },
          {
            id: 2,
            question: "The Salt March was led by:",
            options: ["Nehru", "Gandhi", "Bose", "Tilak"],
            correct: 1,
            explanation: "Mahatma Gandhi led the Salt March in 1930 from Sabarmati to Dandi."
          },
          {
            id: 3,
            question: "The slogan 'Do or Die' was given during:",
            options: ["Non-Cooperation Movement", "Civil Disobedience", "Quit India Movement", "Khilafat Movement"],
            correct: 2,
            explanation: "Gandhi gave the 'Do or Die' slogan during the Quit India Movement in 1942."
          },
          {
            id: 4,
            question: "Who formed the Indian National Army (INA)?",
            options: ["Gandhi", "Nehru", "Subhas Chandra Bose", "Sardar Patel"],
            correct: 2,
            explanation: "Subhas Chandra Bose formed the Indian National Army (Azad Hind Fauj)."
          },
          {
            id: 5,
            question: "India gained independence on:",
            options: ["August 14, 1947", "August 15, 1947", "January 26, 1950", "October 2, 1947"],
            correct: 1,
            explanation: "India gained independence on August 15, 1947."
          }
        ]
      }
    };

    const decodedTopic = decodeURIComponent(topic || '').toLowerCase();
    const subjectKey = subject || 'math';
    
    let quiz: Question[] = [];
    if (quizData[subjectKey] && quizData[subjectKey][decodedTopic]) {
      quiz = quizData[subjectKey][decodedTopic];
    } else {
      // Generate generic quiz for unknown topics
      quiz = [
        {
          id: 1,
          question: `What is the main concept behind ${decodeURIComponent(topic || '')}?`,
          options: [
            "A fundamental principle in the subject",
            "A basic mathematical operation",
            "A historical event",
            "A scientific law"
          ],
          correct: 0,
          explanation: `${decodeURIComponent(topic || '')} represents a fundamental principle that students should understand.`
        },
        {
          id: 2,
          question: `How is ${decodeURIComponent(topic || '')} applied in practice?`,
          options: [
            "Through theoretical study only",
            "Through problem-solving and real-world applications",
            "Only in advanced courses",
            "It has no practical applications"
          ],
          correct: 1,
          explanation: "Most concepts are best learned through practical problem-solving and real-world applications."
        },
        {
          id: 3,
          question: `What makes ${decodeURIComponent(topic || '')} important for students?`,
          options: [
            "It's required for exams only",
            "It builds foundation for advanced topics",
            "It's interesting but not useful",
            "It's outdated knowledge"
          ],
          correct: 1,
          explanation: "Understanding fundamental concepts builds a strong foundation for more advanced topics."
        },
        {
          id: 4,
          question: `Which study method is most effective for ${decodeURIComponent(topic || '')}?`,
          options: [
            "Memorization only",
            "Understanding concepts and practicing problems",
            "Reading textbooks only",
            "Watching videos only"
          ],
          correct: 1,
          explanation: "The best approach combines conceptual understanding with regular practice."
        },
        {
          id: 5,
          question: `How can you check your understanding of ${decodeURIComponent(topic || '')}?`,
          options: [
            "By taking quizzes and solving problems",
            "By reading more about it",
            "By memorizing definitions",
            "By asking others for answers"
          ],
          correct: 0,
          explanation: "Active assessment through quizzes and problem-solving helps verify understanding."
        }
      ];
    }

    setQuestions(quiz);
    setSelectedAnswers(new Array(quiz.length).fill(-1));
    setLoading(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    setShowResults(true);
    
    // Save progress
    await addProgress(subject || '', decodeURIComponent(topic || ''), score);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = selectedAnswers.filter((answer, index) => answer === questions[index].correct).length;
    
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="mb-6">
              <Trophy className={`mx-auto mb-4 ${score >= 80 ? 'text-yellow-500' : score >= 60 ? 'text-gray-400' : 'text-red-500'}`} size={64} />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
              <p className="text-gray-600">Here's how you performed on {decodeURIComponent(topic || '')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {score}%
                  </div>
                  <p className="text-gray-600">Overall Score</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {correctAnswers}/{questions.length}
                  </div>
                  <p className="text-gray-600">Correct Answers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {questions.length - correctAnswers}
                  </div>
                  <p className="text-gray-600">Incorrect</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {score >= 80 ? 'Excellent work! 🎉' : score >= 60 ? 'Good job! Keep practicing! 👍' : 'Keep studying and try again! 💪'}
                </p>
                <p className="text-gray-600">
                  {score >= 80 
                    ? 'You have a strong understanding of this topic.'
                    : score >= 60
                    ? 'You\'re on the right track. Review the areas you missed.'
                    : 'Don\'t worry! Learning takes time. Review the material and try again.'
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center mb-8">
              <button
                onClick={resetQuiz}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RotateCcw size={20} className="mr-2" />
                Retake Quiz
              </button>
              <Link
                to={`/learn/${subject}`}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Learn More Topics
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Question Review</h2>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correct;
                
                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900 flex-1">
                        {index + 1}. {question.question}
                      </h3>
                      <div className="ml-4">
                        {isCorrect ? (
                          <CheckCircle className="text-green-600" size={24} />
                        ) : (
                          <XCircle className="text-red-600" size={24} />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded ${
                            optionIndex === question.correct
                              ? 'bg-green-100 border border-green-300'
                              : optionIndex === userAnswer && !isCorrect
                              ? 'bg-red-100 border border-red-300'
                              : 'bg-gray-50'
                          }`}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span className="ml-2">{option}</span>
                          {optionIndex === question.correct && (
                            <span className="text-green-600 text-sm ml-2">✓ Correct</span>
                          )}
                          {optionIndex === userAnswer && !isCorrect && (
                            <span className="text-red-600 text-sm ml-2">✗ Your answer</span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
                Quiz: {decodeURIComponent(topic || '')}
              </h1>
              <p className="text-gray-600 mt-1">
                {subjectNames[subject || 'math']} • Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Brain className="text-blue-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Question {currentQuestion + 1}
            </h2>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {questions[currentQuestion]?.question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-blue-600 mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestion
                    ? 'bg-blue-600'
                    : selectedAnswers[index] !== -1
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={finishQuiz}
              disabled={selectedAnswers.includes(-1)}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={selectedAnswers[currentQuestion] === -1}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          )}
        </div>

        {/* Completion Status */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {selectedAnswers.filter(answer => answer !== -1).length} of {questions.length} questions answered
        </div>
      </div>
    </div>
  );
};

export default Quiz;