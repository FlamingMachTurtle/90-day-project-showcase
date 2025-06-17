import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ProjectDemo = ({ project }) => {
  const demoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoType, setDemoType] = useState('placeholder');
  const gameInstanceRef = useRef(null); // Track if game is already created

  useEffect(() => {
    if (!project || !project.liveDemo) {
      setIsLoading(false);
      return;
    }

    // Prevent multiple instances
    if (gameInstanceRef.current) {
      return;
    }

    // Clear any existing content first
    if (demoRef.current) {
      demoRef.current.innerHTML = '';
    }

    gameInstanceRef.current = true;
    loadDemo();

    // Cleanup function
    return () => {
      if (demoRef.current) {
        // Clean up Three.js or other resources
        const canvas = demoRef.current.querySelector('canvas');
        if (canvas && canvas.cleanup) {
          canvas.cleanup();
        }
        // Clear the demo container
        demoRef.current.innerHTML = '';
      }
      gameInstanceRef.current = null;
    };
  }, [project]);

  const loadDemo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Determine demo type based on project technologies
      const technologies = project.technologies.map(tech => tech.toLowerCase());
      
      if (technologies.includes('three.js')) {
        await loadThreeJSDemo();
      } else if (technologies.includes('p5.js') || technologies.includes('p5')) {
        await loadP5Demo();
      } else if (technologies.includes('canvas api') || technologies.includes('canvas')) {
        await loadCanvasDemo();
      } else {
        await loadReactDemo();
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load demo:', err);
      setError('Failed to load interactive demo');
      setIsLoading(false);
    }
  };

  const loadThreeJSDemo = async () => {
    setDemoType('threejs');
    
    // Example Three.js demo based on project day
    const THREE = await import('three');
    
    if (!demoRef.current) return;
    
    // Check if canvas already exists
    if (demoRef.current.querySelector('canvas[data-snake-game="true"]')) {
      console.log('Snake game canvas already exists, skipping creation');
      return;
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, demoRef.current.clientWidth / demoRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
          renderer.setSize(demoRef.current.clientWidth, demoRef.current.clientHeight);
      renderer.setClearColor(0x222222);
      
      // Make canvas focusable for keyboard input
      renderer.domElement.tabIndex = 0;
      renderer.domElement.style.outline = 'none';
      renderer.domElement.style.cursor = 'pointer';
      renderer.domElement.setAttribute('data-snake-game', 'true'); // Unique identifier
      
      demoRef.current.appendChild(renderer.domElement);
      
      // Focus the canvas immediately
      renderer.domElement.focus();
    
    // Create demo content based on project
    if (project.day === 3) {
      // Snake Game 3D - Full Implementation
      const GRID_SIZE = 20;
      const CELL_SIZE = 0.5;
      
      // Game state
      let snake = [{ x: 10, y: 10, z: 0 }];
      let food = { x: 15, y: 15, z: 0 };
      let direction = { x: 1, y: 0, z: 0 };
      let gameRunning = true;
      let score = 0;
      
      // Materials
      const snakeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
      const headMaterial = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
      const foodMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
      const gridMaterial = new THREE.LineBasicMaterial({ color: 0x444444 });
      
      // Geometries
      const boxGeometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
      const sphereGeometry = new THREE.SphereGeometry(CELL_SIZE * 0.4, 8, 8);
      
      // Snake segments
      let snakeSegments = [];
      let foodMesh;
      
      // Create grid
      const gridGroup = new THREE.Group();
      for (let i = 0; i <= GRID_SIZE; i++) {
        const geometryH = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-GRID_SIZE/2 * CELL_SIZE, (i - GRID_SIZE/2) * CELL_SIZE, 0),
          new THREE.Vector3(GRID_SIZE/2 * CELL_SIZE, (i - GRID_SIZE/2) * CELL_SIZE, 0)
        ]);
        const geometryV = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3((i - GRID_SIZE/2) * CELL_SIZE, -GRID_SIZE/2 * CELL_SIZE, 0),
          new THREE.Vector3((i - GRID_SIZE/2) * CELL_SIZE, GRID_SIZE/2 * CELL_SIZE, 0)
        ]);
        gridGroup.add(new THREE.Line(geometryH, gridMaterial));
        gridGroup.add(new THREE.Line(geometryV, gridMaterial));
      }
      scene.add(gridGroup);
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);
      
      // Camera position
      camera.position.set(0, 0, 15);
      camera.lookAt(0, 0, 0);
      
      // Game functions
      function createSnakeSegment(x, y, z, isHead = false) {
        const segment = new THREE.Mesh(boxGeometry, isHead ? headMaterial : snakeMaterial);
        segment.position.set(
          (x - GRID_SIZE/2) * CELL_SIZE,
          (y - GRID_SIZE/2) * CELL_SIZE,
          z * CELL_SIZE
        );
        scene.add(segment);
        return segment;
      }
      
      function createFood(x, y, z) {
        const food = new THREE.Mesh(sphereGeometry, foodMaterial);
        food.position.set(
          (x - GRID_SIZE/2) * CELL_SIZE,
          (y - GRID_SIZE/2) * CELL_SIZE,
          z * CELL_SIZE
        );
        scene.add(food);
        return food;
      }
      
      function generateFood() {
        let newFood;
        do {
          newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
            z: 0
          };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
      }
      
      function updateGame() {
        if (!gameRunning) return;
        
        // Calculate next head position
        const head = { ...snake[0] };
        head.x += direction.x;
        head.y += direction.y;
        head.z += direction.z;
        
        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          gameRunning = false;
          console.log('Game Over: Wall collision');
          showGameOverScreen('Wall Collision!');
          return;
        }
        
        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
          gameRunning = false;
          console.log('Game Over: Self collision');
          showGameOverScreen('You hit yourself!');
          return;
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          score += 10;
          food = generateFood();
          if (foodMesh) scene.remove(foodMesh);
          foodMesh = createFood(food.x, food.y, food.z);
          console.log('Food eaten! Score:', score);
        } else {
          snake.pop();
        }
        
        // Update visual snake - remove old segments first
        snakeSegments.forEach(segment => {
          if (segment.parent) {
            segment.parent.remove(segment);
          }
        });
        snakeSegments = [];
        
        // Create new segments
        snake.forEach((segment, index) => {
          snakeSegments.push(createSnakeSegment(segment.x, segment.y, segment.z, index === 0));
        });
        
        console.log('Snake position:', snake[0], 'Direction:', direction);
      }
      
      // Initialize game
      snake.forEach((segment, index) => {
        snakeSegments.push(createSnakeSegment(segment.x, segment.y, segment.z, index === 0));
      });
      foodMesh = createFood(food.x, food.y, food.z);
      
      // Game loop
      let lastTime = 0;
      const gameSpeed = 300; // milliseconds (slower for better control)
      
      // Controls - prevent rapid direction changes
      let lastDirectionChange = 0;
      const directionChangeDelay = 100; // milliseconds
      
      const handleKeyPress = (event) => {
        event.preventDefault(); // Prevent default browser behavior
        
        const now = Date.now();
        if (now - lastDirectionChange < directionChangeDelay) {
          return; // Ignore rapid key presses
        }
        
        console.log('Key pressed:', event.code, 'Game running:', gameRunning, 'Current direction:', direction);
        
        if (!gameRunning) {
          if (event.code === 'Space') {
            restartGame();
          }
          return;
        }
        
        let newDirection = null;
        
                 switch(event.code) {
           case 'ArrowUp':
           case 'KeyW':
             // Can't go up if currently going down
             if (direction.y !== -1) {
               newDirection = { x: 0, y: 1, z: 0 };
               console.log('Direction changed to UP');
             }
             break;
           case 'ArrowDown':
           case 'KeyS':
             // Can't go down if currently going up
             if (direction.y !== 1) {
               newDirection = { x: 0, y: -1, z: 0 };
               console.log('Direction changed to DOWN');
             }
             break;
          case 'ArrowLeft':
          case 'KeyA':
            // Can't go left if currently going right
            if (direction.x !== 1) {
              newDirection = { x: -1, y: 0, z: 0 };
              console.log('Direction changed to LEFT');
            }
            break;
          case 'ArrowRight':
          case 'KeyD':
            // Can't go right if currently going left
            if (direction.x !== -1) {
              newDirection = { x: 1, y: 0, z: 0 };
              console.log('Direction changed to RIGHT');
            }
            break;
        }
        
        if (newDirection) {
          direction = newDirection;
          lastDirectionChange = now;
        }
      };
      
      // Add event listeners to the canvas instead of document
      renderer.domElement.addEventListener('keydown', handleKeyPress);
      
      // Add click handler to focus canvas
      const handleCanvasClick = () => {
        renderer.domElement.focus();
        console.log('Canvas focused - ready for input!');
      };
      renderer.domElement.addEventListener('click', handleCanvasClick);
      
      // Add focus/blur visual feedback
      const handleCanvasFocus = () => {
        renderer.domElement.style.border = '2px solid #3b82f6';
        console.log('Canvas focused');
      };
      const handleCanvasBlur = () => {
        renderer.domElement.style.border = '1px solid #e5e7eb';
        console.log('Canvas lost focus');
      };
      renderer.domElement.addEventListener('focus', handleCanvasFocus);
      renderer.domElement.addEventListener('blur', handleCanvasBlur);
      
      // Add instructions
      const instructions = document.createElement('div');
      instructions.innerHTML = `
        <div style="position: absolute; top: 10px; left: 10px; color: white; font-family: monospace; z-index: 100; background: rgba(0,0,0,0.8); padding: 10px; border-radius: 5px;">
          <div>Score: <span id="score">0</span></div>
          <div>Direction: <span id="direction">RIGHT</span></div>
          <div style="font-size: 12px; margin-top: 5px;">
            <strong>Click game area first, then:</strong><br/>
            🐍 Snake moves automatically<br/>
            Use WASD or Arrow keys to change direction<br/>
            Space to restart when game over
          </div>
        </div>
      `;
      demoRef.current.appendChild(instructions);

      // Game Over Screen
      function showGameOverScreen(reason) {
        // Remove existing game over screen if any
        const existingGameOver = demoRef.current.querySelector('#gameOverScreen');
        if (existingGameOver) {
          existingGameOver.remove();
        }

        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'gameOverScreen';
        gameOverScreen.innerHTML = `
          <div style="
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0,0,0,0.8); 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            z-index: 200;
            color: white;
            font-family: monospace;
            text-align: center;
          ">
            <div style="background: rgba(255,0,0,0.1); padding: 30px; border-radius: 15px; border: 2px solid #ff4444;">
              <h2 style="font-size: 36px; margin: 0 0 10px 0; color: #ff4444;">GAME OVER!</h2>
              <p style="font-size: 18px; margin: 0 0 15px 0; color: #ffaaaa;">${reason}</p>
              <div style="font-size: 24px; margin: 15px 0; color: #ffffff;">Final Score: ${score}</div>
              <button 
                id="restartBtn" 
                style="
                  background: #4CAF50; 
                  color: white; 
                  border: none; 
                  padding: 15px 30px; 
                  font-size: 18px; 
                  border-radius: 8px; 
                  cursor: pointer; 
                  font-family: monospace;
                  margin: 10px;
                  transition: background 0.3s;
                "
                onmouseover="this.style.background='#45a049'"
                onmouseout="this.style.background='#4CAF50'"
              >
                🔄 Play Again
              </button>
              <div style="font-size: 14px; margin-top: 15px; color: #cccccc;">
                Or press SPACE to restart
              </div>
            </div>
          </div>
        `;
        
        demoRef.current.appendChild(gameOverScreen);
        
        // Add click handler to restart button
        const restartBtn = gameOverScreen.querySelector('#restartBtn');
        restartBtn.addEventListener('click', restartGame);
        
        // Focus the canvas so spacebar works
        renderer.domElement.focus();
      }

      function restartGame() {
        console.log('Restarting game...');
        
        // Remove game over screen
        const gameOverScreen = demoRef.current.querySelector('#gameOverScreen');
        if (gameOverScreen) {
          gameOverScreen.remove();
        }
        
        // Reset game state
        snake = [{ x: 10, y: 10, z: 0 }];
        food = generateFood();
        direction = { x: 1, y: 0, z: 0 };
        gameRunning = true;
        score = 0;
        
        // Clear old visual elements
        snakeSegments.forEach(segment => {
          if (segment.parent) {
            segment.parent.remove(segment);
          }
        });
        if (foodMesh && foodMesh.parent) {
          foodMesh.parent.remove(foodMesh);
        }
        
        // Create new visual elements
        snakeSegments = [];
        snake.forEach((segment, index) => {
          snakeSegments.push(createSnakeSegment(segment.x, segment.y, segment.z, index === 0));
        });
        foodMesh = createFood(food.x, food.y, food.z);
        
        // Focus canvas for controls
        renderer.domElement.focus();
      }
      
      const animate = (currentTime) => {
        requestAnimationFrame(animate);
        
        if (currentTime - lastTime > gameSpeed) {
          updateGame();
          lastTime = currentTime;
          
          // Update score and direction display
          const scoreElement = document.getElementById('score');
          if (scoreElement) scoreElement.textContent = score;
          
          const directionElement = document.getElementById('direction');
          if (directionElement) {
            let dirText = 'STOPPED';
            if (direction.x === 1) dirText = 'RIGHT ➡️';
            else if (direction.x === -1) dirText = 'LEFT ⬅️';
            else if (direction.y === 1) dirText = 'UP ⬆️';
            else if (direction.y === -1) dirText = 'DOWN ⬇️';
            directionElement.textContent = dirText;
          }
        }
        
        // Add some camera rotation for visual appeal
        const time = currentTime * 0.001;
        camera.position.x = Math.sin(time * 0.1) * 2;
        camera.position.y = Math.cos(time * 0.15) * 2;
        camera.lookAt(0, 0, 0);
        
        // Animate food
        if (foodMesh) {
          foodMesh.rotation.y += 0.05;
          foodMesh.position.z = Math.sin(time * 3) * 0.1;
        }
        
        renderer.render(scene, camera);
      };
      animate(0);
      
      // Cleanup function
      const cleanup = () => {
        renderer.domElement.removeEventListener('keydown', handleKeyPress);
        renderer.domElement.removeEventListener('click', handleCanvasClick);
        renderer.domElement.removeEventListener('focus', handleCanvasFocus);
        renderer.domElement.removeEventListener('blur', handleCanvasBlur);
      };
      
      // Store cleanup function for later use
      renderer.domElement.cleanup = cleanup;
    }
  };

  const loadP5Demo = async () => {
    setDemoType('p5');
    // P5.js integration would go here
    // For now, create a simple canvas-based simulation
    await loadCanvasDemo();
  };

  const loadCanvasDemo = async () => {
    setDemoType('canvas');
    
    if (!demoRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = demoRef.current.clientWidth;
    canvas.height = 400;
    canvas.style.width = '100%';
    canvas.style.height = '400px';
    canvas.style.border = '1px solid #e5e7eb';
    canvas.style.borderRadius = '8px';
    
    demoRef.current.appendChild(canvas);
    
    if (project.day === 1) {
      // Particle Physics Sandbox
      const particles = [];
      const numParticles = 50;
      
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
        
        requestAnimationFrame(animate);
      };
      animate();
    }
    
    // Add click interaction
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Add explosion effect or interaction based on project type
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    });
  };

  const loadReactDemo = async () => {
    setDemoType('react');
    
    if (!demoRef.current) return;
    
    // Create a simple interactive React-style demo
    const demoContainer = document.createElement('div');
    demoContainer.className = 'p-6 bg-gray-50 rounded-lg';
    
    if (project.day === 2) {
      // Weather Data Visualizer example
      demoContainer.innerHTML = `
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Weather Data Visualizer</h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-blue-100 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-blue-600">22°C</div>
              <div class="text-sm text-blue-500">Temperature</div>
            </div>
            <div class="bg-green-100 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-600">65%</div>
              <div class="text-sm text-green-500">Humidity</div>
            </div>
            <div class="bg-yellow-100 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-yellow-600">15km/h</div>
              <div class="text-sm text-yellow-500">Wind Speed</div>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-sm text-gray-600 mb-2">Temperature Trend (7 days)</div>
            <div class="h-20 bg-gradient-to-r from-blue-200 via-green-200 to-yellow-200 rounded-lg flex items-end justify-around p-2">
              <div class="bg-blue-500 w-4 h-8 rounded-t"></div>
              <div class="bg-blue-400 w-4 h-12 rounded-t"></div>
              <div class="bg-green-400 w-4 h-16 rounded-t"></div>
              <div class="bg-green-500 w-4 h-14 rounded-t"></div>
              <div class="bg-yellow-400 w-4 h-18 rounded-t"></div>
              <div class="bg-yellow-500 w-4 h-16 rounded-t"></div>
              <div class="bg-orange-400 w-4 h-12 rounded-t"></div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Generic interactive demo
      demoContainer.innerHTML = `
        <div class="text-center space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">${project.title}</h3>
          <p class="text-gray-600">${project.description}</p>
          <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Interact with Demo
          </button>
        </div>
      `;
      
      const button = demoContainer.querySelector('button');
      button.addEventListener('click', () => {
        button.textContent = 'Demo Activated! 🎉';
        button.className = 'bg-green-600 text-white px-6 py-2 rounded-lg';
        setTimeout(() => {
          button.textContent = 'Interact with Demo';
          button.className = 'bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors';
        }, 2000);
      });
    }
    
    demoRef.current.appendChild(demoContainer);
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-red-600 mb-2">⚠️ Demo Error</div>
        <p className="text-sm text-red-600">{error}</p>
        <button 
          onClick={loadDemo}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span className="text-sm text-gray-600 ml-2">Loading interactive demo...</span>
          </motion.div>
        </div>
      )}
      
      <div 
        ref={demoRef} 
        className="min-h-[400px] bg-white rounded-lg border border-gray-200 overflow-hidden"
        style={{ width: '100%' }}
      />
      
      {!isLoading && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            🎮 This is a live interactive demo! Click and explore.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectDemo; 