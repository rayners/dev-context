# FoundryVTT Module Automation Infrastructure

*Professional-grade CI/CD and automation patterns for Foundry module development*

## Overview

This document captures the complete automation infrastructure patterns established across FoundryVTT module projects. These patterns provide enterprise-grade CI/CD, quality assurance, and release automation.

**Reference Implementations**: Seasons & Stars, Errors & Echoes, Journeys & Jamborees

## GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)

**Purpose**: Continuous integration with comprehensive quality checks

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: read  # Required for @rayners GitHub packages
    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          registry-url: 'https://npm.pkg.github.com'

      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Run linting
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

      - name: Type checking
        run: npm run typecheck

      - name: Run tests
        run: npm run test:run

      - name: Run build
        run: npm run build

      - name: Generate coverage report
        if: matrix.node-version == 18
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        if: matrix.node-version == 18
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false
```

**Key Features**:
- **Multi-Node Testing**: Tests on Node 18 and 20 for compatibility
- **GitHub Packages Support**: Proper authentication for private @rayners packages
- **Granular Steps**: Individual feedback for lint, format, typecheck, test, build
- **Code Coverage**: Generates and uploads coverage reports
- **Comprehensive Quality Gates**: All quality checks must pass

### Release Workflow (`.github/workflows/release.yml`)

**Purpose**: Automated module packaging and GitHub release creation

```yaml
name: Release Module

on:
  release:
    types: [published]

jobs:
  build-and-release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Build and Release Module
        id: module_release
        uses: rayners/foundry-module-actions/release@v2
        with:
          node-version: '18'
          build-command: 'npm run build'
          working-directory: 'dist'
          module-files: 'module.js module.json templates/ styles/ languages/ README.md CHANGELOG.md LICENSE'
          zip-name: 'module-name.zip'
```

**Key Features**:
- **foundry-module-actions@v2**: Latest stable automation
- **Comprehensive File Packaging**: Includes all necessary module files plus documentation
- **Automatic Asset Creation**: Generates module.zip and uploads to GitHub release
- **Version Tag Support**: Extracts version from Git tags

### Security Workflow (`.github/workflows/security.yml`)

**Purpose**: CodeQL analysis and dependency vulnerability scanning

```yaml
name: Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * MON'  # Weekly scheduled scan

jobs:
  audit:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: read
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'

      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Run security audit
        run: npm audit --audit-level moderate

      - name: Check for known vulnerabilities
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

  codeql:
    name: CodeQL Analysis
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      packages: read
      security-events: write
    strategy:
      fail-fast: false
      matrix:
        language: ['typescript']
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
          queries: security-extended,security-and-quality

      - name: Build project
        run: npm run build

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
```

**Key Features**:
- **CodeQL Analysis**: Advanced security vulnerability detection
- **Dependency Audit**: npm security audit with moderate threshold
- **Trivy Scanning**: File system vulnerability scanning
- **Scheduled Scanning**: Weekly automated security reviews

### Release-Please Workflow (`.github/workflows/release-please.yml`)

**Purpose**: Automated changelog generation and version management

```yaml
name: Release Please

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    outputs:
      release_created: ${{ steps.release.outputs.release_created }}
      tag_name: ${{ steps.release.outputs.tag_name }}
    steps:
      - uses: googleapis/release-please-action@v4
        id: release
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          release-type: node
          package-name: module-name
          extra-files: |
            module.json
          version-file: package.json

  build-and-upload:
    if: ${{ needs.release-please.outputs.release_created }}
    needs: release-please
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Validate project
        run: npm run validate

      - name: Build project
        run: npm run build

      - name: Upload Release Assets
        uses: rayners/foundry-module-actions/release@v2
        with:
          working-directory: 'dist'
          module-files: 'module.js module.json templates/ styles/ languages/ README.md CHANGELOG.md LICENSE'
          zip-name: 'module-name.zip'
