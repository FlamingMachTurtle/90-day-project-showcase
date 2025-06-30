import { useState } from 'react';
import { motion } from 'framer-motion';

const FilterBar = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('day-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTech, setSelectedTech] = useState([]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      onFilterChange({ searchTerm, sortBy, tags: newTags, tech: selectedTech });
      return newTags;
    });
  };

  const handleTechToggle = (tech) => {
    setSelectedTech(prev => {
      const newTech = prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech];
      onFilterChange({ searchTerm, sortBy, tags: selectedTags, tech: newTech });
      return newTech;
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ searchTerm: value, sortBy, tags: selectedTags, tech: selectedTech });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onFilterChange({ searchTerm, sortBy: value, tags: selectedTags, tech: selectedTech });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      {/* Main Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-0 w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects by title, description, or technology..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors duration-200 text-gray-900 placeholder-gray-600"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex-shrink-0 w-full lg:w-auto">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="w-full lg:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors duration-200 text-gray-900"
          >
            <option value="day-desc">Latest Day First</option>
            <option value="day-asc">Earliest Day First</option>
            <option value="newest">Newest Date First</option>
            <option value="oldest">Oldest Date First</option>
            <option value="featured">Featured Projects First</option>
          </select>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors duration-200"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters
          <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium">
            {selectedTags.length + selectedTech.length}
          </span>
        </button>
      </div>

      {/* Expanded Filters */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Project Types */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Project Types</h3>
              <div className="flex flex-wrap gap-2">
                {['game', 'visualization', 'tool', 'api', 'interactive'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'React', 'Three.js', 'Canvas', 'WebGL', 'API'].map(tech => (
                  <button
                    key={tech}
                    onClick={() => handleTechToggle(tech)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedTech.includes(tech)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FilterBar; 