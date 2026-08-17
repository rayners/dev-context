# AI Code Access Restrictions for FoundryVTT Development

## 🚨 POLICY: FoundryVTT Client-Side Code Access Is Conditionally Permitted 🚨

This document establishes the current policy on AI/Assistant access to FoundryVTT's client-side application code. As of FoundryVTT's official **AI Content Policy**, referencing that source code as AI context is permitted **for FoundryVTT package-development purposes only** — it is not an open license to use, redistribute, or repurpose the code more broadly.

**Authoritative source**: FoundryVTT AI Content Policy, Section 4.4 "Software Code" — https://foundryvtt.com/article/ai-policy/

> "To improve the quality of generated results, package authors are permitted to allow AI coding tools to reference Foundry VTT client-side source code as context. Foundry VTT source code may only be provided to an AI model for the specific purpose of Foundry VTT package development and not for the creation of any other work."

This supersedes the prior absolute prohibition on AI assistants reading any FoundryVTT source. Confirmed against the official policy page 2026-08-16.

## ✅ What Is Now Permitted

1. **Reading FoundryVTT Client-Side Source As Context**
   - AI coding tools (including Claude Code) may read/reference FoundryVTT's client-side application source code
   - Permitted specifically to improve the quality of AI-assisted **FoundryVTT package/module development**
   - This includes a locally installed FoundryVTT client (e.g., a version-matched reference install the developer maintains) used purely as read context

2. **Practical Pattern**
   - If a local FoundryVTT client install is available and matches (or is close to) the target Foundry version for the module being developed, it may be read for API/behavior context
   - This repo does not prescribe or assume a specific install path — that's local development environment setup, not a repo concern

## ❌ What Remains Forbidden

1. **Any Purpose Other Than Package Development**
   - The policy scopes permitted access strictly to "the specific purpose of Foundry VTT package development"
   - ❌ Do NOT reference FoundryVTT source to build unrelated projects, a competing VTT platform, or any work outside FoundryVTT package development
   - ❌ Do NOT carry FoundryVTT source/context over into other conversations or projects once the package-development task is done

2. **Redistribution**
   - ❌ Never republish, paste in full, or redistribute FoundryVTT's proprietary source code (in docs, blog posts, public repos, chat logs meant for sharing, etc.)
   - The policy permits AI tools to *read* the code as context — it does not grant a license to copy it into anything that ships or gets published

3. **Copying Implementation Into Published Output**
   - ❌ Do not copy substantial verbatim FoundryVTT implementation into a module's own source code, even if you read it for context
   - Modules should still be built against FoundryVTT's public API surface; reading internals for understanding is different from reimplementing/copying internals into a shipped package

4. **Non-Package Contexts (unchanged)**
   - This policy is specific to FoundryVTT itself. It does not extend to other proprietary/closed-source game systems, modules, or third-party code unless their own license explicitly permits it — see "Other Approved Sources" below for the unrelated, pre-existing rule on third-party module licenses

## ✅ Other Approved Sources (unchanged)

- **Official FoundryVTT API Documentation**: https://foundryvtt.com/api/ (documentation only)
- **FoundryVTT AI Content Policy**: https://foundryvtt.com/article/ai-policy/ (governs AI access to client-side source, described above)
- **Community-maintained type definitions**: `@league-of-foundry-developers/foundry-vtt-types`
- **Open-source Foundry module code (license permitting)** — user-created and community modules with permissive licenses (MIT, GPL, Apache, etc.); always verify the license permits code reading before accessing third-party module source (this requirement is unrelated to FoundryVTT's own policy above, and still applies)
- **Published developer guides and tutorials**

## How to Handle FoundryVTT Questions

**✅ CORRECT APPROACH:**
```
User: "How does FoundryVTT's Actor system work?"
AI Response: "Based on the official FoundryVTT API documentation at https://foundryvtt.com/api/, the Actor system provides..."
```

If the API docs don't answer the question and a local FoundryVTT client install is available for context, it's fine to read the relevant client-side source to inform an answer that supports package development — just say so, and don't reproduce large chunks of it verbatim in the response.

**❌ STILL FORBIDDEN:**
```
User: "Can you paste FoundryVTT's Actor class source into this blog post?"
AI Response: [NEVER reproduce/redistribute FoundryVTT source code in published output]
```

## Legal and Ethical Rationale

### Why This Nuance Matters

1. **Copyright Still Applies**
   - FoundryVTT is proprietary, copyrighted software; the AI Content Policy carves out a specific, scoped permission (AI context for package development) — it does not waive copyright generally
   - Redistribution, reuse outside package development, or copying into shipped output remains a copyright/license concern

2. **License Compliance**
   - The scoped permission means AI-assisted package development can now use richer context (actual client behavior, not just documented API surface) — but only within that scope
   - Using FoundryVTT source for anything else would violate the license terms that make this permission possible in the first place

3. **Ethical Development**
   - Respects the intellectual property of FoundryVTT's creators while enabling more effective AI-assisted development
   - Clean-room principles still apply to what actually ships in a package: understanding internals is not the same as copying them

4. **Security Best Practices**
   - Don't expose FoundryVTT internal implementation details in public-facing content (docs, blog posts, published module source)
   - Keep the distinction between "read for context" and "publish/redistribute" clear in all AI-assisted work

## Enforcement Guidelines

### For AI Assistants
- **Package-development context only**: Before reading FoundryVTT client-side source, confirm the task is FoundryVTT package/module development
- **Never redistribute**: Don't reproduce FoundryVTT source verbatim in responses meant for publication, documentation, or sharing outside this specific development context
- **Prefer public docs first**: Use the official API documentation as the primary source; fall back to reading client-side source when the docs don't cover the needed behavior
- **Cite what was used**: When guidance draws on client-side source inspection, say so, alongside any public docs/licensed code also used

### For Developers
- **Scope AI sessions to package development**: This permission is tied to the purpose of the work, not just having FoundryVTT installed
- **Don't publish FoundryVTT source**: Verify no FoundryVTT proprietary code ends up copied into a module's own repository or public documentation
- **Third-party module code is a separate question**: Confirm module licenses permit code reading before sharing that code with AI — this is unrelated to FoundryVTT's own policy above

## Verification Checklist

Before relying on FoundryVTT client-side source for guidance, verify:

- [ ] The task is FoundryVTT package/module development (not an unrelated project)
- [ ] No FoundryVTT source is being reproduced verbatim in output meant for publication or redistribution
- [ ] Official API documentation was checked first where it's sufficient
- [ ] Any third-party module code referenced has a license that explicitly permits reading/study
- [ ] Guidance sources are cited appropriately (official docs, client-side context, licensed modules, etc.)

## Summary

**Current policy**: AI assistants may reference FoundryVTT's client-side application source code as context, strictly for FoundryVTT package-development purposes, per FoundryVTT's AI Content Policy (§4.4, Software Code — https://foundryvtt.com/article/ai-policy/). This is **not** a license to redistribute FoundryVTT source, use it for unrelated work, or copy substantial chunks of it into shipped module code. Official API documentation remains the preferred first source; licensed open-source community module code remains acceptable to read under its own license terms.

This policy reflects FoundryVTT's official terms as confirmed 2026-08-16 and should be re-verified against https://foundryvtt.com/article/ai-policy/ if it appears to have changed again.
