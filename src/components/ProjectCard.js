import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const { day, title, date, tags, technologies, description, thumbnail, featured } = project;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden border ${
        featured ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      } hover:shadow-xl transition-all duration-300`}
    >
      <Link href={`/project/${day}`}>
        <div className="cursor-pointer">
          {/* Thumbnail */}
          <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">#{day}</div>
                <div className="text-sm text-blue-500">Day {day}</div>
              </div>
            </div>
            
            {/* Featured Badge */}
            {featured && (
              <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                ⭐ Featured
              </div>
            )}
            
            {/* Day Number Badge */}
            <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Day {day}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{title}</h3>
              <div className="text-sm text-gray-500 ml-2">{formatDate(date)}</div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
            
            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 2).map((tech) => (
                <span
                  key={tech}
                  className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 2 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  +{technologies.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard; 