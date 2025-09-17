# FoundryVTT Documentation Standards & Practices

*Comprehensive documentation patterns for Foundry module development*

## Documentation Organization Principles

### Repository Documentation (Public)
**Audience**: End users, potential adopters, community members, contributors
**Purpose**: Help users install, configure, and use the module effectively
**Storage**: Repository root and `docs/` directory

#### Essential Repository Files
- **`README.md`** - Technical overview for developers and contributors
- **`README_FOUNDRY.md`** - User-focused guide for Foundry package manager
- **`CHANGELOG.md`** - Public release history and feature announcements
- **`CONTRIBUTING.md`** - Development setup, coding standards, PR process
- **`LICENSE`** - Legal framework (MIT license)
- **`API-REFERENCE.md`** - Developer API documentation and interfaces
- **`KNOWN-ISSUES.md`** - User-level limitations and missing features

#### docs/ Directory Structure
```
docs/
├── USER-GUIDE.md           # Comprehensive user manual
├── DEVELOPER-GUIDE.md      # Complete API reference
├── INTEGRATION-GUIDE.md    # Module integration patterns
├── MIGRATION-GUIDE.md      # Transition guides (e.g., Simple Calendar to S&S)
└── ROADMAP.md             # Public development timeline
```

### Private Development Documentation
**Audience**: Core development team, AI assistants, future maintainers
**Purpose**: Capture development process, decisions, and institutional knowledge
**Storage**: `../local-docs/` with organized subdirectories

#### Local-Docs Structure
```
../local-docs/
├── [module-name]/
│   ├── development/        # Implementation docs, CLAUDE.md
│   ├── planning/           # Strategic planning, release plans
│   ├── architecture/       # Technical decisions
│   └── sessions/           # Development logs
├── shared/                 # Cross-project content
└── daily-notes/           # Session logs
```

## Quality Standards for Documentation

### Accuracy Requirements (ALWAYS ENFORCED)
- **Code Alignment**: All documented features must exist in current codebase
- **Version Accuracy**: Version references must reflect actual release timeline
- **Citation Validation**: All external references must be current and accessible
- **Installation Verification**: Setup instructions must be tested in clean environment

### Language Standards

#### Prohibited Language
- **Hyperbolic Claims**: "works with all systems", "fully tested", "production ready"
- **Absolute Statements**: "never fails", "always works", "100% compatible"
- **Unverified Claims**: "extensively tested" without test suite evidence
- **Future Promises**: "will support" for unimplemented features

#### Required Accuracy Patterns
- **Feature Claims**: "Designed to work with D&D 5e, PF2e, Dragonbane" (tested systems)
- **Version References**: "Added in v0.2.0" (generic, verifiable)
- **Status Honesty**: "Alpha software with ongoing development"
- **Limitation Clarity**: "Currently supports X, Y planned for future release"

### Documentation Categories

#### User Documentation Standards
- No technical jargon without explanation
- Include screenshots and examples where helpful
- Acknowledge alpha status and testing limitations honestly
- Avoid hyperbole and overpromising
- Focus on user value and practical guidance
- Clear step-by-step instructions with expected results

#### Developer Documentation Standards
- Complete API reference with examples
- Integration patterns and best practices
- System compatibility and requirements
- Error handling and troubleshooting
- Code examples that are tested and verified

## Privacy and Security Guidelines

### What NOT to Include in Public Documentation
- **Internal Technical Details**: Implementation phase breakdowns, development time estimates
- **Linear Ticket References**: Direct ticket IDs, internal planning references
- **AI Assistant Context**: Claude instructions, development workflows
- **Sensitive Information**: Private endpoints, internal processes
- **Development Noise**: TypeScript fixes, beta testing strategies

### Repository .gitignore Patterns
```gitignore
# Internal documentation (moved to ../local-docs/)
CLAUDE.md
*-IMPLEMENTATION.md
PHASE*.md
BETA-*.md
BRIDGE-*.md
CONVERSION-STRATEGY.md
TYPESCRIPT-*.md
*-COMPLETION-SUMMARY.md
internal/
```

