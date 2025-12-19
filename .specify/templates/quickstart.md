# Quickstart Guide: Physical AI & Humanoid Robotics Book

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Python 3.8+ (for backend services)
- Git version control system
- Access to OpenAI API key
- Access to Qdrant Cloud Free Tier account

## Setup Development Environment

### 1. Clone the Repository

```bash
git clone <repository-url>
cd physical-ai-humanoid-robotics-book
```

### 2. Install Frontend Dependencies

```bash
# Navigate to the project root
cd <project-root>

# Install Docusaurus dependencies
npm install

# Verify installation
npm run build
```

### 3. Configure Backend Services

```bash
# Create environment file
cp .env.example .env

# Edit .env file with your configuration:
# OPENAI_API_KEY=your_openai_api_key
# QDRANT_URL=your_qdrant_cluster_url
# QDRANT_API_KEY=your_qdrant_api_key
# NEON_DB_URL=your_neon_database_url
# JWT_SECRET=your_jwt_secret
```

### 4. Initialize Backend Services

```bash
# Install Python dependencies (if using virtual environment)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn python-multipart openai sqlalchemy psycopg2-binary better-exceptions

# Start the backend server
uvicorn main:app --reload
```

## Initialize Content Structure

### 1. Generate Initial Content

```bash
# Run content generation script
npm run generate-content

# This creates the initial directory structure:
# docs/
# ├── module-1/
# ├── module-2/
# ├── module-3/
# └── module-4/
```

### 2. Add Book Content

```bash
# Add module content using the spec files as reference
# Content should follow Docusaurus MDX format with:
# - Admonitions for important notes
# - Code blocks with syntax highlighting
# - Mermaid diagrams for visual explanations
# - Interactive elements where appropriate
```

## Running the Development Server

### 1. Start Frontend Server

```bash
# Start Docusaurus development server
npm start

# The site will be available at http://localhost:3000
```

### 2. Start Backend Services

```bash
# In a separate terminal, start the backend API
uvicorn app.main:app --reload --port 8000

# The API will be available at http://localhost:8000
```

### 3. Verify Integration

- Visit http://localhost:3000
- Test the RAG chatbot functionality
- Verify authentication flows work
- Test content navigation

## Content Creation Workflow

### 1. Using Spec-Kit Plus and Claude Code

```bash
# Create new content following the specifications
# Use Claude Code for content generation and validation

# Example: Create a new chapter
claude-code generate --prompt "Create a chapter about ROS 2 nodes for humanoid robots" --output docs/module-1/nodes.md
```

### 2. Content Formatting Guidelines

All content should follow these standards:

- Use Docusaurus-compatible Markdown
- Include runnable code examples with proper syntax highlighting
- Add diagrams using Mermaid syntax
- Use admonitions for important notes:
  ```markdown
  :::tip
  This is a helpful tip for students
  :::

  :::warning
  This is an important warning
  :::
  ```

### 3. Adding Interactive Elements

```jsx
// Example of interactive code playground
import CodeBlock from '@theme/CodeBlock';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

<CodeBlock language="python">
{`# Example ROS 2 publisher code
import rclpy
from std_msgs.msg import String

def main():
    rclpy.init()
    node = rclpy.create_node('humanoid_controller')
    # ... rest of implementation`}
</CodeBlock>
```

## Testing and Validation

### 1. Run Content Validation

```bash
# Validate all content files
npm run validate-content

# Check for broken links
npm run check-links

# Verify code examples work
npm run test-examples
```

### 2. API Testing

```bash
# Run backend tests
python -m pytest tests/

# Test RAG functionality
python -c "from app.rag import test_rag; test_rag()"
```

### 3. End-to-End Testing

```bash
# Run full integration tests
npm run e2e-test
```

## Deployment

### 1. Build for Production

```bash
# Build the static site
npm run build

# The built site will be in the build/ directory
```

### 2. Deploy to GitHub Pages

```bash
# Deploy using Docusaurus command
npm run deploy

# This will push the built site to the gh-pages branch
```

### 3. Backend Deployment

The backend services should be deployed to a cloud provider that supports Python/FastAPI applications.

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Ensure all required environment variables are set in `.env`
   - Check that API keys are valid and have necessary permissions

2. **Content Not Loading**
   - Verify that content files are in the correct directory structure
   - Check that filenames follow Docusaurus conventions

3. **RAG Chatbot Not Working**
   - Verify Qdrant connection and API key
   - Check that content has been properly indexed

### Getting Help

- Check the project documentation in the `docs/` directory
- Review the implementation plan in `plan.md`
- Consult the API contracts in `contracts/`
- Review the data model in `data-model.md`

## Next Steps

1. Complete the content for Module 1: The Robotic Nervous System (ROS 2)
2. Implement the RAG chatbot integration
3. Add authentication and personalization features
4. Test the complete user experience
5. Prepare for deployment to GitHub Pages