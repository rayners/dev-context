# FoundryVTT Testing Practices & Standards

*Comprehensive testing patterns for Foundry module development*

## Testing Framework Standards

### Dual Testing Approach
- **Vitest**: Unit and integration tests
- **Quench**: E2E tests in actual Foundry environment

### Test Command Standardization (CRITICAL)
- **Development**: Use `npm test` (watch mode) or `npm run test:run` (single run)
- **CI Alignment**: Local commands must run same comprehensive test suite as CI
- **NEVER use `npm run test:workspaces`** - incomplete coverage, hides failures
- **Verification**: Full test suite should run 80+ test files, 1000+ individual tests for complex modules

### Coverage Requirements
- **Core Business Logic**: 90%+ test coverage required
- **Public APIs**: 100% test coverage for all exported functions
- **Integration Points**: All Foundry API interactions must be tested
- **Overall Target**: 70%+ overall coverage, 90%+ for core functionality

## TDD Workflow (Test-First Development)

### Red-Green-Refactor Cycle
1. **Red Phase**: Write failing test first
2. **Green Phase**: Minimal implementation to pass
3. **Refactor Phase**: Improve code while maintaining tests
4. **Regression Prevention**: Tests must prevent known issues

### Test Organization
```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    // Setup mocks and test data
  });

  it('should handle success case', () => {
    // Test expected behavior
  });

  it('should handle error gracefully', () => {
    // Test error scenarios
  });
});
```

## Unit Testing with Vitest

### Standard Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      exclude: ['test/', 'dist/', 'node_modules/']
    }
  }
});
```

### Mock Management Patterns

#### Foundry Globals Mocking
```typescript
// test/setup.ts
import { vi } from 'vitest';

// Mock Foundry globals
global.game = {
  modules: new Map(),
  system: { id: 'test-system' },
  time: { worldTime: 0 }
};

global.ui = {
  notifications: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
};
```

#### Singleton Mock Reset (CRITICAL PATTERN)
**Issue**: Singleton classes maintain state between tests, causing mock failures.

**Solution**: Always reset singleton instances in `beforeEach()`:
```typescript
beforeEach(() => {
  vi.clearAllMocks();

  // Reset ALL singleton instances
  // @ts-ignore
  FoodGatheringSystem.instance = undefined;
  // @ts-ignore
  FoodTablesManager.instance = undefined;

  // THEN set up mocks
  (MyClass.getInstance as Mock).mockReturnValue(mockInstance);
});
```

### System-Specific Testing

#### Dragonbane Weapon Structure
**Issue**: Test weapon objects must match exact Dragonbane type definitions.

**Correct Structure**:
```typescript
const mockWeapon = {
  type: 'weapon',
  system: {
    calculatedRange: 20,    // NOT 'range'
    features: { thrown: false },
    skill: { name: 'bows' }
  }
};
```

#### Type Guards in Tests
```typescript
// Use type guards for system-specific testing
if (isDragonbaneActor(actor)) {
  const skill = actor.getSkill(skillName);
  if (skill && isDragonbaneSkill(skill)) {
    expect(skill.system.value).toBe(15);
  }
}
```

## E2E Testing with Quench

### Quench Setup
1. Install the Quench module in Foundry VTT
2. Enable both Quench and your module
3. Click the flask icon to open Quench UI
4. Run your module's test suites

### Quench Test Registration
```typescript
// Register a test batch
quench.registerBatch('module-name.feature', (context) => {
  const { describe, it, assert, beforeEach, afterEach } = context;

  describe('Feature Tests', function() {
    let testActor: Actor;

    beforeEach(async function() {
      // Create test data
      testActor = await Actor.create({
        name: 'Test',
        type: 'journeys-and-jamborees.party'  // Use namespaced type
      });
      patchPartyActor(testActor); // Ensure custom methods available
    });

    afterEach(async function() {
      // ALWAYS clean up
      if (testActor) await testActor.delete();
    });

    it('should test real Foundry interactions', async function() {
      // Test with actual Foundry APIs
      assert.ok(testActor.id, 'Actor should have ID');
    });
  });
});
```

### Quench Best Practices
1. **Always clean up**: Delete any created documents in `afterEach`
2. **Use shorter timeouts**: Set shorter timeouts for test environments
3. **Test real interactions**: Quench is best for testing actual Foundry behavior
4. **Check system requirements**: Some tests only run for specific game systems
5. **Handle async properly**: Most Foundry operations are asynchronous

### Actor Type Namespacing
When creating actors in tests, use the namespaced type:
```javascript
// WRONG
Actor.create({ type: 'party' })

