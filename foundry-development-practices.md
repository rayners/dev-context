# FoundryVTT Development Practices & Standards

*Compiled from CLAUDE.md files and local-docs for Foundry module development*

## 🚨 CRITICAL SECURITY RESTRICTION 🚨

**FOUNDRY VTT APPLICATION CODE ACCESS IS STRICTLY FORBIDDEN**

**❌ NEVER ACCESS, READ, OR ANALYZE:**
- FoundryVTT application source code (any file from FoundryVTT installation)
- FoundryVTT core system files or proprietary implementation
- Any code within the FoundryVTT application directory
- Internal FoundryVTT modules or core functionality source

**✅ ONLY USE THESE APPROVED SOURCES:**
- Official FoundryVTT API documentation (documentation only)
- Community-maintained type definitions (npm packages)
- Open-source user-created module code
- Published developer guides and tutorials

**This restriction protects legal compliance, respects intellectual property, and maintains security.**

## Development Workflow Standards

### Pre-Commit Requirements

**ALWAYS run before committing:**
```bash
npm run lint
npm run typecheck
npm run test:run  # NOT test:workspaces
npm run build
```

### Module Architecture Standards

#### Naming Conventions
- **Module ID**: `fvtt-` prefix for all FoundryVTT modules
- **Repository**: Match module ID exactly
- **Build System**: TypeScript + Rollup with foundry-dev-tools configuration

#### Build System Configuration
- **TypeScript**: Strict mode compilation with custom type definitions
- **Rollup**: Module bundling with TypeScript support
- **ESLint/Prettier**: Code quality and formatting compliance
- **Package Scripts**: Standardized across all modules

### Quality Requirements (ALWAYS ENFORCED)

#### Documentation Accuracy
- **Code Alignment**: All documented features must exist in current codebase
- **Version Accuracy**: Version references must reflect actual release timeline
- **Date Accuracy**: Never assume or guess dates/times - always use `date` command for accurate timestamps
- **No Hyperbole**: Avoid "works with all systems", "fully tested", "production ready"
- **Verified Claims**: "Designed to work with D&D 5e, PF2e, Dragonbane" (tested systems only)

##### Date and Time Handling (CRITICAL)

**Always use the `date` command** for accurate timestamps in:
- Commit messages and changelogs
- Documentation updates
- Release notes and status reports
- Any content requiring current date/time

**Required Commands**:
```bash
date                                                # Full current date/time
date "+%Y-%m-%d"                                   # ISO format (2024-03-15)
date "+%B %d, %Y"                                  # Long format (March 15, 2024)
TZ=America/New_York date "+%Y-%m-%d %H:%M:%S %Z"   # Full timestamp with EDT/EST timezone
```

**Prohibited**: Never use placeholder dates, assume dates from context, or guess timestamps.

#### Testing Standards (MOSTLY ENFORCED)
- **Core Business Logic**: 90%+ test coverage required
- **TDD Workflow**: Tests first, then implementation for new features
- **Quality Gates**: 100% test pass rate before releases
- **Test Command Standardization**:
  - Use `npm test` (watch mode) or `npm run test:run` (single run)
  - **NEVER use `npm run test:workspaces`** - incomplete coverage

## System-Agnostic Design Principles

### Core Patterns
- **Graceful Degradation**: Handle missing game system features elegantly
- **Soft Dependencies**: Optional integration with other modules
- **API Safety**: Always use optional chaining and try-catch for external APIs
- **Feature Detection**: Runtime capability detection rather than version checking

### Foundry Integration Best Practices
- **Hook Usage**: Use standard Foundry patterns, never globalThis for module integration
- **API Access**: Use `game.modules.get('module-id').api` or `CONFIG.moduleName`
- **Document Integration**: Follow Foundry's Document/DocumentSheet patterns
- **Settings Management**: Use Foundry's settings API consistently

## Release Process

### Version Management
1. **Test Validation**: All unit and integration tests must pass
2. **Build Verification**: Successful `npm run build` required
3. **Documentation Update**: All user-facing docs reflect current state
4. **Version Management**: Semantic versioning with clear changelog
5. **Artifact Generation**: GitHub workflows handle release packaging

### module.json URL Requirements
**CRITICAL**: Never use `/latest/` in module.json manifest or download URLs.

**❌ WRONG**:
```json
{
  "manifest": "https://github.com/owner/repo/releases/latest/download/module.json",
  "download": "https://github.com/owner/repo/releases/latest/download/module.zip"
}
```

**✅ CORRECT**:
```json
{
  "manifest": "https://github.com/owner/repo/releases/download/v0.1.0/module.json",
  "download": "https://github.com/owner/repo/releases/download/v0.1.0/module.zip"
}
```

**Why this matters**:
- `/latest/` breaks Foundry's update mechanism
- Users need stable, version-specific URLs
- Foundry expects each module.json to point to its exact version

## Error Handling Patterns

### User-Facing vs Developer Errors
- **User-Facing Errors**: Clear, actionable error messages
- **Developer Errors**: Detailed logging for debugging
- **Graceful Failures**: Module continues functioning when possible
- **Error Recovery**: Automatic retry for transient failures

