import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const { day, title, date, tags, technologies, description, thumbnail, featured } = project;
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
      <Link href={`/project/${day}`}>
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
            <div className="flex flex-wrap gap-1.5">
              {technologies?.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard; 