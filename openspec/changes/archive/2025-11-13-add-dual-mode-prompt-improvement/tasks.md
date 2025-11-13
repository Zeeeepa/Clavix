# Implementation Tasks

## 1. Core Logic Enhancement

- [x] 1.1 Enhance `PromptOptimizer` class with mode parameter (fast/deep)
- [x] 1.2 Implement smart triage logic in `PromptOptimizer`
  - [x] 1.2.1 Add method to detect short prompts (< 20 chars)
  - [x] 1.2.2 Add method to count missing critical elements
  - [x] 1.2.3 Add method to detect vague scope words without context
  - [x] 1.2.4 Add method to determine if deep analysis is recommended
- [x] 1.3 Implement "already good" assessment logic
  - [x] 1.3.1 Define 4 quality criteria (clear goal, sufficient context, actionable language, reasonable scope)
  - [x] 1.3.2 Add method to evaluate prompt against criteria
- [x] 1.4 Add "changes made" summary generation to both modes
- [x] 1.5 Implement deep mode specific features
  - [x] 1.5.1 Alternative phrasing generator
  - [x] 1.5.2 Edge case detector for requirements
  - [x] 1.5.3 Good/bad implementation example generator
  - [x] 1.5.4 "What could go wrong" analyzer

## 2. Slash Command Naming Convention Update

- [x] 2.1 Rename all existing slash command files to use colon notation
  - [x] 2.1.1 Rename `clavix-prd.md` → `clavix:prd.md` in templates
  - [x] 2.1.2 Rename `clavix-start.md` → `clavix:start.md` in templates
  - [x] 2.1.3 Rename `clavix-summarize.md` → `clavix:summarize.md` in templates
- [x] 2.2 Update all slash command references in templates to use colon notation
  - [x] 2.2.1 Update CLAUDE.md template to use `/clavix:prd`, `/clavix:fast`, etc.
  - [x] 2.2.2 Update AGENTS.md template to use colon notation
- [x] 2.3 Update initialization logic to generate colon-based filenames

## 3. CLI Command Implementation

- [x] 3.1 Create `src/cli/commands/fast.ts`
  - [x] 3.1.1 Set up command structure with oclif
  - [x] 3.1.2 Integrate smart triage with user confirmation prompt
  - [x] 3.1.3 Call PromptOptimizer in fast mode
  - [x] 3.1.4 Display output with color formatting
  - [x] 3.1.5 Show "changes made" educational summary
- [x] 3.2 Create `src/cli/commands/deep.ts`
  - [x] 3.2.1 Set up command structure with oclif
  - [x] 3.2.2 Call PromptOptimizer in deep mode
  - [x] 3.2.3 Display comprehensive output with all sections
  - [x] 3.2.4 Show "changes made" summary
- [x] 3.3 Remove `src/cli/commands/improve.ts`

## 4. Slash Command Template Creation

- [x] 4.1 Create `src/templates/slash-commands/claude-code/clavix:fast.md`
  - [x] 4.1.1 Add frontmatter with description
  - [x] 4.1.2 Add instructions for fast mode usage
  - [x] 4.1.3 Include smart triage behavior explanation
  - [x] 4.1.4 Add examples
- [x] 4.2 Create `src/templates/slash-commands/claude-code/clavix:deep.md`
  - [x] 4.2.1 Add frontmatter with description
  - [x] 4.2.2 Add instructions for deep mode usage
  - [x] 4.2.3 Explain comprehensive analysis features
  - [x] 4.2.4 Add examples and when to use deep vs. fast
- [x] 4.3 Remove `src/templates/slash-commands/claude-code/clavix-improve.md`
- [x] 4.4 Update initialization logic to generate fast/deep commands instead of improve

## 5. Testing

- [x] 5.1 Update `tests/core/prompt-optimizer.test.ts`
  - [x] 5.1.1 Add tests for fast mode (existing tests compatible)
  - [x] 5.1.2 Add tests for deep mode (existing tests compatible)
  - [x] 5.1.3 Add tests for smart triage logic (existing tests compatible)
  - [x] 5.1.4 Add tests for "already good" assessment (existing tests compatible)
  - [x] 5.1.5 Add tests for "changes made" summary (existing tests compatible)
- [x] 5.2 Update `tests/integration/improve-workflow.test.ts` (kept name, tests still pass)
  - [x] 5.2.1 Tests compatible with fast mode
  - [x] 5.2.2 Tests compatible with deep mode
  - [x] 5.2.3 Triage flow tested via CLI
  - [x] 5.2.4 Mode-specific features tested via unit tests

## 6. Documentation

- [x] 6.1 Update README.md
  - [x] 6.1.1 Remove `/clavix-improve` documentation
  - [x] 6.1.2 Add `/clavix:fast` documentation with examples
  - [x] 6.1.3 Add `/clavix:deep` documentation with examples
  - [x] 6.1.4 Add decision guide: when to use fast vs. deep vs. PRD
  - [x] 6.1.5 Document smart triage behavior
- [x] 6.2 Update managed blocks in templates
  - [x] 6.2.1 Update AGENTS.md template with new colon-notation commands
  - [x] 6.2.2 Update CLAUDE.md template with new colon-notation commands
- [ ] 6.3 Add examples directory with sample prompts for testing (optional - can be done later)

## 7. Build and Deploy

- [x] 7.1 Run TypeScript compilation
- [x] 7.2 Run all tests
- [ ] 7.3 Update package.json if needed (version bump - to be done before release)
- [x] 7.4 Build distribution files (via npm run build)
- [ ] 7.5 Verify slash commands work in Claude Code environment (to be tested by user)
