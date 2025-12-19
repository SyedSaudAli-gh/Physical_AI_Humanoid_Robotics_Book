# Research Findings: Physical AI & Humanoid Robotics Book

## Docusaurus Integration Research

**Decision**: Floating widget approach for RAG chatbot integration
**Rationale**: Provides constant access to the chatbot while preserving the main content reading experience. Students can ask questions about the current content without navigating away from their learning path.
**Alternatives considered**:
- Sidebar component: Would consume valuable screen space in educational content
- Dedicated chat page: Would require navigation away from content, disrupting learning flow

## Authentication System Research

**Decision**: Better-Auth with email/password authentication and profile questionnaire
**Rationale**: Provides user tracking for personalization features while maintaining simplicity for the educational use case. Email/password reduces dependency on external OAuth providers while still enabling user-specific features.
**Alternatives considered**:
- OAuth providers (Google, GitHub): Would add complexity and potential privacy concerns
- Social logins: Would limit user base to those with specific accounts

## Translation Service Research

**Decision**: Client-side translation with pre-translated content
**Rationale**: Provides faster response times and offline capability, which is important for educational content. Pre-translated content ensures quality and consistency.
**Alternatives considered**:
- Real-time API translation: Would introduce latency and potential quality issues
- Hybrid approach: Would add unnecessary complexity for the educational use case

## RAG Architecture Research

**Decision**: Qdrant Cloud Free Tier with FastAPI backend and OpenAI integration
**Rationale**: Provides a good balance of cost, performance, and integration capabilities for educational content. Qdrant offers efficient vector search capabilities needed for the RAG system.
**Alternatives considered**:
- Pinecone: More expensive, potentially overkill for educational project
- Weaviate: Self-hosting complexity
- Local solutions: Scaling and maintenance concerns

## Personalization Mechanism Research

**Decision**: Client-side storage with server-side preferences backup
**Rationale**: Provides immediate personalization without requiring authentication, while still allowing for persistent preferences when users sign up.
**Alternatives considered**:
- Server-side only: Would require authentication for any personalization
- Cookie-based: Limited storage capacity and privacy concerns

## Claude Code Subagents Research

**Decision**: Context-aware agents for specific educational tasks
**Rationale**: Enables reusable intelligence for common educational interactions like code explanation, concept clarification, and exercise assistance.
**Alternatives considered**:
- General-purpose agents: Would be less effective for specific educational tasks
- No subagents: Would miss the opportunity for enhanced learning experiences

## Performance Optimization Research

**Decision**: Static pre-generation with selective dynamic loading
**Rationale**: Ensures fast initial page loads while allowing for dynamic content like personalized recommendations and chatbot responses.
**Alternatives considered**:
- Fully dynamic: Would result in slower initial loads
- Pure static: Would limit personalization capabilities

## Security and Privacy Research

**Decision**: Minimal data collection with clear privacy policy
**Rationale**: Protects student privacy while still enabling necessary personalization and progress tracking features.
**Alternatives considered**:
- Extensive data collection: Would raise privacy concerns
- No user data: Would prevent personalization and progress tracking

## Deployment Strategy Research

**Decision**: GitHub Pages with CDN for static content, separate backend for dynamic features
**Rationale**: Cost-effective, reliable hosting solution that works well with Docusaurus while allowing for backend services for RAG and authentication.
**Alternatives considered**:
- Full custom hosting: Higher cost and complexity
- Alternative static hosting: Similar capabilities but less integration with GitHub workflow