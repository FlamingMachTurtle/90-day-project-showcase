'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import { categorizeProjects } from '@/lib/utils';
import projectsData from '@/data/projects.json';

export default function GamesPage() {
  const [gameProjects, setGameProjects] = useState([]);

  useEffect(() => {
    const categories = categorizeProjects(projectsData);
    setGameProjects(categories.games);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Showcase
            </Link>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-gray-900">
                All Projects
              </a>
              <a href="/games" className="text-blue-600 hover:text-blue-800 font-medium">
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
        {/* Page Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl mb-6">
            🎮
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Game Projects</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Interactive games and playable experiences built during the 90-day challenge. 
            Each game is fully playable right in your browser!
          </p>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full inline-block">
            {gameProjects.length} Games Available
          </div>
        </motion.div>

        {gameProjects.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-gray-400 text-6xl mb-4">🎲</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No games yet</h3>
            <p className="text-gray-600 mb-6">
              Game projects will appear here as they're created during the challenge.
            </p>
            <Link 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Projects
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Games Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {gameProjects.map((project, index) => (
                <motion.div
                  key={project.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>

            {/* Game Categories */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Game Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">🕹️</div>
                  <h3 className="font-semibold text-gray-900">Arcade</h3>
                  <p className="text-sm text-gray-600">Classic arcade-style games</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">🧩</div>
                  <h3 className="font-semibold text-gray-900">Puzzle</h3>
                  <p className="text-sm text-gray-600">Brain-teasing puzzle games</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-semibold text-gray-900">Strategy</h3>
                  <p className="text-sm text-gray-600">Strategic thinking games</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="font-semibold text-gray-900">Creative</h3>
                  <p className="text-sm text-gray-600">Art and creativity games</p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Call to Action */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4">Love Playing Games?</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Check back regularly as new games are added daily! Each game is built from scratch 
            and showcases different programming techniques and creative ideas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View All Projects
            </Link>
            <Link 
              href="/about"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              About the Challenge
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 