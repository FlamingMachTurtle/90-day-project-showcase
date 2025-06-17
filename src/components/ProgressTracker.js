import { motion } from 'framer-motion';
import { getDaysSinceStart, getCompletionPercentage } from '@/lib/utils';

const ProgressTracker = ({ projects, startDate = '2025-01-17' }) => {
  const currentDay = getDaysSinceStart(startDate);
  const completedProjects = projects.length;
  const completionPercentage = getCompletionPercentage(currentDay);
  const streak = Math.min(completedProjects, currentDay);

  // Calculate stats
  const remainingDays = Math.max(90 - currentDay, 0);
  const averageTimeSpent = projects.length > 0 
    ? projects.reduce((acc, p) => acc + parseInt(p.timeSpent || '0'), 0) / projects.length 
    : 0;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Day */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="text-3xl font-bold mb-2">{currentDay}</div>
          <div className="text-blue-100 text-sm">Current Day</div>
          <div className="text-xs text-blue-200 mt-1">of 90 days</div>
        </motion.div>

        {/* Projects Completed */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="text-3xl font-bold mb-2">{completedProjects}</div>
          <div className="text-blue-100 text-sm">Projects Built</div>
          <div className="text-xs text-blue-200 mt-1">
            {completedProjects >= currentDay ? '🔥 On track!' : `${currentDay - completedProjects} behind`}
          </div>
        </motion.div>

        {/* Streak Counter */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="text-3xl font-bold mb-2">{streak}</div>
          <div className="text-blue-100 text-sm">Day Streak</div>
          <div className="text-xs text-blue-200 mt-1">
            {streak > 7 ? '🔥 Hot streak!' : 'Keep going!'}
          </div>
        </motion.div>

        {/* Completion Percentage */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="text-3xl font-bold mb-2">{Math.round(completionPercentage)}%</div>
          <div className="text-blue-100 text-sm">Complete</div>
          <div className="text-xs text-blue-200 mt-1">{remainingDays} days left</div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="flex justify-between text-sm text-blue-100 mb-2">
          <span>Progress</span>
          <span>{completedProjects} / 90 projects</span>
        </div>
        <div className="w-full bg-blue-800 bg-opacity-30 rounded-full h-3">
          <motion.div
            className="bg-white h-3 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-blue-200 mt-2">
          <span>Day 1</span>
          <span>Day 90</span>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white bg-opacity-10 rounded-lg p-3">
          <div className="text-lg font-semibold">{averageTimeSpent.toFixed(1)}h</div>
          <div className="text-xs text-blue-200">Avg Time/Project</div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-3">
          <div className="text-lg font-semibold">
            {projects.filter(p => p.featured).length}
          </div>
          <div className="text-xs text-blue-200">Featured Projects</div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-3">
          <div className="text-lg font-semibold">
            {new Set(projects.flatMap(p => p.technologies)).size}
          </div>
          <div className="text-xs text-blue-200">Technologies Used</div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 text-center">
        <div className="text-sm text-blue-100">
          {getMotivationalMessage(currentDay, completedProjects, remainingDays)}
        </div>
      </div>
    </div>
  );
};

// Helper function for motivational messages
const getMotivationalMessage = (currentDay, completedProjects, remainingDays) => {
  if (completedProjects >= currentDay) {
    if (currentDay > 30) return "🚀 Amazing progress! You're crushing this challenge!";
    if (currentDay > 7) return "💪 Great consistency! Keep the momentum going!";
    return "✨ Off to a great start! One day at a time!";
  } else {
    const behind = currentDay - completedProjects;
    if (behind === 1) return "⚡ Almost caught up! You've got this!";
    if (behind <= 3) return "🎯 Time to catch up! You can do it!";
    return `💯 ${remainingDays} days left to make it happen! Never give up!`;
  }
};

export default ProgressTracker; 