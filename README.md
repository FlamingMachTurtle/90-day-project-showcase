# 90-Day Interactive Project Showcase

A dynamic website to showcase 90 unique projects (1 per day) with interactive demonstrations embedded directly in the site. Built with Next.js, featuring a modern design and smooth user experience.

## 🎯 Project Overview

This is a **living showcase** that grows daily with new interactive projects. The goal is to build a compelling portfolio where visitors can actually **use** each project rather than just read about them.

### Current Status
- **Projects Completed**: 3/90
- **Current Day**: 3
- **Technologies Used**: 17+
- **Total Hours**: 25+
- **Security**: ✅ Password protected with smart rate limiting

## ✨ Features

### Core Features
- **Interactive Project Demos**: Each project is fully functional and usable in the browser
- **Real-time Progress Tracking**: Visual progress bars and statistics
- **Advanced Filtering**: Search by title, tags, technologies, and more
- **Responsive Design**: Optimized for all devices and screen sizes
- **Smooth Animations**: Powered by Framer Motion for engaging interactions
- **"Surprise Me" Button**: Discover random projects with smooth scrolling highlight
- **Secure Authentication**: Password protection with smart rate limiting and session management

### Project Categories
- 🎮 **Games**: Interactive games and playable experiences
- 📊 **Data Visualization**: Interactive charts and data explorations
- 🛠️ **Utilities**: Practical tools and applications
- 🎨 **Art & Creative**: Visual experiments and creative coding
- 🔬 **Experiments**: Technical demos and proof-of-concepts

## 🛠️ Technical Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library with hooks and context
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth interactions

### Interactive Technologies
- **Three.js** - 3D graphics and WebGL
- **Canvas API** - 2D graphics and animations
- **p5.js** - Creative coding library
- **D3.js** - Data visualization
- **Chart.js** - Chart and graph library

### Development Tools
- **TypeScript** - Type safety (optional)
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

### Security Features
- **Password Authentication** - Single password protection
- **bcryptjs** - Secure password hashing
- **iron-session** - Encrypted session management
- **Smart Rate Limiting** - Progressive cooldowns (5min → 30min → 2hr → 24hr)
- **Session Timeout** - Auto-logout after 24 hours
- **Brute Force Protection** - IP-based attempt tracking

## 📁 Project Structure

```
my-90-day-showcase/
├── src/
│   ├── app/
│   │   ├── page.js                 # Homepage
│   │   ├── layout.js               # Root layout
│   │   ├── globals.css            # Global styles
│   │   ├── project/
│   │   │   └── [day]/
│   │   │       └── page.js        # Individual project pages
│   │   ├── games/
│   │   │   └── page.js            # Games category page
│   │   └── about/
│   │       └── page.js            # About page
│   ├── components/
│   │   ├── ProjectCard.js         # Project card component
│   │   ├── ProjectDemo.js         # Interactive demo component
│   │   ├── FilterBar.js           # Search and filter component
│   │   └── ProgressTracker.js     # Progress visualization
│   ├── data/
│   │   └── projects.json          # Project metadata
│   └── lib/
│       └── utils.js               # Utility functions
├── public/
│   ├── thumbnails/                # Project thumbnail images
│   └── projects/                  # Project assets
└── package.json                   # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-90-day-showcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up authentication**
   Create a `.env.local` file in the project root:
   ```bash
   # Change these values for security!
   AUTH_PASSWORD=your-secure-password-here
   SESSION_SECRET=your-super-secret-session-key-at-least-32-characters-long
   SESSION_TIMEOUT=86400000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`
   Enter your password from the `.env.local` file to access the portfolio

### Build for Production

```bash
npm run build
npm start
```

## 📝 Adding New Projects

### Daily Workflow

1. **Create project files**
   ```bash
   mkdir public/projects/day-X
   # Add your project files here
   ```

2. **Add thumbnail**
   ```bash
   # Add thumbnail image to public/thumbnails/dayX.png
   ```

3. **Update projects.json**
   ```json
   {
     "day": X,
     "title": "Project Title",
     "date": "2025-01-XX",
     "tags": ["tag1", "tag2"],
     "technologies": ["React", "Canvas API"],
     "description": "Project description...",
     "timeSpent": "X hours",
     "githubUrl": "https://github.com/user/project-X",
     "liveDemo": true,
     "thumbnail": "/thumbnails/dayX.png",
     "featured": false
   }
   ```

4. **Test and deploy**
   ```bash
   npm run build
   git add .
   git commit -m "Add Day X: Project Title"
   git push
   ```

### Project Templates

The system supports various project types:

- **Canvas Projects**: 2D animations and games
- **Three.js Projects**: 3D graphics and experiences  
- **React Components**: Interactive UI components
- **Data Visualizations**: Charts and data explorations
- **Utility Applications**: Practical tools and calculators

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb)
- **Secondary**: Purple (#7c3aed)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Headings**: System fonts with varying weights
- **Body**: -apple-system, BlinkMacSystemFont, 'Segoe UI'
- **Code**: Menlo, Monaco, 'Courier New'

### Components
- **Cards**: Rounded corners, subtle shadows, hover animations
- **Buttons**: Gradient backgrounds, smooth transitions
- **Inputs**: Clean borders, focus states, validation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Deploy automatically on every push
3. Custom domain configuration available

### Netlify Alternative
1. Build command: `npm run build`
2. Publish directory: `out` (if using static export)
3. Environment variables configuration

## 📊 Success Metrics

### User Experience Goals
- ✅ Site loads in under 3 seconds
- ✅ All demos work on mobile devices
- ✅ Search/filter responds instantly
- ✅ Intuitive navigation and fast browsing
- ✅ Engaging animations and interactions

### Technical Goals
- ✅ Clean, maintainable code structure
- ✅ Responsive design for all screen sizes
- ✅ SEO optimized with proper meta tags
- ✅ Accessibility compliance (WCAG 2.1)
- ✅ Performance optimized (Lighthouse 90+)

## 🤝 Contributing

This is a personal challenge project, but feedback and suggestions are welcome!

1. **Report Issues**: Use GitHub Issues for bugs or suggestions
2. **Feature Requests**: Open a discussion for new ideas
3. **Pull Requests**: Small improvements and fixes are appreciated

## 📚 Learning Resources

### Inspiration
- [100 Days of Code](https://www.100daysofcode.com/)
- [Creative Coding](https://www.openprocessing.org/)
- [Codepen](https://codepen.io/)

### Technical References
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Challenge Philosophy

> "The expert in anything was once a beginner who refused to give up."

This challenge is about:
- **Consistency** over perfection
- **Learning** through building
- **Sharing** the journey publicly
- **Inspiring** others to start their own challenges

---

**Built with ❤️ and lots of ☕ during the 90-day challenge**

*Last updated: January 2025*