### Privacy Review Checklist
Before committing any repository documentation:
- [ ] No Linear ticket references (FOU-XX, PER-XX)
- [ ] No internal development timeline details
- [ ] No AI assistant instructions or context
- [ ] No sensitive endpoints or private information
- [ ] No development time estimates or planning details

## Documentation Types and Templates

### User Guide Template
```markdown
# Module Name User Guide

## Overview
Brief description of what this module does and why users would want it.

## Installation
1. Step-by-step installation instructions
2. System requirements and compatibility
3. Initial configuration steps

## Features
### Feature Name
- What it does
- How to use it
- Configuration options
- Expected results

## Troubleshooting
- Common issues and solutions
- Known limitations with workarounds
- System-specific considerations

## Integration
- How this module works with others
- Compatibility notes
- Integration examples
```

### API Reference Template
```markdown
# Module API Reference

## Overview
Brief description of the module's public API.

## Installation for Developers
```javascript
// How to access the API
const api = game.modules.get('module-id').api;
```

## Methods

### methodName(param1, param2)
**Description**: What this method does

**Parameters**:
- `param1` (Type): Description
- `param2` (Type): Description

**Returns**: `Type` - Description

**Example**:
```javascript
const result = api.methodName('value1', 'value2');
console.log(result);
```

## Events
### Event Name
**Description**: When this event is triggered

**Data Structure**:
```javascript
{
  property1: 'value',
  property2: 123
}
```

**Example**:
```javascript
Hooks.on('module.eventName', (data) => {
  console.log('Event received:', data);
});
```
```

### Contributing Guide Template
```markdown
# Contributing to Module Name

## Development Setup
1. Prerequisites (Node.js version, tools required)
2. Clone and setup instructions
3. Development environment configuration

## Development Workflow
```bash
npm run dev          # Start development build
npm run test         # Run tests
npm run lint         # Check code quality
npm run build        # Production build
```

## Code Standards
- TypeScript strict mode required
- ESLint and Prettier compliance
- 90%+ test coverage for core functionality
- Conventional commit messages

## Testing Requirements
- All new features must have tests
- Both unit tests (Vitest) and E2E tests (Quench)
- Test coverage must not decrease

## Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Run full test suite
4. Submit PR with descriptive title and body
5. Address review feedback

## Release Process
- Automated via release-please
- Semantic versioning
- Automated changelog generation
```

## JSDoc Standards

### API Documentation
```typescript
/**
 * Retrieves the current calendar date from the active provider
 *
 * @returns {CalendarDate} The current calendar date with year, month, day, weekday
 * @throws {Error} When no calendar provider is available
 *
 * @example
 * ```typescript
 * // Get current date
 * const currentDate = api.getCurrentDate();
 * console.log(`Current date: ${currentDate.year}-${currentDate.month}-${currentDate.day}`);
 * ```
 *
 * @since 1.0.0
 */
getCurrentDate(): CalendarDate {
  // Implementation
}
```

### Hook Documentation
```typescript
/**
 * Triggered when calendar time changes
 *
 * @event module:timeChanged
 * @param {CalendarDate} newDate - The new calendar date
 * @param {CalendarDate} oldDate - The previous calendar date
 *
 * @example
 * ```typescript
 * Hooks.on('module:timeChanged', (newDate, oldDate) => {
 *   console.log(`Time changed from ${oldDate.day} to ${newDate.day}`);
 * });
 * ```
 */
```

### Class Documentation
```typescript
/**
 * Manages calendar integration providers
 *
 * @class ProviderManager
 * @description Handles detection, registration, and coordination of calendar providers
 *
 * @example
 * ```typescript
 * // Register a new provider
 * ProviderManager.registerProvider(new CustomProvider());
 *
 * // Get active provider
 * const provider = ProviderManager.getActiveProvider();
 * ```
 */
export class ProviderManager {
  // Implementation
}
```

