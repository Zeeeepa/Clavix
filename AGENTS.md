<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

<!-- CLAVIX:START -->
# Clavix - Prompt Improvement Assistant

Clavix is installed in this project. Use the following slash commands:

- `/clavix:fast [prompt]` - Quick prompt improvements with smart triage
- `/clavix:deep [prompt]` - Comprehensive prompt analysis
- `/clavix:prd` - Generate a PRD through guided questions
- `/clavix:start` - Start conversational mode for iterative refinement
- `/clavix:summarize` - Extract optimized prompt from conversation

**When to use:**
- **Fast mode**: Quick cleanup for simple prompts
- **Deep mode**: Comprehensive analysis for complex requirements
- **PRD mode**: Strategic planning with architecture and business impact

For more information, run `clavix --help` in your terminal.
<!-- CLAVIX:END -->
