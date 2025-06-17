'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import FilterBar from '@/components/FilterBar';
import ProgressTracker from '@/components/ProgressTracker';
import { 
  filterProjects, 
  sortProjects, 
  getUniqueTags, 
  getUniqueTechnologies, 
  getRandomProject 
} from '@/lib/utils';

// Import projects data
import projectsData from '@/data/projects.json';

export default function Home() {
  const [projects, setProjects] = useState(projectsData);
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableTechnologies, setAvailableTechnologies] = useState([]);
  const [randomProject, setRandomProject] = useState(null);

  useEffect(() => {
    // Set up available filter options
    setAvailableTags(getUniqueTags(projects));
    setAvailableTechnologies(getUniqueTechnologies(projects));
    setRandomProject(getRandomProject(projects));
  }, [projects]);

  const handleFilterChange = useCallback((filters) => {
    let filtered = filterProjects(projects, filters);
    filtered = sortProjects(filtered, filters.sortBy);
    setFilteredProjects(filtered);
  }, [projects]);

  const handleSurpriseMe = () => {
    const random = getRandomProject(projects);
    setRandomProject(random);
    // Scroll to the random project or highlight it
    const projectElement = document.querySelector(`[data-project-day="${random.day}"]`);
    if (projectElement) {
      projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      projectElement.classList.add('ring-4', 'ring-yellow-400');
      setTimeout(() => {
        projectElement.classList.remove('ring-4', 'ring-yellow-400');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                90-Day Project Showcase
              </h1>
              <span className="ml-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                {projects.length}/90 Projects
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                All Projects
              </a>
              <a href="/games" className="text-gray-700 hover:text-gray-900">
                Games
              </a>
              <a href="/about" className="text-gray-700 hover:text-gray-900">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Tracker */}
        <ProgressTracker projects={projects} />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Interactive Project Showcase
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore 90 unique projects built over 90 days. Each project is interactive - 
            you can actually use them, not just read about them!
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={handleSurpriseMe}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🎲 Surprise Me!
            </button>
            <div className="text-sm text-gray-500">
              {randomProject && (
                <span>
                  Last random: <strong>{randomProject.title}</strong> (Day {randomProject.day})
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <FilterBar 
          projects={projects}
          onFilterChange={handleFilterChange}
          availableTags={availableTags}
          availableTechnologies={availableTechnologies}
        />

        {/* Projects Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              Projects ({filteredProjects.length})
            </h3>
            {filteredProjects.length !== projects.length && (
              <div className="text-sm text-gray-500">
                Showing {filteredProjects.length} of {projects.length} projects
              </div>
            )}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.day}
                data-project-day={project.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Own Challenge?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of developers who have transformed their skills through consistent daily practice. 
            Every expert was once a beginner who never gave up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              View Source Code
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">90-Day Showcase</h4>
              <p className="text-gray-400">
                A journey of consistent learning and building, one project at a time.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/games" className="hover:text-white">Games</a></li>
                <li><a href="#" className="hover:text-white">Data Visualization</a></li>
                <li><a href="#" className="hover:text-white">Utilities</a></li>
                <li><a href="#" className="hover:text-white">Art & Creative</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="/about" className="hover:text-white">About</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 90-Day Project Showcase. Built with passion and persistence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 