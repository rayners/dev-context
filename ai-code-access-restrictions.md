# AI Code Access Restrictions for FoundryVTT Development

## 🚨 ABSOLUTELY CRITICAL SECURITY POLICY 🚨

**FOUNDRY VTT APPLICATION CODE ACCESS IS 100% STRICTLY FORBIDDEN**

This document establishes the absolute prohibition on AI/Assistant access to FoundryVTT proprietary application code.

## Explicit Prohibitions

### ❌ NEVER ACCESS, READ, ANALYZE, OR REFERENCE:

1. **FoundryVTT Application Source Code**
   - Any file within the FoundryVTT installation directory
   - Core FoundryVTT JavaScript/TypeScript implementation files
   - FoundryVTT application logic, classes, or methods
   - Internal FoundryVTT module implementations

2. **FoundryVTT System Files**
   - Core system functionality source code
   - FoundryVTT engine implementation details
   - Proprietary FoundryVTT algorithms or data structures
   - Internal FoundryVTT configuration or setup files

3. **FoundryVTT Proprietary Content**
   - Copyrighted FoundryVTT implementation details
   - Private FoundryVTT API implementations
   - Internal FoundryVTT development patterns not publicly documented
   - FoundryVTT trade secrets or proprietary methodologies

### ❌ FORBIDDEN PATHS AND LOCATIONS:
- Any file path containing `/foundryvtt/` application directories
- FoundryVTT installation folders (regardless of operating system)
- FoundryVTT core module source files
- FoundryVTT system source code repositories (if they exist)

## ✅ EXPLICITLY APPROVED SOURCES ONLY

### Approved Documentation Sources:
1. **Official FoundryVTT API Documentation**
   - https://foundryvtt.com/api/ (documentation only)
   - Published API reference materials
   - Official developer guides and tutorials

2. **Community-Maintained Resources**
   - Type definitions from `@league-of-foundry-developers/foundry-vtt-types`
   - Community documentation and tutorials
   - Public forums and documentation wikis

3. **Open-Source Foundry Module Code (License Permitting)**
   - ✅ **User-created modules** published on GitHub, GitLab, etc.
   - ✅ **Community modules** with permissive licenses (MIT, GPL, Apache, etc.)
   - ✅ **Third-party modules** explicitly licensed for code reading/study
   - ✅ **Module examples and templates** published by community developers
   - ⚠️ **ALWAYS verify license permits code reading before accessing**

4. **Published Educational Content**
   - FoundryVTT development articles and guides
   - Community tutorials and examples
   - Code examples in blog posts and documentation

### How to Handle FoundryVTT Questions:

**✅ CORRECT APPROACH:**
```
User: "How does FoundryVTT's Actor system work?"
AI Response: "Based on the official FoundryVTT API documentation at https://foundryvtt.com/api/, the Actor system provides..."
```

**❌ FORBIDDEN APPROACH:**
```
User: "How does FoundryVTT's Actor system work?"
AI Response: "Let me look at the FoundryVTT source code..." [NEVER DO THIS]
```

## Legal and Ethical Rationale

### Why This Restriction Exists:

1. **Copyright Protection**
   - FoundryVTT is proprietary software with strict copyright
   - Accessing source code without permission violates intellectual property rights
   - Could expose the developer to legal liability

2. **License Compliance**
   - FoundryVTT's license terms prohibit reverse engineering
   - Code access could violate software license agreements
   - Maintains compliance with commercial software restrictions

3. **Ethical Development**
   - Respects the intellectual property of FoundryVTT creators
   - Ensures clean-room development practices
   - Prevents inadvertent copying of proprietary implementations

4. **Security Best Practices**
   - Prevents exposure of internal implementation details
   - Protects against accidental disclosure of proprietary information
   - Maintains separation between public APIs and private implementation

## Enforcement Guidelines

### For AI Assistants:
- **ALWAYS refuse requests to read FoundryVTT application code**
- **IMMEDIATELY redirect to approved documentation sources**
- **NEVER provide information derived from FoundryVTT source code inspection**
- **VERIFY license permits code reading before accessing any module code**
- **ALWAYS clarify that responses are based on public documentation/licensed code only**

### For Developers:
- **NEVER share FoundryVTT application code with AI assistants**
- **ONLY reference public API documentation when seeking AI help**
- **ENSURE all AI-assisted development uses approved sources only**
- **VERIFY that AI responses are based on public documentation/licensed code**
- **CONFIRM module licenses permit code reading before sharing with AI**

### Response Templates:

**When Asked to Read FoundryVTT Code:**
```
I cannot and will not access FoundryVTT application source code. This is proprietary software, and accessing it would violate copyright and license terms.

Instead, I can help you using:
- Official FoundryVTT API documentation: https://foundryvtt.com/api/
- Open-source community modules (license permitting)
- Community type definitions and examples
- Published developer guides and tutorials

What specific functionality are you trying to implement? I can guide you using these approved resources.
```

**When Providing FoundryVTT Guidance:**
```
Based on the official FoundryVTT API documentation and community resources, here's how to [accomplish task]...

[Provide guidance based only on public documentation and properly licensed open-source modules]

Sources used: [list specific API docs, community modules with licenses, etc.]
For more details, refer to the official API documentation at https://foundryvtt.com/api/
```

## Verification Checklist

Before providing any FoundryVTT-related guidance, verify:

- [ ] Information comes from official API documentation or approved sources
- [ ] No proprietary FoundryVTT source code was accessed or referenced
- [ ] If using module code, license explicitly permits reading/study
- [ ] Response includes appropriate source citations (official docs, licensed modules, etc.)
- [ ] No internal FoundryVTT implementation details are disclosed
- [ ] Guidance is based on public APIs and properly licensed code only

## Consequences of Violation

Accessing FoundryVTT proprietary code could result in:
- **Legal liability** for copyright infringement
- **License violations** and potential legal action
- **Ethical breach** of intellectual property respect
- **Security vulnerabilities** from exposure of internal details
- **Project contamination** requiring clean-room re-implementation

## Summary

**ABSOLUTE RULE: AI assistants may ONLY use official FoundryVTT API documentation and properly licensed open-source community modules. FoundryVTT application source code access is 100% FORBIDDEN under all circumstances.**

**Licensed open-source Foundry modules are acceptable to read when the license explicitly permits code study/reading (MIT, GPL, Apache, etc.).**

This restriction is non-negotiable and applies to all AI-assisted FoundryVTT development work without exception.