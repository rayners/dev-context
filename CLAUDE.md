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
- **ai-code-access-restrictions.md** - Policy on AI access to FoundryVTT client-side code (READ FIRST)
- **external-documentation-references.md** - Official FoundryVTT docs and approved community resources

### Shared CI/CD Automation Assets

- **claude-prompts/** - Shared prompt templates consumed by GitHub Actions workflows in FoundryVTT modules:
  - `pr-review.md` - Automated PR code review (used by `claude-code-review.yml`)
  - `bug-triage.md` - Automated bug triage on new issues (used by `claude-issue-triage.yml`)
  - `qa-discussion.md` - Automated Q&A responses in GitHub Discussions (used by `claude-qa-discussions.yml`)
  - `development-task.md` - @claude-triggered development tasks (used by `claude-development.yml`)
- **.gh-aliases.yml** - GitHub CLI aliases for Discussions management (`disc-categories`, `disc-category-discussions`, `disc-comments`, `disc-reply`), imported by workflows at runtime
- **scripts/discussions.js** - Standalone Node.js CLI for GitHub Discussions management

## How This Repo Is Consumed

Consuming modules (e.g., `fvtt-seasons-and-stars`) check out this repo in their GitHub Actions workflows:

```yaml
- uses: actions/checkout@v6
  with:
    repository: rayners/dev-context
    path: dev-context
```

Workflows then load prompt templates with `cat dev-context/claude-prompts/<prompt>.md` and pass them to `anthropics/claude-code-action`. The `.gh-aliases.yml` file is imported via `gh alias import dev-context/.gh-aliases.yml`.

This repo has no `package.json` — it is a pure reference/documentation repository with no build or test commands of its own.

## Document Purpose and Usage

**CRITICAL FIRST STEP**: Always read `ai-code-access-restrictions.md` first — it defines the current policy on referencing FoundryVTT's client-side application code (conditionally permitted as AI context for package-development work, per FoundryVTT's AI Content Policy; not permitted for any other purpose).

**Reference Strategy**: Use selective reference - only load the specific documents needed for each task to minimize context usage.

**Typical Usage Patterns**:
- Development workflow questions → `foundry-development-practices.md`
- Testing implementation → `testing-practices.md`
- Architecture decisions → `module-architecture-patterns.md`
- Documentation work → `documentation-standards.md`
- CI/CD setup → `automation-infrastructure.md`
- Prompt template editing → `claude-prompts/`

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

### Consuming Module Commands (not this repo)

FoundryVTT modules that reference this context use these commands:

- `npm run validate` - Complete quality pipeline (lint + format:check + typecheck + test + build)
- `npm run test:run` - Execute full test suite (NEVER use `npm run test:workspaces`)
- `npm run build` - Production build with TypeScript compilation

## Notes

- AGENTS.md is a symlink to this CLAUDE.md
- Context derived from CLAUDE.md files across multiple FoundryVTT modules
- Last updated: 2026-08-16
