import React from 'react';

interface ProgressDashboardProps {
  completedTopics: number;
  totalTopics: number;
  quizScores: number[];
  timeSpent: { date: string; minutes: number }[];
  estimatedCompletion: string;
  streak: number;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  completedTopics,
  totalTopics,
  quizScores,
  timeSpent,
  estimatedCompletion,
  streak,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Your Progress</h2>
      <div className="flex flex-wrap gap-6 items-center mb-6">
        <div className="flex flex-col items-center">
          <span className="text-3xl">✅</span>
          <div className="font-semibold text-gray-900">{completedTopics} / {totalTopics}</div>
          <div className="text-xs text-gray-500">Topics Completed</div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl">🔥</span>
          <div className="font-semibold text-gray-900">{streak} days</div>
          <div className="text-xs text-gray-500">Current Streak</div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl">⏰</span>
          <div className="font-semibold text-gray-900">{timeSpent.reduce((a, b) => a + b.minutes, 0)} min</div>
          <div className="text-xs text-gray-500">Time Spent</div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl">📅</span>
          <div className="font-semibold text-gray-900">{estimatedCompletion}</div>
          <div className="text-xs text-gray-500">Est. Completion</div>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Quiz Performance</h3>
        <div className="flex items-end gap-2 h-24">
          {quizScores.map((score, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-6 rounded-t bg-blue-500"
                style={{ height: `${score * 2}px` }}
                title={`Score: ${score}`}
              ></div>
              <span className="text-xs text-gray-500 mt-1">Q{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Time Spent Per Day</h3>
        <div className="flex items-end gap-2 h-24">
          {timeSpent.map((entry, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-6 rounded-t bg-green-500"
                style={{ height: `${entry.minutes}px` }}
                title={`${entry.minutes} min on ${entry.date}`}
              ></div>
              <span className="text-xs text-gray-500 mt-1">{entry.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard; 