# Mind Games - Documentation Index

Welcome to the Mind Games platform documentation. This comprehensive guide covers all aspects of the system from architecture to development practices.

## 📚 Documentation Overview

### System Documentation
- **[System Design](SYSTEM_DESIGN.md)** - Complete system architecture and design decisions
- **[Architecture Decisions](ARCHITECTURE_DECISIONS.md)** - Record of all architectural decisions (ADRs)
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference for all classes and components

### Development Documentation
- **[Development Guide](DEVELOPMENT_GUIDE.md)** - Complete guide for developers working on the project
- **[Contributing Guidelines](#contributing-guidelines)** - How to contribute to the project
- **[Code Style Guide](#code-style-guide)** - Coding standards and best practices

## 🏗️ Architecture Overview

The Mind Games platform is built using modern web technologies with a focus on performance, maintainability, and developer experience:

- **Frontend**: Astro 5 with TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Package Manager**: Bun (fast JavaScript runtime and package manager)
- **Architecture Pattern**: Abstract Base Class for games
- **State Management**: Local component state with localStorage

## 🎮 Current Games

### Implemented Games
- **Math Flow** - Mental arithmetic with memory challenges
- **Simon Says** - Memory and pattern recognition game

### Game Architecture
All games extend the `BaseGameClass` which provides:
- Game state management
- Timer functionality
- Score calculation
- UI update methods
- Event handling

## 🚀 Quick Start

### For Developers
```bash
# Clone and setup
git clone <repository-url>
cd mind-games
bun install
bun run dev
```

### For Contributors
1. Read the [Development Guide](DEVELOPMENT_GUIDE.md)
2. Check [Architecture Decisions](ARCHITECTURE_DECISIONS.md)
3. Review [API Documentation](API_DOCUMENTATION.md)
4. Follow the contribution guidelines below

## 📋 Project Structure

```
mind-games/
├── docs/                    # All documentation
├── src/
│   ├── components/          # Reusable Astro components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Route pages
│   ├── utils/              # Game classes and utilities
│   └── styles/             # Global styles
├── public/                 # Static assets
└── config files            # Build and tool configurations
```

## 🎯 Key Features

### Performance
- **Fast Loading**: Static site generation with selective hydration
- **Optimized Assets**: Automatic image optimization and code splitting
- **Minimal JavaScript**: Only load what's needed for each game

### Developer Experience
- **TypeScript**: Full type safety across the codebase
- **Hot Reload**: Instant updates during development
- **Component System**: Reusable UI components
- **Documentation**: Comprehensive guides and API docs

### User Experience
- **Responsive Design**: Works on all devices
- **Consistent UI**: Unified design system across games
- **Performance Tracking**: Score and progress monitoring
- **Accessibility**: Screen reader support and keyboard navigation

## 📊 System Metrics

### Performance Targets
- **Page Load Time**: < 2 seconds
- **Game Interaction Latency**: < 100ms
- **Bundle Size**: < 50KB per game
- **Lighthouse Score**: > 90

### Quality Metrics
- **Test Coverage**: > 80%
- **TypeScript Coverage**: 100%
- **Accessibility Score**: AAA compliance
- **Browser Support**: Modern browsers (ES2020+)

## 🔧 Development Workflow

### Branch Strategy
- `main` - Production ready code
- `develop` - Integration branch
- `feature/*` - Feature development
- `hotfix/*` - Critical fixes

### Code Quality
- **ESLint**: Code linting and style enforcement
- **Prettier**: Automatic code formatting
- **TypeScript**: Static type checking
- **Testing**: Unit, integration, and E2E tests

### Review Process
1. Create feature branch
2. Implement with tests
3. Update documentation
4. Submit pull request
5. Code review
6. Merge to develop

## 📖 Documentation Standards

### File Organization
- **README.md**: Project overview and quick start
- **SYSTEM_DESIGN.md**: Architecture and design decisions
- **API_DOCUMENTATION.md**: Complete API reference
- **DEVELOPMENT_GUIDE.md**: Developer guidelines and workflows
- **ARCHITECTURE_DECISIONS.md**: ADR records

### Documentation Principles
- **Comprehensive**: Cover all aspects thoroughly
- **Up-to-date**: Keep synchronized with code changes
- **Accessible**: Clear language and good structure
- **Practical**: Include examples and use cases

## 🤝 Contributing Guidelines

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Read the development guide
4. Make your changes
5. Add tests if applicable
6. Update documentation
7. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write self-documenting code
- Include JSDoc comments for public APIs
- Follow existing naming conventions

### Pull Request Requirements
- [ ] Code follows style guidelines
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] No breaking changes (unless discussed)
- [ ] Performance impact considered

### Commit Message Format
```
type(scope): description

feat(math-flow): add difficulty progression
fix(ui): resolve button alignment issue
docs(api): update game class documentation
```

## 🎨 Code Style Guide

### TypeScript
```typescript
// Use interfaces for object shapes
interface GameConfig {
  maxTime: number;
  showStats: boolean;
}

// Use meaningful names
const calculateRoundScore = (correct: number, mistakes: number): number => {
  // Implementation
};

// Document public APIs
/**
 * Calculates the score for a game round
 * @param correct Number of correct answers
 * @param mistakes Number of mistakes
 * @returns Calculated score
 */
```

### Astro Components
```astro
---
// Props interface at the top
export interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
}

// Destructure props with defaults
const { title, variant = 'primary' } = Astro.props;
---

<!-- Use semantic HTML -->
<article class="card">
  <h2 class="card-title">{title}</h2>
  <div class="card-content">
    <slot />
  </div>
</article>

<style>
  /* Use Tailwind utilities in @apply */
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
</style>
```

### CSS/Tailwind
```css
/* Prefer utility classes */
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">

/* Use @apply for repeated patterns */
.btn {
  @apply px-4 py-2 font-medium rounded transition-colors;
}

/* Component-specific styles in <style> blocks */
<style>
  .game-area {
    min-height: 400px;
    display: grid;
    place-items: center;
  }
</style>
```

## 🔍 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install

# Check for TypeScript errors
bunx tsc --noEmit
```

#### Development Server Issues
```bash
# Restart with clean cache
bun run dev --force
```

#### Game Loading Issues
- Check browser console for JavaScript errors
- Verify game class imports
- Ensure DOM elements exist before JavaScript runs

### Getting Help
1. Check existing documentation
2. Search GitHub issues
3. Create detailed issue report
4. Join community discussions

## 📈 Roadmap

### Current Phase: Core Development
- ✅ Base architecture
- ✅ Math Flow game
- ✅ Simon Says game
- 🔄 Performance optimization

### Next Phase: Enhancement
- 📋 Additional games
- 📋 User progress tracking
- 📋 Advanced analytics
- 📋 PWA features

### Future Phases
- 📋 Multiplayer functionality
- 📋 User accounts
- 📋 Mobile applications
- 📋 AI-powered difficulty adjustment

## 📞 Contact

- **Repository**: [GitHub Repository URL]
- **Issues**: [GitHub Issues URL]
- **Discussions**: [GitHub Discussions URL]
- **Documentation**: This documentation set

---

*This documentation is maintained by the Mind Games development team and is updated with each release.*