// CORRECT
Actor.create({ type: 'journeys-and-jamborees.party' })
```

### Sheet Rendering Tests
Sheet rendering is asynchronous. Add delays for DOM updates:
```javascript
await sheet.render(true, { force: true });
await new Promise(resolve => setTimeout(resolve, 100));
```

## Integration Testing Patterns

### System Adapter Testing
```typescript
describe('SystemAdapter', () => {
  it('should detect skills correctly for each system', () => {
    // Test D&D 5e
    mockGame.system.id = 'dnd5e';
    const dnd5eSkills = SkillManager.getAvailableSkills();
    expect(dnd5eSkills).toContain('Survival');

    // Test Dragonbane
    mockGame.system.id = 'dragonbane';
    const dbSkills = SkillManager.getAvailableSkills();
    expect(dbSkills).toContain('BUSHCRAFT');
  });
});
```

### API Integration Testing
```typescript
describe('Module API', () => {
  it('should expose correct public interface', () => {
    const api = game.modules.get('module-id').api;
    expect(api).toBeDefined();
    expect(typeof api.someMethod).toBe('function');
  });
});
```

## Testing Requirements for New Features

### What to Test
1. **All public methods and APIs**
2. **Error handling and edge cases**
3. **User interactions and workflows**
4. **System-specific behavior**
5. **Permissions and security**

### Test Categories
1. **Unit Tests** (in `test/` directory):
   - Test individual classes and functions in isolation
   - Mock Foundry globals and external dependencies
   - Aim for high code coverage (>80%)
   - Use descriptive test names that explain expected behavior

2. **Integration Tests**:
   - Test interactions between multiple components
   - Verify features work correctly with mocked Foundry APIs
   - Test both success and failure scenarios

3. **E2E Tests** (Quench):
   - Test features in actual Foundry environment
   - Verify UI interactions work correctly
   - Test with different game systems when applicable

## Common Testing Gotchas

### Empty Skill Choices
In test environments, skill choices may be empty if no actors exist. This is normal - tests should handle this gracefully.

### Setting Names
Skill-related settings use the "SkillName" suffix:
- `pathfinderSkillName` (NOT `pathfinderSkill`)
- `lookoutSkillName`
- `quartermasterSkillName`

### TableResult.text Deprecation
In newer Foundry versions, use `result.name` or `result.description` instead of `result.text`.

## Test Data Management

### Mock Data Patterns
```typescript
// Create comprehensive mock objects
const mockActor = {
  id: 'test-actor-id',
  name: 'Test Actor',
  type: 'character',
  system: {
    skills: {
      survival: { total: 15, mod: 3 }
    }
  },
  items: new Collection(),
  getSkill: vi.fn().mockReturnValue({
    system: { value: 15 }
  })
};
```

### Data Cleanup Strategies
```typescript
afterEach(async () => {
  // Clean up all test data
  const testActors = game.actors.filter(a => a.name.startsWith('Test'));
  for (const actor of testActors) {
    await actor.delete();
  }

  // Reset global state
  vi.clearAllMocks();
});
```

## Performance Testing

### Test Suite Performance
- **Target**: Test suite should complete in under 30 seconds
- **Parallelization**: Use Vitest's parallel execution capabilities
- **Mock Optimization**: Minimize expensive mock operations

### Memory Management in Tests
- Always clean up created documents
- Reset singleton instances between tests
- Clear mock state regularly
- Monitor test suite memory usage for large test runs

## Documentation Testing

### JSDoc Example Validation
- All API examples in JSDoc must be tested
- Code examples in documentation must be verified
- Integration patterns should have corresponding tests

### README Testing
- Installation instructions tested in clean environment
- All documented features have corresponding tests
- Configuration examples verified to work