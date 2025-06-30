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
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p className="mb-4">
                In January 2025, I embarked on an ambitious journey: to build 90 unique, interactive 
                projects in 90 consecutive days. This wasn't just about coding—it was about pushing 
                the boundaries of creativity, learning new technologies, and proving that consistent 
                daily practice can transform anyone into a skilled developer.
              </p>
              <p className="mb-4">
                Each project had to be <strong>interactive</strong>—visitors can actually use them, 
                not just read about them. From particle physics simulations to 3D games, from data 
                visualizations to useful utilities, every project represents a day of focused learning 
                and building.
              </p>
              <p>
                The goal wasn't perfection, but progress. Some projects took 2 hours, others took 8. 
                Some were simple experiments, others were complex applications. What mattered was 
                showing up every single day and creating something new.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Challenge Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">One Project Per Day</h4>
                    <p className="text-gray-600 text-sm">Build and complete one interactive project every single day for 90 days.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Must Be Interactive</h4>
                    <p className="text-gray-600 text-sm">Visitors must be able to use, play, or interact with each project.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">No Skipping Days</h4>
                    <p className="text-gray-600 text-sm">Consistency is key. Missing a day means starting over.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Share Everything</h4>
                    <p className="text-gray-600 text-sm">All projects must be publicly accessible with source code available.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Document the Journey</h4>
                    <p className="text-gray-600 text-sm">Track time spent, technologies learned, and challenges faced.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Focus on Learning</h4>
                    <p className="text-gray-600 text-sm">Try new technologies, techniques, and creative approaches regularly.</p>
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
            <h2 className="text-3xl font-bold mb-8 text-center">Challenge Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">90</div>
                <div className="text-green-100 text-sm">Days Total</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-green-100 text-sm">Completed So Far</div>
              </div>
              <div className="text-4xl font-bold mb-2 text-center">
                <div>400+</div>
                <div className="text-green-100 text-sm">Hours Coded</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-green-100 text-sm">Technologies Used</div>
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