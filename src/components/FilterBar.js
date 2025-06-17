import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterBar = ({ 
  projects, 
  onFilterChange, 
  availableTags, 
  availableTechnologies 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [sortBy, setSortBy] = useState('day-desc');
  const [showFilters, setShowFilters] = useState(false);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange({
      search: searchTerm,
      tags: selectedTags,
      technologies: selectedTechnologies,
      sortBy
    });
  }, [searchTerm, selectedTags, selectedTechnologies, sortBy, onFilterChange]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleTechnologyToggle = (tech) => {
    setSelectedTechnologies(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedTechnologies([]);
    setSortBy('day-desc');
  };

  const hasActiveFilters = searchTerm || selectedTags.length > 0 || selectedTechnologies.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      {/* Main Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex-shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="day-desc">Latest Day</option>
            <option value="day-asc">Earliest Day</option>
            <option value="newest">Newest Date</option>
            <option value="oldest">Oldest Date</option>
            <option value="featured">Featured First</option>
          </select>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
              {(selectedTags.length + selectedTechnologies.length + (searchTerm ? 1 : 0))}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Expandable Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-6">
              {/* Tags Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technologies Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTechnologies.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => handleTechnologyToggle(tech)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedTechnologies.includes(tech)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar; 