```

**Key Features**:
- **Automatic Changelog**: Generates CHANGELOG.md from conventional commits
- **Version Synchronization**: Updates both package.json and module.json
- **Release Automation**: Creates GitHub releases automatically
- **Quality Validation**: Runs full validation before release

## Package.json Scripts Configuration

### Standard Script Configuration

```json
{
  "scripts": {
    "build": "rollup -c",
    "build:watch": "rollup -c -w",
    "dev": "rollup -c -w",
    "clean": "rm -rf dist",
    "prebuild": "npm run clean",

    "typecheck": "tsc --noEmit",

    "test": "vitest run",
    "test:run": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",

    "lint": "eslint src",
    "lint:fix": "eslint src --fix",

    "format": "prettier --write \"src/**/*.{ts,js,json}\" \"*.{js,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,js,json}\" \"*.{js,json,md}\"",

    "validate": "npm run lint && npm run format:check && npm run typecheck && npm run test && npm run build",
    "prepare": "npm run build"
  }
}
```

**Script Categories**:

1. **Build Scripts**:
   - `build`: Production build
   - `build:watch`: Development build with file watching
   - `dev`: Alias for development workflow
   - `clean`: Remove build artifacts

2. **Quality Assurance**:
   - `typecheck`: TypeScript type checking without compilation
   - `lint`: ESLint code quality checking
   - `format`: Prettier code formatting
   - `validate`: Complete quality pipeline

3. **Testing**:
   - `test:run`: Explicit test execution (required for CI)
   - `test:watch`: Interactive test development
   - `test:coverage`: Code coverage reports

## Development Dependencies

### Core Tooling Dependencies

```json
{
  "devDependencies": {
    "@rayners/foundry-dev-tools": "^1.0.6",
    "@rayners/foundry-test-utils": "^1.0.0",
    "@types/node": "^20.10.4",
    "@vitest/ui": "^3.1.0",
    "rollup": "^4.7.0",
    "typescript": "^5.3.3",
    "vitest": "^3.1.0"
  }
}
```

**Dependency Categories**:

1. **FoundryVTT Tools**:
   - `@rayners/foundry-dev-tools`: ESLint, Prettier, Rollup configs
   - `@rayners/foundry-test-utils`: Foundry mocking and test utilities

2. **Build System**:
   - `rollup`: Module bundling with TypeScript support
   - `typescript`: TypeScript compiler and type checking

3. **Testing Framework**:
   - `vitest`: Fast unit testing with native ES modules support
   - `@vitest/ui`: Interactive test development interface

## Configuration Files

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "extends": "@rayners/foundry-dev-tools/configs/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "typeRoots": ["./node_modules/@types", "./src/types"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

### ESLint Configuration (`eslint.config.js`)

```javascript
import { foundryConfigs } from '@rayners/foundry-dev-tools';

export default [
  ...foundryConfigs,
  {
    ignores: ['dist/', 'node_modules/']
  }
];
```

### Prettier Configuration (`prettier.config.js`)

```javascript
export { default } from '@rayners/foundry-dev-tools/configs/prettier.config.js';
```

### Vitest Configuration (`vitest.config.ts`)

```typescript
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

## Quality Assurance Standards

### Multi-Node Testing
- **Node 18**: LTS baseline for compatibility
- **Node 20**: Current LTS for forward compatibility
- **Matrix Strategy**: Ensures broad runtime compatibility

### Code Coverage Requirements
- **Minimum**: 80% coverage for core business logic
- **Exclusions**: Test files, build artifacts, type definitions
- **Reporting**: HTML, LCOV, and text formats

### Code Quality Standards
- **ESLint**: Comprehensive rule set from @rayners/foundry-dev-tools
- **Prettier**: Consistent code formatting across all files
- **TypeScript**: Strict mode for maximum type safety
- **Conventional Commits**: Required for automated changelog generation

## Release Management

### Module Distribution Model

FoundryVTT modules are **distributed software packages** installed by users into their own Foundry instances:

