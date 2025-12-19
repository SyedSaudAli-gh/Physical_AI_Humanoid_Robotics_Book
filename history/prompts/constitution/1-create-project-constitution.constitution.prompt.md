---
id: 1
title: Create Project Constitution
stage: constitution
date: 2025-12-17
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: user
command: /sp.constitution
labels: [constitution, setup, governance]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```text
/sp.constitution

Project: Book on Physical AI & Humanoid Robotics using Claude Code and Spec-Kit Plus

Core principles:
- Accuracy in technical descriptions and implementations, verified through tool documentation and best practices
- Clarity for students with computer science and AI backgrounds, focusing on practical application
- Reproducibility of code, simulations, and deployments (all steps documented and traceable)
- Integration rigor (seamless embedding of RAG chatbot and bonus features)
- Innovation through reusable intelligence via subagents and agent skills

Key standards:
- Book structure: Use Docusaurus for content organization and GitHub Pages for deployment
- Chatbot functionality: RAG-based using OpenAI Agents/ChatKit SDKs, FastAPI, Neon Serverless Postgres, and Qdrant Cloud Free Tier; must handle book content queries and user-selected text
- Bonus implementations: Reusable subagents/agent skills for up to 50 points; Signup/Signin with better-auth.com (including background questions for personalization) for up to 50 points; Chapter personalization button for logged users for up to 50 points; Urdu translation button per chapter for up to 50 points
- Content quality: Align with course modules on ROS 2, Gazebo/Unity, NVIDIA Isaac, and VLA; include learning outcomes, weekly breakdown, assessments, and hardware requirements
- Code and documentation: Use Spec-Kit Plus and Claude Code; ensure plagiarism-free original content

Constraints:
- Core tools: Docusaurus, Spec-Kit Plus, Claude Code, OpenAI Agents/ChatKit, FastAPI, Neon Serverless Postgres, Qdrant Cloud Free Tier
- Deployment: GitHub Pages for the book with embedded RAG chatbot
- Bonus features: Optional but incentivized; personalization based on user software/hardware background; translation to Urdu
- Base scoring: 100 points for core book and chatbot; up to 200 bonus points across categories
- Theme focus: AI systems in the physical world, embodied intelligence, bridging digital AI to humanoid robotics

Success criteria:
- Fully functional book deployed on GitHub Pages with integrated RAG chatbot answering content queries accurately
- Bonus features implemented and functional where pursued (e.g., subagents, auth with personalization, chapter buttons for customization)
```

## Response snapshot

Created the initial project constitution file at .specify/memory/constitution.md with the following sections:

1. Core Principles:
   - Technical Accuracy and Verification
   - Educational Clarity
   - Reproducibility and Documentation
   - Integration Rigor
   - Innovation Through Reusability
   - Minimal Viable Implementation

2. Technical Standards and Constraints:
   - Core Technology Stack
   - Deployment Requirements
   - Code Quality Standards

3. Development Workflow and Quality Assurance:
   - Verification Process
   - Change Management
   - Human Feedback Integration

4. Governance section with guidelines for adherence and documentation

The constitution formalizes the project principles for the Physical AI & Humanoid Robotics book project, establishing clear guidelines for development, quality standards, and governance.

## Outcome

- ✅ Impact: Created initial project constitution that establishes governance and principles for the Physical AI & Humanoid Robotics book project
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with project-specific principles and standards
- 🔁 Next prompts: Proceed with project planning and implementation following the established constitution
- 🧠 Reflection: The constitution provides a solid foundation for consistent decision-making throughout the project lifecycle

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): begin feature specification following the constitution guidelines