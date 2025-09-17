# External Documentation References

*Key external resources for FoundryVTT module development*

## 🚨 CRITICAL SECURITY RESTRICTION 🚨

**FOUNDRY VTT APPLICATION CODE ACCESS IS STRICTLY FORBIDDEN**

### AI/Assistant Code Access Policy

**❌ NEVER ACCESS OR READ:**
- FoundryVTT application source code (any file from the FoundryVTT installation)
- FoundryVTT core system files
- FoundryVTT proprietary implementation details
- Any code within the FoundryVTT application directory
- Internal FoundryVTT modules or core functionality source code

**✅ ONLY ACCESS THESE APPROVED SOURCES:**
- **Official FoundryVTT API Documentation**: https://foundryvtt.com/api/ (documentation only)
- **Published FoundryVTT developer guides** (documentation only)
- **Community-maintained type definitions** (npm packages, GitHub repositories)
- **Open-source module code** (user-created modules only)
- **Community documentation and tutorials**

### Why This Restriction Exists
- **Legal Protection**: FoundryVTT application code is proprietary and copyrighted
- **License Compliance**: Accessing proprietary code could violate software licenses
- **Security**: Prevents exposure of internal implementation details
- **Ethics**: Respects intellectual property rights of FoundryVTT developers

### How to Get FoundryVTT Information
**Instead of reading FoundryVTT code:**
1. **Use Official API Documentation**: https://foundryvtt.com/api/
2. **Read Published Guides**: https://foundryvtt.com/article/module-development/
3. **Use Community Type Definitions**: `@league-of-foundry-developers/foundry-vtt-types`
4. **Reference Community Modules**: Open-source module implementations
5. **Ask Specific Questions**: Request clarification on API usage patterns

**This restriction applies to ALL AI assistants and automated tools working on FoundryVTT-related projects.**

## FoundryVTT Core Documentation

### Official Documentation
- **FoundryVTT API Documentation**: https://foundryvtt.com/api/
- **Module Development Guide**: https://foundryvtt.com/article/module-development/
- **Package Development**: https://foundryvtt.com/article/package-development/
- **Localization Guide**: https://foundryvtt.com/article/localization/

### Community Resources
- **FoundryVTT Hub**: https://www.foundryvtt-hub.com/
- **FoundryVTT Community Wiki**: https://foundryvtt.wiki/
- **League of Extraordinary FoundryVTT Developers**: Discord community

## TypeScript and Foundry Types

### Type Definitions
- **fvtt-types**: Community-maintained TypeScript definitions
  - Repository: https://github.com/League-of-Foundry-Developers/foundry-vtt-types
  - npm: `@league-of-foundry-developers/foundry-vtt-types`
- **Foundry Project Creator**: Bootstrap tool for new modules
  - Repository: https://github.com/League-of-Foundry-Developers/foundry-project-creator

### TypeScript Resources
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **TypeScript Deep Dive**: https://basarat.gitbook.io/typescript/
- **Foundry TypeScript Template**: Reference implementations from community

## Build Tools and Infrastructure

### Rollup Configuration
- **Rollup.js Documentation**: https://rollupjs.org/guide/en/
- **@rollup/plugin-typescript**: TypeScript integration
- **foundry-dev-tools**: Standardized build configurations

### Testing Frameworks
- **Vitest Documentation**: https://vitest.dev/
- **Quench Module**: E2E testing in Foundry
  - Repository: https://github.com/League-of-Foundry-Developers/quench
- **@rayners/foundry-test-utils**: Custom Foundry mocking utilities

### GitHub Actions
- **foundry-module-actions**: Automated release workflows
  - Repository: https://github.com/rayners/foundry-module-actions
- **release-please**: Automated changelog and versioning
  - Repository: https://github.com/googleapis/release-please

## Game System Documentation

### D&D 5th Edition
- **dnd5e System Repository**: https://github.com/foundryvtt/dnd5e
- **D&D 5e Developer Resources**: System-specific APIs and patterns
- **CONFIG.DND5E**: Reference for skills, abilities, and system data

### Pathfinder 2e
- **PF2e System Repository**: https://github.com/foundryvtt/pf2e
- **PF2e Developer Documentation**: Complex modular system architecture
- **PF2e API Examples**: Integration patterns and actor methods

### Dragonbane
- **Dragonbane System Repository**: https://github.com/fvtt-fria-ligan/dragonbane-foundry-vtt
- **ARGON Core**: Foundational components for Dragonbane modules
- **Dragonbane API**: Custom actor methods and skill systems

### Simple Worldbuilding
- **worldbuilding System**: Minimal system for custom game development
- **System Templates**: Basic actor and item templates

