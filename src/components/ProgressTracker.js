import { motion } from 'framer-motion';
import { getDaysSinceStart, getCompletionPercentage, calculateStreak, calculateLongestStreak } from '@/lib/utils';

const ProgressBar = ({ value, max, label, color, description }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-sm font-medium text-white/90">{label}</span>
      <span className="text-sm font-medium text-white/90">{value}/{max}</span>
    </div>
    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1 }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
    <div className="text-xs text-blue-100/80 mt-1">{description}</div>
  </div>
);

const ProgressTracker = ({ projects }) => {
  const currentDay = getDaysSinceStart();
  const completedProjects = projects.length;
  const completionPercentage = getCompletionPercentage(currentDay);
  const streak = calculateStreak(projects);
  const longestStreak = calculateLongestStreak(projects);

  // Calculate stats in the background (but don't display)
  const remainingDays = Math.max(90 - currentDay, 0);
  const averageTimeSpent = projects.length > 0 
    ? projects.reduce((acc, p) => acc + parseInt(p.timeSpent || '0'), 0) / projects.length 
    : 0;
  const featuredProjects = projects.filter(p => p.featured).length;
  const uniqueTechnologies = new Set(projects.flatMap(p => p.technologies || [])).size;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Days Counter */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center bg-white/10 rounded-lg p-3"
        >
          <div className="text-3xl font-bold mb-1">{currentDay}/90</div>
          <div className="text-white/90 text-sm font-medium">Days Into Challenge</div>
          <div className="text-blue-100/80 text-xs mt-0.5">Started {currentDay} days ago</div>
        </motion.div>

        {/* Projects Counter */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center bg-white/10 rounded-lg p-3"
        >
          <div className="text-3xl font-bold mb-1">{completedProjects}/90</div>
          <div className="text-white/90 text-sm font-medium">Projects Built</div>
          <div className="text-blue-100/80 text-xs mt-0.5">
            {90 - completedProjects} projects remaining
          </div>
        </motion.div>

        {/* Current Streak */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center bg-white/10 rounded-lg p-3"
        >
          <div className="text-3xl font-bold mb-1">{streak}</div>
          <div className="text-white/90 text-sm font-medium">Current Streak</div>
          <div className="text-blue-100/80 text-xs mt-0.5">
            {streak > 0 ? '🔥 Within 72h window!' : 'Start your streak!'}
          </div>
        </motion.div>

        {/* Longest Streak */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center bg-white/10 rounded-lg p-3"
        >
          <div className="text-3xl font-bold mb-1">{longestStreak}</div>
          <div className="text-white/90 text-sm font-medium">Longest Streak</div>
          <div className="text-blue-100/80 text-xs mt-0.5">
            {longestStreak > streak ? 'Can you beat it?' : streak > 1 ? 'New record!' : 'Get started!'}
          </div>
        </motion.div>
      </div>

      {/* Progress Bars Section */}
      <div className="space-y-4">
        <ProgressBar
          value={currentDay}
          max={90}
          label="Time Progress"
          color="bg-gradient-to-r from-blue-400/90 to-blue-300/90"
          description={`${remainingDays} days remaining in the challenge`}
        />
        
        <ProgressBar
          value={completedProjects}
          max={90}
          label="Project Progress"
          color="bg-gradient-to-r from-purple-400/90 to-pink-300/90"
          description={`${90 - completedProjects} more projects to reach the goal`}
        />
      </div>
    </div>
  );
};

export default ProgressTracker; 