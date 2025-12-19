<!-- SYNC IMPACT REPORT
Version change: 1.0.0 → 1.0.0 (initial creation)
Modified principles: none (new document)
Added sections: All sections (initial creation)
Removed sections: none
Templates requiring updates: ✅ updated / ⚠ pending
Follow-up TODOs: none
-->

# Book on Physical AI & Humanoid Robotics Constitution

## Core Principles

### Technical Accuracy and Verification
All technical descriptions and implementations must be accurate and verified through tool documentation and best practices. No assumptions should be made without external verification.

### Educational Clarity
Content must be clear for students with computer science and AI backgrounds, focusing on practical application rather than theoretical concepts alone.

### Reproducibility and Documentation
All code, simulations, and deployments must be reproducible with documented steps that are traceable and verifiable. Every process should be replicable by others.

### Integration Rigor
Integration between components must be rigorous and seamless, especially for the RAG chatbot and bonus features. All interfaces should be well-defined and tested.

### Innovation Through Reusability
Focus on innovation through reusable intelligence via subagents and agent skills, promoting modular and extensible design patterns.

### Minimal Viable Implementation
Prefer the smallest viable implementation that meets requirements without unnecessary refactoring of unrelated code. Maintain focus on core objectives.

## Technical Standards and Constraints

### Core Technology Stack
Use the specified technology stack: Docusaurus for content organization, GitHub Pages for deployment, OpenAI Agents/ChatKit SDKs, FastAPI, Neon Serverless Postgres, and Qdrant Cloud Free Tier for the RAG chatbot functionality.

### Deployment Requirements
Deploy the book to GitHub Pages with an embedded RAG chatbot that can accurately answer content queries. All features must be fully functional in the deployed environment.

### Code Quality Standards
All code and documentation must be original and plagiarism-free. Use Spec-Kit Plus and Claude Code for development processes. Follow established code quality, testing, performance, and security principles.

## Development Workflow and Quality Assurance

### Verification Process
Prioritize and use MCP tools and CLI commands for all information gathering and task execution. Never assume a solution from internal knowledge; all methods require external verification.

### Change Management
Produce the smallest viable diffs; do not refactor unrelated code. Cite existing code with references and propose new code in fenced blocks. Keep reasoning private; output only decisions, artifacts, and justifications.

### Human Feedback Integration
Treat the user as a specialized tool for clarification and decision-making when encountering ambiguous requirements, unforeseen dependencies, or architectural uncertainty. Ask targeted questions before proceeding with uncertain implementations.

## Governance

This constitution governs all development activities for the Physical AI & Humanoid Robotics book project. All team members must adhere to these principles and standards. Changes to this constitution require explicit approval and documentation of the rationale. All implementations must align with the core mission of bridging digital AI to humanoid robotics through educational content.

All development work must be traceable through Prompt History Records (PHRs) that capture every user input and corresponding implementation decisions. Significant architectural decisions must be documented in Architecture Decision Records (ADRs) when they meet the significance criteria (long-term consequences, multiple viable alternatives, cross-cutting influence).

**Version**: 1.0.0 | **Ratified**: 2025-12-17 | **Last Amended**: 2025-12-17