## Calendar and Time Management

### Simple Calendar
- **Simple Calendar Repository**: https://github.com/vigoren/foundryvtt-simple-calendar
- **Simple Calendar API**: Integration methods and event system
- **Simple Calendar Documentation**: User guides and developer resources

### Seasons & Stars
- **Repository**: https://github.com/rayners/fvtt-seasons-and-stars
- **Integration Interface**: Bridge interface for compatibility layers
- **Calendar Engine**: Core date arithmetic and calendar interpretation
- **Monorepo Structure**: packages-based architecture with core logic

### SmallTime
- **SmallTime Repository**: UI components for time display
- **Integration Patterns**: Widget positioning and time formatting

## Module Development Patterns

### Party Management
- **Journeys & Jamborees**: Party actor patterns and travel mechanics
- **Forbidden Lands**: Native party actor implementation
- **Permission Models**: Actor ownership and player access patterns

### Document Integration
- **Foundry Document System**: Actor, Item, JournalEntry, and Scene patterns
- **Document Sheets**: Custom sheet development and extension
- **Document Flags**: Module-specific data storage patterns

### Hook System
- **Foundry Hooks Reference**: Complete hook documentation
- **Hook Best Practices**: Registration, cleanup, and performance
- **Custom Hook Events**: Creating module-specific events

## Quality and Standards

### Code Quality Tools
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting standards
- **@rayners/foundry-dev-tools**: Unified configurations

### Documentation Tools
- **Docusaurus**: Documentation site generation
- **MDX**: Enhanced markdown with React components
- **TypeDoc**: API documentation from TypeScript comments

### Testing Best Practices
- **Test-Driven Development**: TDD patterns for Foundry modules
- **Mock Strategies**: Foundry globals and API mocking
- **Coverage Reporting**: Code coverage standards and tools

## Community and Support

### Development Communities
- **FoundryVTT Discord**: #module-development channel
- **Reddit r/FoundryVTT**: Community discussions and support
- **League of Extraordinary FoundryVTT Developers**: Development focus

### Support Channels
- **FoundryVTT Official Support**: Official bug reports and feature requests
- **Module-Specific Issues**: GitHub issue tracking for individual modules
- **Community Forums**: User support and troubleshooting

## Release and Distribution

### Package Management
- **FoundryVTT Package Registry**: Official module distribution
- **GitHub Releases**: Automated asset generation and distribution
- **Version Management**: Semantic versioning and changelog practices

### Legal and Compliance
- **MIT License**: Standard open-source licensing
- **FoundryVTT EULA**: Module distribution requirements
- **Privacy Policies**: User data handling requirements

## Development Tools

### Code Editors
- **Visual Studio Code**: Recommended editor with FoundryVTT extensions
- **TypeScript Extensions**: IntelliSense and debugging tools
- **Foundry Extensions**: Module development helpers

### Browser Development
- **Chrome DevTools**: Debugging Foundry applications
- **Firefox Developer Tools**: Alternative debugging environment
- **FoundryVTT Debug Mode**: Built-in debugging features

### Project Management
- **Linear**: Project tracking and issue management
- **GitHub Projects**: Repository-based project management
- **Obsidian**: Documentation and knowledge management

## Architecture References

### Design Patterns
- **Provider Pattern**: System-agnostic integration
- **Adapter Pattern**: Cross-system compatibility
- **Factory Pattern**: Widget and component creation
- **Observer Pattern**: Event-driven architecture

### System Integration
- **Feature Detection**: Runtime capability discovery
- **Graceful Degradation**: Fallback strategies
- **API Safety**: Optional chaining and error handling
- **Clean Architecture**: Separation of concerns

## Performance and Optimization

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Lazy loading strategies
- **Asset Optimization**: Image and resource compression

### Runtime Performance
- **Event Optimization**: Minimal hook usage
- **Memory Management**: Resource cleanup
- **Lazy Loading**: Deferred resource loading
- **Debouncing**: Update throttling

## Specific Module References

### Calendar Integration
- **Time Conversion**: WorldTime to calendar date conversion
- **Date Arithmetic**: Calendar-aware date calculations
- **Widget Positioning**: UI element placement strategies

### System Compatibility
- **Multi-System Support**: Cross-system module patterns
- **Configuration Management**: System-specific settings
- **Skill Detection**: Dynamic skill system integration

### Error Handling
- **User-Friendly Errors**: Clear error messaging
- **Developer Debugging**: Detailed error logging
- **Recovery Strategies**: Automatic error recovery

These external references provide the foundation for developing robust, compatible, and maintainable FoundryVTT modules following community standards and best practices.