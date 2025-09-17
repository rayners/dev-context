# FoundryVTT Development Context Reference

*Comprehensive development reference materials for FoundryVTT module development*

## 🚨 CRITICAL SECURITY NOTICE

**READ FIRST:** [AI Code Access Restrictions](ai-code-access-restrictions.md)

This document establishes the absolute prohibition on AI/Assistant access to FoundryVTT proprietary application code while clarifying that open-source community modules are acceptable when properly licensed.

## Table of Contents

### Core Development Standards
- **[Development Practices](foundry-development-practices.md)** - Complete workflow standards, quality requirements, and system-agnostic design principles
- **[Testing Practices](testing-practices.md)** - Comprehensive testing strategies including TDD, Vitest, Quench, and coverage requirements
- **[Documentation Standards](documentation-standards.md)** - Organization, quality standards, privacy guidelines, and maintenance practices

### Architecture & Patterns
- **[Module Architecture Patterns](module-architecture-patterns.md)** - Universal module structure, system adapters, provider patterns, and clean architecture principles
- **[Automation Infrastructure](automation-infrastructure.md)** - Professional CI/CD workflows, GitHub Actions, release management, and quality gates

### External Resources
- **[External Documentation References](external-documentation-references.md)** - Official FoundryVTT docs, community resources, type definitions, and approved reference sources

## Quick Reference Guide

### Development Workflow
1. **Pre-Commit**: Always run `npm run lint`, `npm run typecheck`, `npm run test:run`, `npm run build`
2. **Testing**: Use `npm test` or `npm run test:run` (NEVER `npm run test:workspaces`)
3. **Quality Gates**: 90%+ coverage for core logic, 100% test pass rate before releases

### Critical Standards
- **Documentation Accuracy**: All claims must be verifiable in code
- **No Hyperbole**: Avoid "works with all systems", "fully tested", "production ready"
- **System-Agnostic**: Design for graceful degradation across game systems
- **TDD Workflow**: Tests first, then implementation for new features

### Architecture Principles
- **Provider Pattern**: System-agnostic integration adapters
- **Feature Detection**: Runtime capability discovery
- **Clean Separation**: Bridge adapters never modify target systems
- **Error Resilience**: Comprehensive fallback strategies

### Testing Requirements
- **Vitest**: Unit and integration tests with 90%+ coverage
- **Quench**: E2E testing in actual Foundry environment
- **Singleton Reset**: Always reset singleton instances in `beforeEach()`
- **Mock Management**: Proper cleanup and state isolation

### Release Standards
- **Semantic Versioning**: Clear version management with automated changelog
- **GitHub Actions**: Automated CI/CD with multi-node testing
- **Asset Distribution**: Automated module packaging and release
- **Quality Validation**: All quality gates must pass before release

## Usage Instructions

### For AI Assistants
When working on FoundryVTT development tasks:

1. **ALWAYS** read the [AI Code Access Restrictions](ai-code-access-restrictions.md) first
2. Reference specific sections as needed based on the task:
   - Development workflow questions → [Development Practices](foundry-development-practices.md)
   - Testing implementation → [Testing Practices](testing-practices.md)
   - Architecture decisions → [Module Architecture Patterns](module-architecture-patterns.md)
   - Documentation work → [Documentation Standards](documentation-standards.md)
   - CI/CD setup → [Automation Infrastructure](automation-infrastructure.md)
3. Use external references for official API documentation and community resources

### For Developers
This context provides:
- **Consistent Standards**: Uniform patterns across all FoundryVTT modules
- **Quality Assurance**: Professional-grade development practices
- **Architecture Guidance**: Proven patterns for system compatibility
- **Automation Templates**: Ready-to-use CI/CD workflows

## File Organization

```
dev-context/
├── README.md                          # This file - entry point and table of contents
├── ai-code-access-restrictions.md     # CRITICAL: AI access policy for FoundryVTT code
├── foundry-development-practices.md   # Core development workflow and standards
├── testing-practices.md               # Comprehensive testing strategies and patterns
├── module-architecture-patterns.md    # Universal module structure and design patterns
├── documentation-standards.md         # Documentation organization and quality standards
├── automation-infrastructure.md       # CI/CD workflows and release automation
└── external-documentation-references.md # Official docs and approved community resources
```

## Integration with Module Development

### CLAUDE.md Integration
Reference this context in your module's CLAUDE.md file:

```markdown
## Development Context
For comprehensive development standards and patterns, see:
- [Development Context Reference](dev-context/README.md)

Specific areas:
- Development workflow: [dev-context/foundry-development-practices.md](dev-context/foundry-development-practices.md)
- Testing standards: [dev-context/testing-practices.md](dev-context/testing-practices.md)
- Architecture patterns: [dev-context/module-architecture-patterns.md](dev-context/module-architecture-patterns.md)
```

### Selective Reference
Only reference the specific files you need for each development session to minimize context usage while ensuring access to relevant standards and patterns.

## Maintenance

This development context is derived from:
- CLAUDE.md files across multiple FoundryVTT modules
- Local-docs shared development standards
- Foundry-claude-patterns repository templates
- Real-world development experience and lessons learned

The context is designed to be:
- **Comprehensive**: Covers all aspects of FoundryVTT module development
- **Authoritative**: Based on proven patterns and established standards
- **Accessible**: Clear organization with targeted reference paths
- **Secure**: Strict boundaries on what code can be accessed

---

**Last Updated**: Based on development standards as of 2025-09-17
**Scope**: Universal standards for all FoundryVTT module development
**Related**: This context supports the foundryvtt-simple-calendar-compat project and can be applied to any FoundryVTT module development work