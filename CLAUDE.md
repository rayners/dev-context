# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the FoundryVTT Development Context Reference repository - a comprehensive collection of development standards, architectural patterns, testing practices, and automation infrastructure for FoundryVTT module development.

## Key Reference Documents

The repository contains standardized patterns and practices used across multiple FoundryVTT modules:

- **foundry-development-practices.md** - Core development workflow, quality requirements, and system-agnostic design principles
- **testing-practices.md** - Comprehensive testing strategies (Vitest + Quench), TDD workflow, and coverage requirements
- **module-architecture-patterns.md** - Universal module structure, provider patterns, and clean architecture principles
- **automation-infrastructure.md** - Professional CI/CD workflows, GitHub Actions, and release management
- **documentation-standards.md** - Documentation organization, quality standards, and maintenance practices
- **ai-code-access-restrictions.md** - Security restrictions for AI code access (READ FIRST)
- **external-documentation-references.md** - Official FoundryVTT docs and approved community resources

## Document Purpose and Usage

### For AI Assistants Working on FoundryVTT Development

**CRITICAL FIRST STEP**: Always read `ai-code-access-restrictions.md` first to understand strict security boundaries around FoundryVTT proprietary code.

**Reference Strategy**: Use selective reference - only load the specific documents needed for each task to minimize context usage while ensuring access to relevant standards.

**Typical Usage Patterns**:
- Development workflow questions → `foundry-development-practices.md`
- Testing implementation → `testing-practices.md`
- Architecture decisions → `module-architecture-patterns.md`
- Documentation work → `documentation-standards.md`
- CI/CD setup → `automation-infrastructure.md`

### Quality Standards Applied

These documents enforce consistent standards across all FoundryVTT module development:

- **Documentation Accuracy**: All claims must be verifiable in code
- **No Hyperbole**: Avoid "works with all systems", "fully tested", "production ready"
- **TDD Workflow**: Tests first, then implementation for new features
- **90%+ Coverage**: Required for core business logic
- **System-Agnostic Design**: Graceful degradation across game systems

## Development Context Integration

### CLAUDE.md Integration Pattern

Reference this context in FoundryVTT module CLAUDE.md files:

```markdown
## Development Context
For comprehensive development standards and patterns:
- [Development Context Reference](dev-context/README.md)

Specific areas:
- Development workflow: [dev-context/foundry-development-practices.md](dev-context/foundry-development-practices.md)
- Testing standards: [dev-context/testing-practices.md](dev-context/testing-practices.md)
- Architecture patterns: [dev-context/module-architecture-patterns.md](dev-context/module-architecture-patterns.md)
```

### Automation Standards

When working with FoundryVTT modules that reference this context:

**Standard Commands**:
- `npm run validate` - Complete quality pipeline (lint + format:check + typecheck + test + build)
- `npm run test:run` - Execute full test suite (NEVER use `npm run test:workspaces`)
- `npm run build` - Production build with TypeScript compilation

**CI/CD Requirements**:
- Multi-node testing (Node 18, 20)
- GitHub packages authentication for @rayners dependencies
- Conventional commits for automated changelog
- Comprehensive quality gates before releases

## File Organization Context

This repository serves as the central reference for:
- **Consistent Standards**: Uniform patterns across all FoundryVTT modules
- **Quality Assurance**: Professional-grade development practices
- **Architecture Guidance**: Proven patterns for system compatibility
- **Automation Templates**: Ready-to-use CI/CD workflows

## Maintenance Notes

- Context derived from CLAUDE.md files across multiple FoundryVTT modules
- Based on real-world development experience and lessons learned
- Designed to be comprehensive, authoritative, accessible, and secure
- Last updated: 2025-09-17 based on current development standards