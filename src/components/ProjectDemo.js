import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Three.js to avoid SSR issues
const THREE = dynamic(() => import('three'), { ssr: false });

const ProjectDemo = ({ project }) => {
  const demoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoType, setDemoType] = useState('placeholder');
  const gameInstanceRef = useRef(null);
  const [ThreeJS, setThreeJS] = useState(null);

  useEffect(() => {
    // Load Three.js dynamically
    if (project?.day === 3) {
      import('three').then(THREE => {
        setThreeJS(THREE);
      }).catch(err => {
        console.error('Failed to load Three.js:', err);
        setError('Failed to load 3D graphics library');
      });
    }
  }, [project?.day]);

  useEffect(() => {
    if (!project) return;

    // Check if this is an external demo
    if (project.externalDemo) {
      setIsLoading(false);
      return;
    }

    // Only load internal demos
    if (project.liveDemo) {
      loadDemo();
    }
  }, [project]);

  const loadDemo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, we only have the particle demo as an internal demo
      if (project.day === 1) {
        await loadParticleDemo();
      } else {
        throw new Error('Demo not available');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load demo:', err);
      setError('Failed to load interactive demo: ' + err.message);
      setIsLoading(false);
    }
  };

  const loadParticleDemo = async () => {
    if (!demoRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const updateCanvasSize = () => {
      canvas.width = demoRef.current.clientWidth;
      canvas.height = 400;
      canvas.style.width = '100%';
      canvas.style.height = '400px';
    };
    
    updateCanvasSize();
    canvas.style.border = '1px solid #e5e7eb';
    canvas.style.borderRadius = '8px';
    
    demoRef.current.appendChild(canvas);
    
    // Particle system
    const particles = [];
    const numParticles = 50;
    let animationFrameId;
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: Math.random() * 5 + 2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup function
    canvas.cleanup = () => {
      cancelAnimationFrame(animationFrameId);
    };
  };

  if (!project || !project.liveDemo) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-2">📱 Interactive Demo Not Available</div>
        <p className="text-sm text-gray-600">
          This project doesn't have a live demo component yet.
        </p>
      </div>
    );
  }

  // Handle external demos
  if (project.externalDemo) {
    return (
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 text-center border border-blue-200">
          <div className="text-blue-600 mb-3">🌐 External Demo Available</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{project.description}</p>
          <div className="space-y-3">
            <a 
              href={project.externalDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🚀 Launch Demo
            </a>
            <div className="text-xs text-gray-500">
              Opens in a new tab as a standalone application
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle internal demos
  return (
    <div className="relative" ref={demoRef}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-500">Loading demo...</div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProjectDemo; 