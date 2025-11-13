# Add Dual-Mode Prompt Improvement System

## Why

The current `/clavix-improve` command provides a one-size-fits-all approach that doesn't serve different user needs effectively. Users need flexibility between quick prompt cleanup for simple cases and comprehensive analysis for complex requirements. A smart triage system is also needed to guide users toward the appropriate level of analysis, preventing insufficient improvement of complex prompts.

## What Changes

- **REMOVE** `/clavix-improve` command entirely (no backward compatibility needed - no current users)
- **ADD** `/clavix-fast` command for quick prompt improvements with smart triage logic
- **ADD** `/clavix-deep` command for comprehensive prompt analysis
- **ENHANCE** `PromptOptimizer` class to support dual modes (fast/deep) and smart triage
- **ADD** Smart triage system that detects when prompts need deep analysis based on:
  - Prompt length < 20 characters
  - Missing 3+ critical elements (context, tech stack, success criteria, user needs, expected output)
  - Vague scope words ("app", "system", "repository", "project") without sufficient context
- **ADD** "Already good" assessment that affirms quality prompts meeting 3/4 criteria
- **ADD** "Changes Made" educational summary in both modes
- **UPDATE** Documentation in README and AGENTS.md/CLAUDE.md to explain two modes

### Mode Comparison

**Fast Mode** (default):
- Quick prompt cleanup ("make shitty prompts good")
- Smart triage with confirmation prompt when deep analysis recommended
- Optional critical questions (only when truly necessary)
- Single improved prompt output
- "Changes Made" summary for learning
- Outputs: gaps, ambiguities, strengths, suggestions, changes made, improved prompt

**Deep Mode** (comprehensive):
- Everything from fast mode PLUS:
- Alternative phrasings of requirements
- Edge cases in requirements (not system architecture)
- More thorough clarifying questions
- Good/bad implementation examples
- Multiple prompt structuring approaches
- "What could go wrong with this prompt" analysis

**NOT in either mode** (belongs in `/clavix-prd`):
- System architecture recommendations
- Security best practices
- Scalability strategy
- Business impact analysis

## Impact

### Affected Specs
- `clavix-core` - MODIFIED existing "Direct Prompt Improvement" requirement
- `clavix-core` - ADDED "Fast Mode Prompt Improvement" requirement
- `clavix-core` - ADDED "Deep Mode Prompt Improvement" requirement
- `clavix-core` - ADDED "Smart Triage System" requirement
- `clavix-core` - MODIFIED "Slash Command File Generation" requirement (remove clavix-improve.md)

### Affected Code
- `src/cli/commands/improve.ts` - REMOVE entirely
- `src/cli/commands/fast.ts` - CREATE new command
- `src/cli/commands/deep.ts` - CREATE new command
- `src/core/prompt-optimizer.ts` - ENHANCE with mode support and triage logic
- `.claude/commands/clavix-improve.md` - REMOVE
- `.claude/commands/clavix-fast.md` - CREATE
- `.claude/commands/clavix-deep.md` - CREATE
- `src/templates/slash-commands/claude-code/clavix-improve.md` - REMOVE
- `src/templates/slash-commands/claude-code/clavix-fast.md` - CREATE
- `src/templates/slash-commands/claude-code/clavix-deep.md` - CREATE
- `tests/core/prompt-optimizer.test.ts` - UPDATE for mode support
- `tests/integration/improve-workflow.test.ts` - RENAME and UPDATE for fast/deep modes
- `README.md` - UPDATE documentation

### Migration Path

No migration needed - `/clavix-improve` has no current users and will be completely removed.

## Success Criteria

- Fast mode completes analysis quickly (< 5 seconds perceived time)
- Smart triage correctly identifies 90%+ of prompts needing deep analysis
- Users understand when to use fast vs. deep vs. PRD
- "Already good" assessment accurately identifies quality prompts without false positives
- "Changes Made" summary teaches prompt engineering patterns
- Clear separation maintained: Fast (cleanup), Deep (comprehensive), PRD (strategic)
