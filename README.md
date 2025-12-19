# Physical AI & Humanoid Robotics Book

A comprehensive educational platform for ROS 2, Digital Twins, AI-robot brains, and Vision-Language-Action integration, built with Docusaurus and deployed to GitHub Pages.

## Overview

This educational platform provides a complete learning experience for students interested in humanoid robotics. The curriculum is structured into four progressive modules:

1. **Module 1**: The Robotic Nervous System (ROS 2) - Learn ROS 2 fundamentals as robot control middleware
2. **Module 2**: The Digital Twin (Gazebo & Unity) - Create and simulate humanoid robots in virtual environments
3. **Module 3**: The AI-Robot Brain (NVIDIA Isaac™) - Build AI components for robot perception and decision-making
4. **Module 4**: Vision-Language-Action (VLA) - Integrate vision, language, and action for advanced robotics

## Features

- **Interactive Learning**: Embedded RAG chatbot for content queries and explanations
- **Hands-on Exercises**: Practical coding examples and simulation exercises
- **Multi-language Support**: Content available in English and Urdu
- **Personalization**: User profiles and personalized learning paths
- **Progress Tracking**: Monitor your learning progress across modules

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Python 3.8+ (for backend services)
- Git version control system
- Access to OpenAI API key (for RAG functionality)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd physical-ai-humanoid-robotics-book
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The site will be available at http://localhost:3000

## Project Structure

- `docs/` - Contains all educational content organized by modules
- `src/` - Docusaurus theme customization and components
- `static/` - Static assets like images and documents
- `specs/` - Specification files for the project
- `history/` - Prompt History Records and Architecture Decision Records

## Contributing

This project uses Spec-Kit Plus and Claude Code for spec-driven development. All content and features follow detailed specifications in the `specs/` directory.

## Deployment

The site is deployed to GitHub Pages. To deploy:
```bash
npm run deploy
```

## License

This educational content is provided for learning purposes in the field of humanoid robotics.

## Support

For questions about the content or technical issues, please check the project documentation in the `docs/` directory or review the implementation plan in `specs/004-vision-language-action-vla/plan.md`.