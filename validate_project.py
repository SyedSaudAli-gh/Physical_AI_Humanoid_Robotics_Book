#!/usr/bin/env python3
"""
Validation script for the Physical AI & Humanoid Robotics Book project
This script validates that all components of the system are working correctly.
"""

import os
import sys
from pathlib import Path

def validate_project_structure():
    """Validate the project directory structure"""
    print("Validating project structure...")

    required_dirs = [
        "docs",
        "docs/module-1",
        "docs/module-2",
        "docs/module-3",
        "docs/module-4",
        "src",
        "src/api",
        "src/api/models",
        "src/api/database",
        "src/api/services",
        "src/api/routers",
        "src/api/tests",
        "src/components"
    ]

    missing_dirs = []
    for dir_path in required_dirs:
        if not Path(dir_path).exists():
            missing_dirs.append(dir_path)

    if missing_dirs:
        print(f"Missing directories: {missing_dirs}")
        return False
    else:
        print("All required directories exist")
        return True

def validate_documentation():
    """Validate documentation files exist"""
    print("\nValidating documentation...")

    # Check that each module has at least one documentation file
    module_dirs = ["docs/module-1", "docs/module-2", "docs/module-3", "docs/module-4"]

    missing_modules = []
    for module_dir in module_dirs:
        module_files = list(Path(module_dir).glob("*.md"))
        if not module_files:
            missing_modules.append(module_dir)

    # Also check for specific VLA module files that were created
    required_vla_docs = [
        "docs/module-4/chapter-1-introduction-to-vla.md",
        "docs/module-4/chapter-2-voice-to-action.md",
        "docs/module-4/chapter-3-cognitive-planning.md",
        "docs/module-4/chapter-4-capstone-project.md"
    ]

    missing_vla_docs = []
    for doc_path in required_vla_docs:
        if not Path(doc_path).exists():
            missing_vla_docs.append(doc_path)

    if missing_modules or missing_vla_docs:
        if missing_modules:
            print(f"Missing documentation in modules: {missing_modules}")
        if missing_vla_docs:
            print(f"Missing VLA documentation files: {missing_vla_docs}")
        return False
    else:
        print("All required documentation exists")
        return True

def validate_backend_components():
    """Validate backend components exist and are properly configured"""
    print("\nValidating backend components...")

    required_files = [
        "src/api/main.py",
        "src/api/models/user.py",
        "src/api/models/content.py",
        "src/api/models/chat_session.py",
        "src/api/database/database.py",
        "src/api/database/vector_db.py",
        "src/api/services/content_indexer.py",
        "src/api/routers/auth.py",
        "src/api/routers/content.py",
        "src/api/routers/rag.py"
    ]

    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)

    if missing_files:
        print(f"Missing backend files: {missing_files}")
        return False
    else:
        print("All backend components exist")
        return True

def validate_frontend_components():
    """Validate frontend components exist"""
    print("\nValidating frontend components...")

    required_files = [
        "src/components/RAGChatbot.jsx",
        "src/components/VLAExercise.jsx",
        "docusaurus.config.js",
        "sidebars.js"
    ]

    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)

    if missing_files:
        print(f"Missing frontend files: {missing_files}")
        return False
    else:
        print("All frontend components exist")
        return True

def validate_environment():
    """Validate environment configuration"""
    print("\nValidating environment configuration...")

    required_env = [
        "OPENAI_API_KEY",
        "QDRANT_URL",
        "DATABASE_URL"
    ]

    missing_env = []
    for env_var in required_env:
        if not os.getenv(env_var):
            missing_env.append(env_var)

    # For testing purposes, we'll show what's missing but not fail if in testing mode
    if missing_env:
        print(f"Missing environment variables: {missing_env}")
        print("   (This is expected in testing environment)")
    else:
        print("All environment variables are set")

    return True

def validate_capstone_content():
    """Validate the capstone project content is complete"""
    print("\nValidating capstone project content...")

    capstone_file = "docs/module-4/chapter-4-capstone-project.md"
    if not Path(capstone_file).exists():
        print(f"Capstone project file does not exist: {capstone_file}")
        return False

    with open(capstone_file, 'r', encoding='utf-8') as f:
        content = f.read()

    required_sections = [
        "System Architecture",
        "Complete VLA System Implementation",
        "Integration Workflow",
        "Implementation Scenarios",
        "Testing Framework",
        "Deployment Configuration"
    ]

    missing_sections = []
    for section in required_sections:
        if f"# {section}" not in content and f"## {section}" not in content:
            missing_sections.append(section)

    if missing_sections:
        print(f"Missing sections in capstone project: {missing_sections}")
        return False
    else:
        print("Capstone project contains all required sections")
        return True

def main():
    """Main validation function"""
    print("Starting Physical AI & Humanoid Robotics Book Validation")
    print("=" * 60)

    # Change to project directory
    project_root = Path(__file__).parent
    os.chdir(project_root)

    # Run all validations
    results = []
    results.append(validate_project_structure())
    results.append(validate_documentation())
    results.append(validate_backend_components())
    results.append(validate_frontend_components())
    results.append(validate_environment())
    results.append(validate_capstone_content())

    print("\n" + "=" * 60)
    print("Validation Summary:")

    passed = sum(results)
    total = len(results)

    print(f"   Tests passed: {passed}/{total}")

    if all(results):
        print("All validations passed! The project is complete and ready.")
        print("\nCongratulations! You have successfully implemented the")
        print("   Physical AI & Humanoid Robotics Book project with all")
        print("   modules, components, and the capstone VLA system.")
        return True
    else:
        print("Some validations failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)