## Documentation Maintenance

### Regular Review Schedule
- **Before each release**: Review all repository documentation for accuracy
- **Monthly**: Update local-docs with development progress and decisions
- **When adding features**: Update relevant user and developer guides
- **When fixing bugs**: Update known issues, log details in local-docs

### Cross-Reference Patterns

#### Repository Documentation
```markdown
<!-- ✅ Generic references only -->
[User Guide](docs/USER-GUIDE.md)
[API Reference](docs/DEVELOPER-GUIDE.md)
[Known Issues](KNOWN-ISSUES.md)

<!-- ❌ No local-docs references in repository -->
```

#### Local-Docs Documentation
```markdown
<!-- ✅ Can reference repository and local-docs -->
> **Public Documentation**: [User Guide](../../[module-name]/docs/USER-GUIDE.md)
> **Related Tickets**: [[FOU-XX]], [[PER-YY]]
> **Planning**: [[planning/RELEASE-PLAN.md]]

<!-- ✅ Use Obsidian wiki-links for local-docs -->
**Status**: [[FOU-XX]] complete, working on [[FOU-YY]]
**Context**: [[development/CLAUDE.md]]
**Cross-Module**: [[../other-module/architecture/pattern.md]]
```

## Localization Standards

### Language File Structure
```
languages/
├── en.json           # English (base language)
├── es.json           # Spanish
├── fr.json           # French
└── de.json           # German
```

### Translation Key Patterns
```json
{
  "MODULE-NAME": {
    "settings": {
      "enableFeature": {
        "name": "Enable Feature",
        "hint": "Enable this feature for enhanced functionality"
      }
    },
    "ui": {
      "buttons": {
        "save": "Save",
        "cancel": "Cancel"
      }
    },
    "errors": {
      "noProvider": "No calendar provider available"
    }
  }
}
```

### Localization Usage
```typescript
// Get localized string
const message = game.i18n.localize('MODULE-NAME.ui.buttons.save');

// Format with parameters
const error = game.i18n.format('MODULE-NAME.errors.providerFailed', {
  provider: 'Seasons & Stars'
});
```

## MDX and Documentation Site Considerations

### MDX Troubleshooting
**Issue**: Docusaurus uses MDX, which can misinterpret certain characters as JSX syntax.

**Common Problems**:
- TypeScript type annotations with angle brackets: `Promise<Actor>`
- Union types with pipes: `string|number`
- Generic types: `Array<string>`

**Solutions**:
```markdown
<!-- ❌ This breaks MDX -->
**Returns:** Promise<Array<string>>

<!-- ✅ This works -->
**Returns:** `Promise<Array<string>>`

<!-- ✅ Alternative -->
**Returns:** Promise&lt;Array&lt;string&gt;&gt;
```

### Documentation Site Integration
- Use code blocks for complex type definitions
- Wrap TypeScript syntax in backticks for inline code
- Test MDX compilation before publishing
- Use HTML entities for special characters when needed

## Quality Assurance for Documentation

### Documentation Testing
- **Installation Instructions**: Test in clean environment
- **Code Examples**: All examples must be tested and verified
- **API Examples**: JSDoc examples validated against implementation
- **Links**: All internal and external links verified

### Accuracy Verification
- **Feature Claims**: All claims verified against actual implementation
- **Version References**: Version information matches actual releases
- **System Compatibility**: Compatibility claims tested with actual systems
- **Integration Examples**: All integration patterns tested

### User Experience
- **Clear Navigation**: Logical organization and easy discovery
- **Progressive Disclosure**: Basic to advanced information flow
- **Visual Aids**: Screenshots and diagrams where helpful
- **Search Optimization**: Good headings and keyword usage

This documentation framework ensures consistent, accurate, and maintainable documentation across all Foundry module projects while protecting sensitive development information.