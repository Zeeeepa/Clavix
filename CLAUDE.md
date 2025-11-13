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
## Clavix Integration

This project uses Clavix for prompt improvement and PRD generation. The following slash commands are available:

### /clavix:fast [prompt]
Quick prompt improvements with smart triage. Clavix will analyze your prompt and recommend deep analysis if needed. Perfect for making "shitty prompts good" quickly.

### /clavix:deep [prompt]
Comprehensive prompt analysis with alternative phrasings, edge cases, implementation examples, and potential issues. Use for complex requirements or when you want thorough exploration.

### /clavix:prd
Launch the PRD generation workflow. Clavix will guide you through strategic questions and generate both a comprehensive PRD and a quick-reference version optimized for AI consumption.

### /clavix:start
Enter conversational mode for iterative prompt development. Discuss your requirements naturally, and later use `/clavix:summarize` to extract an optimized prompt.

### /clavix:summarize
Analyze the current conversation and extract key requirements into a structured prompt and mini-PRD.

**When to use which mode:**
- **Fast mode** (`/clavix:fast`): Quick cleanup for simple prompts
- **Deep mode** (`/clavix:deep`): Comprehensive analysis for complex requirements
- **PRD mode** (`/clavix:prd`): Strategic planning with architecture and business impact

**Pro tip**: Start complex features with `/clavix:prd` or `/clavix:start` to ensure clear requirements before implementation.
<!-- CLAVIX:END -->
