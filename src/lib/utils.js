import { format, formatDistanceToNow, subDays, differenceInHours } from 'date-fns';

// Format date for display
export const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (dateString) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

// Calculate days since start of challenge
export const getDaysSinceStart = () => {
  const start = subDays(new Date(), 13); // Start date is 13 days ago
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(diffDays, 90); // Cap at 90 days
};

// Filter projects by various criteria
export const filterProjects = (projects, filters) => {
  let filtered = projects;

  if (filters.search) {
    filtered = filtered.filter(project => 
      project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.description.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(project => 
      filters.tags.some(tag => project.tags.includes(tag))
    );
  }

  if (filters.technologies && filters.technologies.length > 0) {
    filtered = filtered.filter(project => 
      filters.technologies.some(tech => project.technologies.includes(tech))
    );
  }

  return filtered;
};

// Sort projects by various criteria
export const sortProjects = (projects, sortBy) => {
  switch (sortBy) {
    case 'newest':
      return [...projects].sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'oldest':
      return [...projects].sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'day-asc':
      return [...projects].sort((a, b) => a.day - b.day);
    case 'day-desc':
      return [...projects].sort((a, b) => b.day - a.day);
    case 'featured':
      return [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    default:
      return projects;
  }
};

// Get unique tags from all projects
export const getUniqueTags = (projects) => {
  const allTags = projects.flatMap(project => project.tags);
  return [...new Set(allTags)].sort();
};

// Get unique technologies from all projects
export const getUniqueTechnologies = (projects) => {
  const allTech = projects.flatMap(project => project.technologies);
  return [...new Set(allTech)].sort();
};

// Get random project
export const getRandomProject = (projects) => {
  return projects[Math.floor(Math.random() * projects.length)];
};

// Calculate completion percentage
export const getCompletionPercentage = (currentDay) => {
  return Math.min((currentDay / 90) * 100, 100);
};

// Generate project categories
export const categorizeProjects = (projects) => {
  return {
    games: projects.filter(p => p.tags.some(tag => tag.toLowerCase() === 'game')),
    dataViz: projects.filter(p => p.tags.some(tag => tag.toLowerCase() === 'data-viz')),
    utilities: projects.filter(p => p.tags.some(tag => tag.toLowerCase() === 'utility')),
    art: projects.filter(p => p.tags.some(tag => tag.toLowerCase() === 'art')),
    experiments: projects.filter(p => p.tags.some(tag => tag.toLowerCase() === 'experiment'))
  };
};

// Calculate current streak with 72-hour grace period
export const calculateStreak = (projects) => {
  if (!projects.length) return 0;

  // Sort projects by date in descending order (newest first)
  const sortedProjects = [...projects].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Get unique dates (to handle multiple projects on same day)
  const uniqueDates = [...new Set(sortedProjects.map(p => p.date))];
  const latestProject = new Date(uniqueDates[0]);
  const now = new Date();

  // Check if within grace period (72 hours)
  const hoursSinceLastProject = differenceInHours(now, latestProject);
  if (hoursSinceLastProject > 72) return 0;

  // For current streak, we only count the most recent submission per day
  return 1; // Since we're within grace period, current streak is 1
};

// Calculate longest streak achieved
export const calculateLongestStreak = (projects) => {
  if (!projects.length) return 0;

  // Sort projects by date in ascending order
  const sortedProjects = [...projects].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Get unique dates (to handle multiple projects on same day)
  const uniqueDates = [...new Set(sortedProjects.map(p => p.date))];
  
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const next = new Date(uniqueDates[i + 1]);
    const hoursBetween = differenceInHours(next, current);
    
    if (hoursBetween <= 72) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}; 