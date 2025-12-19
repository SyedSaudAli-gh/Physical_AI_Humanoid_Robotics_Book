# Data Model: Physical AI & Humanoid Robotics Book

## User Entity

**Description**: Represents registered users of the educational platform

**Fields**:
- id: string (unique identifier, required, indexed)
- email: string (user email, required, unique, validated)
- name: string (user display name, optional)
- background: object (questionnaire responses about technical background, optional)
- preferences: object (personalization settings, optional)
- createdAt: datetime (account creation timestamp, required)
- updatedAt: datetime (last update timestamp, required)
- lastLoginAt: datetime (last login timestamp, optional)

**Validation Rules**:
- email must be valid email format
- email must be unique across all users
- createdAt must be before updatedAt

## Content Entity

**Description**: Represents book content including modules, chapters, and exercises

**Fields**:
- id: string (content identifier, required, indexed)
- moduleId: string (module identifier, required, indexed)
- chapterId: string (chapter identifier, required, indexed)
- title: string (content title, required)
- content: string (main content in Markdown format, required)
- urduContent: string (Urdu translation of content, optional)
- type: enum (content type: 'module', 'chapter', 'exercise', 'resource', required)
- metadata: object (additional content properties, optional)
- order: integer (display order within module/chapter, required)
- createdAt: datetime (creation timestamp, required)
- updatedAt: datetime (last update timestamp, required)

**Validation Rules**:
- moduleId and chapterId must follow naming convention
- content must be valid Markdown
- type must be one of allowed values
- order must be non-negative

## ChatSession Entity

**Description**: Represents a chat session between user and RAG chatbot

**Fields**:
- id: string (session identifier, required, indexed)
- userId: string (user identifier, optional for anonymous users)
- query: string (user query, required)
- response: string (AI response, required)
- context: string (content context used for response, optional)
- timestamp: datetime (when query was made, required)
- feedback: object (user feedback on response quality, optional)
- sessionId: string (session identifier for conversation context, optional)

**Validation Rules**:
- query must not be empty
- timestamp must be current or past
- feedback.rating must be between 1-5 if provided

## Personalization Entity

**Description**: Stores user personalization preferences and learning progress

**Fields**:
- id: string (unique identifier, required, indexed)
- userId: string (user identifier, required, unique)
- preferences: object (personalization settings like preferred content depth, language, etc.)
- moduleProgress: object (progress tracking per module with completion percentages)
- learningPath: string (suggested learning sequence based on background)
- lastAccessed: datetime (last access timestamp, required)
- createdAt: datetime (creation timestamp, required)
- updatedAt: datetime (last update timestamp, required)

**Validation Rules**:
- userId must reference an existing user
- preferences must be valid JSON object
- moduleProgress percentages must be between 0-100

## Subagent Entity

**Description**: Represents Claude Code subagents/skills for educational assistance

**Fields**:
- id: string (subagent identifier, required, indexed)
- name: string (subagent name, required)
- description: string (subagent purpose and capabilities, required)
- type: enum ('code-explainer', 'concept-helper', 'exercise-aid', 'simulation-guide', required)
- config: object (configuration parameters for the subagent)
- isActive: boolean (whether subagent is currently active, required)
- createdAt: datetime (creation timestamp, required)
- updatedAt: datetime (last update timestamp, required)

**Validation Rules**:
- type must be one of allowed values
- name must be unique
- config must be valid JSON object if provided

## ContentReference Entity

**Description**: Links content pieces together for cross-references and navigation

**Fields**:
- id: string (reference identifier, required)
- sourceId: string (source content identifier, required)
- targetId: string (target content identifier, required)
- relationship: enum ('cross-reference', 'prerequisite', 'related', 'seealso', required)
- createdAt: datetime (creation timestamp, required)

**Validation Rules**:
- sourceId and targetId must reference existing content
- relationship must be one of allowed values
- self-references are not allowed (sourceId != targetId)

## Translation Entity

**Description**: Stores translation data separate from main content for management

**Fields**:
- id: string (translation identifier, required)
- contentId: string (reference to original content, required)
- language: string (language code, e.g., 'ur', required)
- translatedContent: string (translated content, required)
- status: enum ('pending', 'reviewed', 'published', required)
- reviewerId: string (user who reviewed translation, optional)
- reviewedAt: datetime (when translation was reviewed, optional)
- createdAt: datetime (creation timestamp, required)
- updatedAt: datetime (last update timestamp, required)

**Validation Rules**:
- language must be valid language code
- contentId must reference existing content
- status must be one of allowed values