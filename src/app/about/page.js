'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import LogoutButton from '@/components/LogoutButton';

export default function AboutPage() {
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
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-gray-700 hover:text-gray-900">
                All Projects
              </a>
              <a href="/games" className="text-gray-700 hover:text-gray-900">
                Games
              </a>
              <a href="/about" className="text-blue-600 hover:text-blue-800 font-medium">
                About
              </a>
              <div className="ml-4 pl-4 border-l border-gray-300">
                <LogoutButton className="text-sm" />
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-3xl mb-8">
            🚀
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">The 90-Day Challenge</h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Building 90 interactive projects in 90 days to master web development 
            through consistent practice and creative exploration.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Story Behind the Challenge</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Summer 2025 marks the beginning of my ambitious project: building 90 interactive web projects 
                before the fall semester begins. This isn't about rigid rules or perfect streaks—it's about 
                exploring my creativity, learning new technologies, and growing as a developer through consistent practice.
              </p>
              <p>
                Each project is designed to be interactive—something you can actually use or play with in your browser. 
                From physics simulations to 3D games, from data visualizations to practical tools, every project represents 
                a new learning opportunity and a chance to build something unique.
              </p>
              <p>
                The goal isn't perfection or burning myself out—it's about progress and exploration. Some projects might 
                take a day, others might span a week. Some are quick experiments, others are more complex applications. 
                What matters is the journey of learning and creating, while maintaining a healthy balance with summer activities 
                and other commitments.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Rules Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-blue-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Build Interactive Projects</h4>
                    <p className="text-gray-600 text-sm">Create projects that users can engage with - games, tools, or experiments they can try in their browser.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Learn Something New</h4>
                    <p className="text-gray-600 text-sm">Each project should involve learning or practicing a new skill, technology, or technique.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Stay Consistent</h4>
                    <p className="text-gray-600 text-sm">Aim to work on projects regularly, but take breaks when needed. Quality over quantity.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Document the Process</h4>
                    <p className="text-gray-600 text-sm">Share code, write about challenges faced, and track progress to help others learn.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Be Creative</h4>
                    <p className="text-gray-600 text-sm">Don't be afraid to experiment with new ideas or put your own spin on existing concepts.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Have Fun</h4>
                    <p className="text-gray-600 text-sm">Enjoy the process of building and learning - it's summer after all!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Technologies Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Technologies & Tools</h2>
            <p className="text-gray-600 mb-6">
              Throughout the challenge, I explored a wide range of technologies and frameworks to build diverse, 
              interactive experiences:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'JavaScript', 'React', 'Next.js', 'Three.js',
                'Canvas API', 'WebGL', 'D3.js', 'Node.js',
                'Python', 'CSS3', 'HTML5', 'Tailwind CSS',
                'Framer Motion', 'p5.js', 'Chart.js', 'API Integration'
              ].map((tech) => (
                <div key={tech} className="bg-gray-50 px-3 py-2 rounded-lg text-center text-sm font-medium text-gray-700">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Summer Goals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">90</div>
                <div className="text-green-100 text-sm">Projects Goal</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-green-100 text-sm">Months of Summer</div>
              </div>
              <div className="text-4xl font-bold mb-2 text-center">
                <div>10+</div>
                <div className="text-green-100 text-sm">Project Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">∞</div>
                <div className="text-green-100 text-sm">Possibilities</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Inspiration Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="bg-purple-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Inspiration & Philosophy</h2>
            <blockquote className="text-xl italic text-gray-700 mb-6 text-center border-l-4 border-purple-400 pl-6">
              "The expert in anything was once a beginner who refused to give up."
            </blockquote>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p className="mb-4">
                This challenge is inspired by the belief that consistent daily practice, combined with 
                public accountability, can transform anyone's skills dramatically. It's not about being 
                the smartest person in the room—it's about being the most persistent.
              </p>
              <p>
                Every project teaches something new, whether it's a technical skill, a design principle, 
                or simply the discipline of finishing what you start. The goal isn't to create perfect 
                code, but to create consistently and learn from every iteration.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Own Challenge?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The journey of a thousand miles begins with a single step. Your journey of becoming 
              an expert developer begins with a single project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Explore All Projects
              </Link>
              <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Follow the Journey
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 