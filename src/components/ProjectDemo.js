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
        
        // Clean up weather visualizer
        const weatherContainer = demoRef.current.querySelector('div');
        if (weatherContainer && weatherContainer.cleanup) {
          weatherContainer.cleanup();
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

  const loadWeatherVisualizer = async () => {
    if (!demoRef.current) return;
    
    // Create main container
    const container = document.createElement('div');
    container.className = 'p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg';
    container.innerHTML = `
      <div class="space-y-6">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Interactive Weather Data Visualizer</h3>
          <p class="text-gray-600">Real-time weather simulation with interactive charts and controls</p>
        </div>
        
        <!-- Current Weather Display -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm text-center">
            <div id="temp-display" class="text-3xl font-bold text-blue-600">22°C</div>
            <div class="text-sm text-gray-500">Temperature</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm text-center">
            <div id="humidity-display" class="text-3xl font-bold text-green-600">65%</div>
            <div class="text-sm text-gray-500">Humidity</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm text-center">
            <div id="wind-display" class="text-3xl font-bold text-yellow-600">15km/h</div>
            <div class="text-sm text-gray-500">Wind Speed</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm text-center">
            <div id="pressure-display" class="text-3xl font-bold text-purple-600">1013mb</div>
            <div class="text-sm text-gray-500">Pressure</div>
          </div>
        </div>
        
        <!-- Interactive Controls -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h4 class="text-lg font-semibold mb-3">Weather Controls</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select id="location-select" class="w-full p-2 border border-gray-300 rounded-md">
                <option value="london">London, UK</option>
                <option value="newyork">New York, USA</option>
                <option value="tokyo">Tokyo, Japan</option>
                <option value="sydney">Sydney, Australia</option>
                <option value="paris">Paris, France</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select id="period-select" class="w-full p-2 border border-gray-300 rounded-md">
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <button id="data-mode-btn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2">
              🌐 Use Real Weather Data
            </button>
            <button id="simulate-btn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2">
              🌦️ Simulate Weather
            </button>
            <button id="auto-update-btn" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              ⚡ Auto Update
            </button>
          </div>
        </div>
        
        <!-- Temperature Chart -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h4 class="text-lg font-semibold mb-3">Temperature Trend</h4>
          <div id="temp-chart" class="w-full h-64"></div>
        </div>
        
        <!-- Precipitation Chart -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h4 class="text-lg font-semibold mb-3">Precipitation & Humidity</h4>
          <div id="precip-chart" class="w-full h-48"></div>
        </div>
      </div>
    `;
    
    demoRef.current.appendChild(container);
    
        // Weather data simulation
    let currentWeather = {
      temp: 22,
      humidity: 65,
      windSpeed: 15,
      pressure: 1013
    };

    let isAutoUpdating = false;
    let autoUpdateInterval;
    let useRealData = false;
    
    // WeatherAPI.com configuration
    const API_KEY = 'ef3d2a7d17934063992224134251706';
    const API_BASE_URL = 'https://api.weatherapi.com/v1';
    
    // Location data with coordinates
    const locationData = {
      london: { temp: 15, humidity: 75, windSpeed: 12, pressure: 1015, lat: 51.5074, lon: -0.1278, name: 'London' },
      newyork: { temp: 18, humidity: 60, windSpeed: 15, pressure: 1012, lat: 40.7128, lon: -74.0060, name: 'New York' },
      tokyo: { temp: 25, humidity: 70, windSpeed: 8, pressure: 1018, lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
      sydney: { temp: 22, humidity: 55, windSpeed: 20, pressure: 1020, lat: -33.8688, lon: 151.2093, name: 'Sydney' },
      paris: { temp: 16, humidity: 65, windSpeed: 10, pressure: 1014, lat: 48.8566, lon: 2.3522, name: 'Paris' }
    };
    
    // Real weather API functions
    async function fetchCurrentWeather(location) {
      if (!API_KEY || API_KEY === 'demo_key') {
        showApiKeyWarning();
        return null;
      }
      
      try {
        const locationInfo = locationData[location];
        const response = await fetch(
          `${API_BASE_URL}/current.json?key=${API_KEY}&q=${locationInfo.lat},${locationInfo.lon}&aqi=no`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return {
          temp: Math.round(data.current.temp_c),
          humidity: data.current.humidity,
          windSpeed: Math.round(data.current.wind_kph),
          pressure: Math.round(data.current.pressure_mb)
        };
      } catch (error) {
        console.error('Error fetching current weather:', error);
        console.error('API URL:', `${API_BASE_URL}/current.json?key=${API_KEY}&q=${locationInfo.lat},${locationInfo.lon}&aqi=no`);
        
        if (error.message.includes('401') || error.message.includes('403')) {
          showError('API Key Error: Please check if your WeatherAPI.com key is valid and activated.');
        } else if (error.message.includes('429')) {
          showError('Rate Limit Error (429): Too many API calls. Please wait a moment and try again.');
        } else {
          showError(`Failed to fetch current weather data: ${error.message}. Using simulated data.`);
        }
        return null;
      }
    }
    
    function showApiKeyWarning() {
      const warning = document.createElement('div');
      warning.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fef3c7;
        border: 2px solid #f59e0b;
        color: #92400e;
        padding: 15px;
        border-radius: 10px;
        max-width: 350px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      `;
      warning.innerHTML = `
        <strong>⚠️ Invalid API Key</strong><br>
        The current API key is invalid. To use real weather data:<br>
        1. Sign up at <a href="https://www.weatherapi.com/" target="_blank">WeatherAPI.com</a><br>
        2. Get your API key from your account dashboard<br>
        3. Replace the API key in the code<br>
        4. Enjoy 1M free calls per month!<br>
        <small>Note: Free plan includes current weather & 7-day history</small><br>
        <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; border: none; background: #f59e0b; color: white; border-radius: 5px; cursor: pointer;">Close</button>
      `;
      document.body.appendChild(warning);
      
      setTimeout(() => {
        if (warning.parentElement) {
          warning.remove();
        }
      }, 15000);
    }
    
    function showError(message) {
      const error = document.createElement('div');
      error.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fef2f2;
        border: 2px solid #ef4444;
        color: #dc2626;
        padding: 15px;
        border-radius: 10px;
        max-width: 300px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      `;
      error.innerHTML = `
        <strong>❌ Error</strong><br>
        ${message}<br>
        <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; border: none; background: #ef4444; color: white; border-radius: 5px; cursor: pointer;">Close</button>
      `;
      document.body.appendChild(error);
      
      setTimeout(() => {
        if (error.parentElement) {
          error.remove();
        }
      }, 6000);
    }
    
    // Generate sample weather data
    function generateWeatherData(days = 7) {
      const data = [];
      const now = new Date();
      
      for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (days - 1 - i));
        
        // Simulate seasonal temperature variation
        const baseTemp = 20 + Math.sin((date.getMonth() / 12) * Math.PI * 2) * 10;
        const dailyVariation = Math.random() * 10 - 5;
        const temp = Math.round(baseTemp + dailyVariation);
        
        data.push({
          date: date,
          temp: temp,
          humidity: Math.round(40 + Math.random() * 40),
          precipitation: Math.random() * 20,
          windSpeed: Math.round(5 + Math.random() * 25),
          pressure: Math.round(990 + Math.random() * 40)
        });
      }
      
      return data;
    }
    
    // Create interactive charts using canvas
    function createTemperatureChart(data) {
      const chartContainer = document.getElementById('temp-chart');
      chartContainer.innerHTML = '';
      
      const canvas = document.createElement('canvas');
      canvas.width = chartContainer.clientWidth;
      canvas.height = 256;
      canvas.style.width = '100%';
      canvas.style.height = '256px';
      
      const ctx = canvas.getContext('2d');
      
      // Chart dimensions
      const padding = 40;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;
      
      // Find min/max temperatures
      const temps = data.map(d => d.temp);
      const minTemp = Math.min(...temps) - 2;
      const maxTemp = Math.max(...temps) + 2;
      
      // Clear canvas
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      
      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        // Temperature labels
        const temp = Math.round(maxTemp - (maxTemp - minTemp) * (i / 5));
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(temp + '°C', padding - 10, y + 4);
      }
      
      // Draw temperature line
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - ((point.temp - minTemp) / (maxTemp - minTemp)) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw data points
      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - ((point.temp - minTemp) / (maxTemp - minTemp)) * chartHeight;
        
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Date labels
        ctx.fillStyle = '#64748b';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        const dateStr = point.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        ctx.fillText(dateStr, x, canvas.height - 10);
      });
      
      chartContainer.appendChild(canvas);
      
      // Add hover interaction
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Find closest data point
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        data.forEach((point, index) => {
          const x = (padding + (chartWidth / (data.length - 1)) * index) * (canvas.width / rect.width);
          const distance = Math.abs(mouseX * (canvas.width / rect.width) - x);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        
        // Show tooltip
        canvas.title = `${data[closestIndex].date.toLocaleDateString()}: ${data[closestIndex].temp}°C`;
      });
    }
    
    function createPrecipitationChart(data) {
      const chartContainer = document.getElementById('precip-chart');
      chartContainer.innerHTML = '';
      
      const canvas = document.createElement('canvas');
      canvas.width = chartContainer.clientWidth;
      canvas.height = 192;
      canvas.style.width = '100%';
      canvas.style.height = '192px';
      
      const ctx = canvas.getContext('2d');
      
      // Chart dimensions
      const padding = 40;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;
      
      // Clear canvas
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw precipitation bars
      const barWidth = chartWidth / data.length * 0.6;
      
      data.forEach((point, index) => {
        const x = padding + (chartWidth / data.length) * index + (chartWidth / data.length - barWidth) / 2;
        const barHeight = (point.precipitation / 20) * chartHeight * 0.7;
        const y = padding + chartHeight - barHeight;
        
        // Precipitation bar
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Humidity line point
        const humidityY = padding + chartHeight - (point.humidity / 100) * chartHeight * 0.3;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x + barWidth / 2, humidityY, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Legend
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('📊 Precipitation (mm)', padding, 20);
      ctx.fillText('💧 Humidity (%)', padding + 150, 20);
      
      // Add Y-axis labels
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        // Left Y-axis labels (Precipitation)
        const precipValue = Math.round(20 - (20 * i / 4));
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(precipValue + 'mm', padding - 10, y + 4);
        
        // Right Y-axis labels (Humidity)
        const humidityValue = Math.round(100 - (100 * i / 4));
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(humidityValue + '%', canvas.width - padding + 10, y + 4);
      }
      
      chartContainer.appendChild(canvas);
    }
    
    function updateCurrentWeather() {
      // Simulate realistic weather changes
      currentWeather.temp += (Math.random() - 0.5) * 2;
      currentWeather.temp = Math.max(-10, Math.min(40, currentWeather.temp));
      
      currentWeather.humidity += (Math.random() - 0.5) * 5;
      currentWeather.humidity = Math.max(20, Math.min(100, currentWeather.humidity));
      
      currentWeather.windSpeed += (Math.random() - 0.5) * 3;
      currentWeather.windSpeed = Math.max(0, Math.min(50, currentWeather.windSpeed));
      
      currentWeather.pressure += (Math.random() - 0.5) * 2;
      currentWeather.pressure = Math.max(980, Math.min(1040, currentWeather.pressure));
      
      // Update displays
      document.getElementById('temp-display').textContent = Math.round(currentWeather.temp) + '°C';
      document.getElementById('humidity-display').textContent = Math.round(currentWeather.humidity) + '%';
      document.getElementById('wind-display').textContent = Math.round(currentWeather.windSpeed) + 'km/h';
      document.getElementById('pressure-display').textContent = Math.round(currentWeather.pressure) + 'mb';
    }
    
    // Initial chart creation
    let weatherData = generateWeatherData(7);
    createTemperatureChart(weatherData);
    createPrecipitationChart(weatherData);
    
    // Event listeners
    document.getElementById('data-mode-btn').addEventListener('click', async (e) => {
      useRealData = !useRealData;
      
      if (useRealData) {
        e.target.innerHTML = '🌦️ Use Simulated Data';
        e.target.className = 'bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors mr-2';
        
        // Try to fetch real weather data
        const location = document.getElementById('location-select').value;
        const realWeather = await fetchCurrentWeather(location);
        if (realWeather) {
          currentWeather = realWeather;
          updateCurrentWeather();
        } else {
          // Fallback to simulated data
          useRealData = false;
          e.target.innerHTML = '🌐 Use Real Weather Data';
          e.target.className = 'bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2';
        }
      } else {
        e.target.innerHTML = '🌐 Use Real Weather Data';
        e.target.className = 'bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2';
        
        // Switch back to simulated data
        const location = document.getElementById('location-select').value;
        const locationInfo = locationData[location];
        currentWeather = { ...locationInfo };
        updateCurrentWeather();
      }
    });

    document.getElementById('simulate-btn').addEventListener('click', async () => {
      if (useRealData) {
        // Fetch fresh real data
        const location = document.getElementById('location-select').value;
        const realWeather = await fetchCurrentWeather(location);
        if (realWeather) {
          currentWeather = realWeather;
          updateCurrentWeather();
        }
      } else {
        // Generate new simulated data
        const period = parseInt(document.getElementById('period-select').value);
        weatherData = generateWeatherData(period);
        createTemperatureChart(weatherData);
        createPrecipitationChart(weatherData);
        updateCurrentWeather();
      }
    });
    
    document.getElementById('auto-update-btn').addEventListener('click', (e) => {
      isAutoUpdating = !isAutoUpdating;
      
      if (isAutoUpdating) {
        e.target.textContent = '⏸️ Stop Auto Update';
        e.target.className = 'bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors';
        
        autoUpdateInterval = setInterval(async () => {
          if (useRealData) {
            // Fetch fresh real weather data
            const location = document.getElementById('location-select').value;
            const realWeather = await fetchCurrentWeather(location);
            if (realWeather) {
              currentWeather = realWeather;
              updateCurrentWeather();
            }
          } else {
            // Update simulated weather
            updateCurrentWeather();
          }
        }, 2000);
      } else {
        e.target.textContent = '⚡ Auto Update';
        e.target.className = 'bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors';
        
        if (autoUpdateInterval) {
          clearInterval(autoUpdateInterval);
        }
      }
    });
    
    document.getElementById('location-select').addEventListener('change', async (e) => {
      const location = e.target.value;
      
      if (useRealData) {
        // Fetch real weather data for new location
        const realWeather = await fetchCurrentWeather(location);
        if (realWeather) {
          currentWeather = realWeather;
          updateCurrentWeather();
        }
      } else {
        // Use simulated data
        const locationInfo = locationData[location];
        currentWeather = { ...locationInfo };
        updateCurrentWeather();
        
        const period = parseInt(document.getElementById('period-select').value);
        weatherData = generateWeatherData(period);
        createTemperatureChart(weatherData);
        createPrecipitationChart(weatherData);
      }
    });
    
    document.getElementById('period-select').addEventListener('change', () => {
      const period = parseInt(document.getElementById('period-select').value);
      weatherData = generateWeatherData(period);
      createTemperatureChart(weatherData);
      createPrecipitationChart(weatherData);
    });
    
    // Cleanup function for auto-update
    const cleanup = () => {
      if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
      }
    };
    
    // Store cleanup function for later use
    container.cleanup = cleanup;
  };

  const loadReactDemo = async () => {
    setDemoType('react');
    
    if (!demoRef.current) return;
    
    if (project.day === 2) {
      // Weather Data Visualizer - Interactive implementation
      await loadWeatherVisualizer();
    } else {
      // Generic interactive demo
      const demoContainer = document.createElement('div');
      demoContainer.className = 'p-6 bg-gray-50 rounded-lg';
      
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
      
      demoRef.current.appendChild(demoContainer);
    }
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