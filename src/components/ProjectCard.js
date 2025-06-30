import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const { day, title, date, tags, technologies, description, thumbnail, featured, githubUrl, liveDemo, externalDemo } = project;
  const defaultThumbnail = `/projects/default-project.svg`;
  const projectThumbnail = thumbnail || `/thumbnails/day${day}.svg`;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden border ${
        featured ? 'border-blue-400/50 ring-2 ring-blue-100' : 'border-gray-100'
      } transition-all duration-300`}
    >
      <div className="cursor-pointer group">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={projectThumbnail}
            alt={title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={featured}
            onError={(e) => {
              // Fallback to default thumbnail if project thumbnail fails to load
              e.currentTarget.src = defaultThumbnail;
            }}
          />
          
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
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {title}
            </h3>
            <span className="text-sm text-gray-500 ml-2 whitespace-nowrap">
              {formatDate(date)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {technologies?.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View Source
              </a>
            )}
            {liveDemo && (
              <a
                href={externalDemo || `/project/${day}`}
                target={externalDemo ? "_blank" : "_self"}
                rel={externalDemo ? "noopener noreferrer" : undefined}
                className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                {externalDemo ? 'Open Demo' : 'Live Demo'}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 