import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const { day, title, date, tags, technologies, description, thumbnail, featured } = project;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden border ${
        featured ? 'border-blue-400/50 ring-2 ring-blue-100' : 'border-gray-100'
      } transition-all duration-300`}
    >
      <Link href={`/project/${day}`}>
        <div className="cursor-pointer group">
          {/* Thumbnail */}
          <div className="relative h-44 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50/90 to-purple-50/90">
              <div className="text-center transform group-hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-600/90 mb-1">#{day}</div>
                <div className="text-sm text-blue-500/80">Day {day}</div>
              </div>
            </div>
            
            {/* Featured Badge */}
            {featured && (
              <div className="absolute top-2.5 right-2.5 bg-yellow-400/90 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm">
                ⭐ Featured
              </div>
            )}
            
            {/* Day Number Badge */}
            <div className="absolute top-2.5 left-2.5 bg-black/60 text-white/90 px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm">
              Day {day}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200">{title}</h3>
              <div className="text-xs text-gray-500 ml-2 whitespace-nowrap">{formatDate(date)}</div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  +{tags.length - 3}
                </span>
              )}
            </div>
            
            {/* Technologies */}
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 2).map((tech) => (
                <span
                  key={tech}
                  className="inline-block bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded font-medium"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 2 && (
                <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded">
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