- **Downloadable Artifacts**: Users download module.zip files from GitHub releases
- **Local Installation**: Each user installs into their own Foundry VTT instance
- **No Central Deployment**: There is no singular "production" environment you control
- **User-Managed Updates**: Users must manually update to newer versions
- **Persistence**: Released versions remain available; you cannot force rollbacks

**Automation Implications**:
- Release artifacts must be complete and self-contained
- Automated testing must catch issues before release publication
- CI/CD pipelines must validate thoroughly since post-release fixes require user action
- Asset packaging must include all necessary files for standalone operation

### Semantic Versioning
- **v0.x.x**: Development releases, breaking changes allowed
- **v1.x.x**: Stable API, only backward-compatible changes
- **Patch**: Bug fixes and small improvements
- **Minor**: New features and functionality
- **Major**: Breaking changes and API redesigns

### Automated Changelog
- **Conventional Commits**: feat:, fix:, docs:, style:, refactor:, test:, chore:, ci:
- **CI/CD Commits**: All changes solely within `.github/` directory should use `ci:` prefix
- **Release Please**: Automatic version bumping and changelog generation
- **GitHub Integration**: Automatic release creation and asset upload

### Asset Distribution
- **module.zip**: Complete module package with all assets
- **module.json**: Manifest file for Foundry installation
- **Documentation**: README, CHANGELOG, LICENSE included in releases
- **Automatic Upload**: No manual asset management required

## Implementation Checklist

### New Repository Setup
- [ ] Copy workflow files (ci.yml, release.yml, release-please.yml, security.yml)
- [ ] Configure package.json scripts (build, test, lint, format, validate)
- [ ] Add development dependencies (@rayners packages, testing tools)
- [ ] Set up configuration files (tsconfig, eslint, prettier, vitest)
- [ ] Configure module.json with release URLs
- [ ] Set up conventional commit workflow
- [ ] Verify GitHub packages authentication

### Quality Gates
- [ ] Multi-node CI testing (18, 20)
- [ ] Code coverage reporting (80%+ target)
- [ ] ESLint and Prettier validation
- [ ] TypeScript strict mode compilation
- [ ] Automated build verification
- [ ] Security scanning (CodeQL, Trivy, npm audit)

### Release Preparation
- [ ] Semantic versioning compliance
- [ ] Conventional commit history
- [ ] Complete test coverage
- [ ] Documentation accuracy
- [ ] Legal compliance (LICENSE file)
- [ ] Asset packaging verification

## Common Issues and Solutions

### GitHub Packages Authentication
All workflows that install dependencies need proper authentication:

```yaml
permissions:
  contents: read
  packages: read  # Required for @rayners GitHub packages

steps:
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '18'
      registry-url: 'https://npm.pkg.github.com'

  - name: Install dependencies
    run: npm ci
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### TypeScript Strict Checking Failures
**Options for handling TypeScript warnings**:

1. **Make TypeScript checking non-blocking** (temporary):
   ```yaml
   - name: Type checking
     run: npm run typecheck || true
   ```

2. **Update TypeScript configuration** (preferred):
   ```json
   {
     "compilerOptions": {
       "strict": false,
       "noImplicitAny": false,
       "strictNullChecks": false
     }
   }
   ```

### SARIF Upload Permission Issues
Ensure proper security-events permission:

```yaml
permissions:
  security-events: write  # Required for SARIF upload
```

## Migration from Existing Infrastructure

### foundry-module-actions v1 → v2
- Update action reference: `rayners/foundry-module-actions/release@v2`
- Add `fetch-depth: 0` to checkout step for version tag extraction
- Update module-files specification to include documentation files

### Adding Release-Please
- Create release-please.yml workflow for automated changelog
- Configure conventional commit requirements
- Set up extra-files synchronization (module.json)
- Integrate with existing release workflow

### CI Workflow Enhancement
- Replace bundled test actions with granular steps
- Add GitHub packages authentication for @rayners dependencies
- Implement multi-node testing matrix (18, 20)
- Add code coverage reporting and upload

This automation infrastructure provides enterprise-grade development workflow that scales across multiple FoundryVTT module repositories while maintaining consistency and quality standards.