### Performance Considerations
- **Lazy Loading**: Load resources only when needed
- **Event Optimization**: Minimize hook listeners and event handlers
- **Memory Management**: Proper cleanup of resources and listeners
- **Bundle Size**: Optimize for minimal impact on Foundry load times

## Documentation Standards

### Public Documentation Focus
- **User Value**: Focus on user value, avoid implementation details
- **Version References**: Use generic version references ("Added in v0.2.0")
- **Accuracy Requirements**: All claims must be verifiable in code
- **Installation Instructions**: Must be tested in clean environment

### Prohibited Language
- **Hyperbolic Claims**: "works with all systems", "fully tested", "production ready"
- **Absolute Statements**: "never fails", "always works", "100% compatible"
- **Unverified Claims**: "extensively tested" without test suite evidence
- **Future Promises**: "will support" for unimplemented features

## Communication Standards
- Provide honest, unvarnished technical assessments
- Don't inflate the significance of incremental improvements
- Call maintenance work what it is rather than overselling it
- Apply realistic evaluation standards to features, releases, and technical decisions

## Foundry-Specific Patterns

### Module Loading Order (CRITICAL UNDERSTANDING)

**⚠️ ABSOLUTE TRUTH: Module relationships in module.json DO NOT control loading order**

#### What Relationships Actually Do
- **Installation Only**: Prompt users to install required/recommended modules
- **UI Warnings**: Show compatibility warnings in module management
- **Metadata Only**: Provide information to users and package managers

#### What Relationships DO NOT Do
- **❌ DO NOT control which module loads first**
- **❌ DO NOT guarantee load order between modules**
- **❌ DO NOT make one module wait for another to initialize**
- **❌ DO NOT affect ESModule script loading sequence**

#### Module Loading Reality
- **ESModule files load asynchronously** with unpredictable order
- **Parse-time code executes** when browser parses each file independently
- **No mechanism exists** to control cross-module loading order in Foundry
- **Hook execution order** (init → setup → ready) is consistent, but which module's hooks fire first within each phase is unpredictable

#### Architectural Implications
When building compatibility bridges or module integrations:

1. **Cannot rely on load order**: Your module may load before OR after other modules
2. **Parse-time availability**: If you expose globals at parse time, other modules may or may not see them depending on load order
3. **Hook-based solutions**: Use hooks (especially `init`) to register as early as possible, but understand other modules' parse-time code has already run
4. **Defensive programming**: Assume worst-case timing for all integrations

#### Common Mistake
```javascript
// ❌ WRONG: Assuming relationships guarantee this module loads after dependency
import { SomeAPI } from 'other-module';  // May not exist yet!

// ✅ CORRECT: Check availability and handle missing dependencies
Hooks.once('init', () => {
  const otherModule = game.modules.get('other-module');
  if (otherModule?.active) {
    // Safe to integrate
  }
});
```

### Common Implementation Patterns
- **Module Registration**: Standard module.json and main entry point
- **Localization**: Full i18n support with English base language
- **Asset Management**: Proper handling of templates, styles, and static assets
- **Canvas Integration**: Use proper layer architecture for visual elements

### Document Lifecycle Checkpoints
- **Reference**: [From Load to Render — FoundryVTT Community Wiki](https://foundryvtt.wiki/en/development/guides/from-load-to-render)
- **Server to Client**: `Game.getData()` hydrates world collections, and document constructors run DataModel `_initializeSource` and `_initialize` to migrate, clean, and validate source data before populating live instances.
- **Preparation Pipeline**: `ClientDocument#prepareData` defers to `prepareBaseData`, `prepareEmbeddedDocuments`, and `prepareDerivedData`—use these hooks for default state setup, active effect aggregation, and computed values instead of mutating data during sheet rendering.
- **Sheet Rendering**: DocumentSheet (App V1) and DocumentSheetV2 rely on `getData`, `_prepareContext`, and `_preparePartContext` to build template context; keep display-only logic here and continue to route business rules through the earlier lifecycle stages.

### Known Gotchas
- **Actor Type Namespacing**: Use full namespaced types (`'journeys-and-jamborees.party'`)
- **Foundry Object Updates**: Use deletion syntax with `-=` prefix for removing object keys
- **Sheet Rendering**: Asynchronous - add delays for DOM updates in tests
- **Simple Worldbuilding**: Has strict template requirements, check `game.system.id === 'worldbuilding'`

## Development Environment Requirements

### Required Tools
- **Node.js**: Version 18+ (18 and 20 tested in CI)
- **npm**: For dependency management
- **TypeScript**: Strict mode compilation
- **Git**: Conventional commits for automated changelog

### Development Dependencies
- `@rayners/foundry-dev-tools`: ESLint, Prettier, Rollup configs
- `@rayners/foundry-test-utils`: Foundry mocking and test utilities
- `vitest`: Fast unit testing with native ES modules support
- `@vitest/ui`: Interactive test development interface

### Context Loading Priority
1. Current module state and recent changes
2. Related session logs and debugging patterns
3. System requirements and edge cases
4. Integration requirements and compatibility constraints