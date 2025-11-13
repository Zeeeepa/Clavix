# Implementation Tasks

## 1. Core Logic Enhancement

- [ ] 1.1 Enhance `PromptOptimizer` class with mode parameter (fast/deep)
- [ ] 1.2 Implement smart triage logic in `PromptOptimizer`
  - [ ] 1.2.1 Add method to detect short prompts (< 20 chars)
  - [ ] 1.2.2 Add method to count missing critical elements
  - [ ] 1.2.3 Add method to detect vague scope words without context
  - [ ] 1.2.4 Add method to determine if deep analysis is recommended
- [ ] 1.3 Implement "already good" assessment logic
  - [ ] 1.3.1 Define 4 quality criteria (clear goal, sufficient context, actionable language, reasonable scope)
  - [ ] 1.3.2 Add method to evaluate prompt against criteria
- [ ] 1.4 Add "changes made" summary generation to both modes
- [ ] 1.5 Implement deep mode specific features
  - [ ] 1.5.1 Alternative phrasing generator
  - [ ] 1.5.2 Edge case detector for requirements
  - [ ] 1.5.3 Good/bad implementation example generator
  - [ ] 1.5.4 "What could go wrong" analyzer

## 2. Command Implementation

- [ ] 2.1 Create `src/cli/commands/fast.ts`
  - [ ] 2.1.1 Set up command structure with oclif
  - [ ] 2.1.2 Integrate smart triage with user confirmation prompt
  - [ ] 2.1.3 Call PromptOptimizer in fast mode
  - [ ] 2.1.4 Display output with color formatting
  - [ ] 2.1.5 Show "changes made" educational summary
- [ ] 2.2 Create `src/cli/commands/deep.ts`
  - [ ] 2.2.1 Set up command structure with oclif
  - [ ] 2.2.2 Call PromptOptimizer in deep mode
  - [ ] 2.2.3 Display comprehensive output with all sections
  - [ ] 2.2.4 Show "changes made" summary
- [ ] 2.3 Remove `src/cli/commands/improve.ts`

## 3. Slash Command Integration

- [ ] 3.1 Create `src/templates/slash-commands/claude-code/clavix-fast.md`
  - [ ] 3.1.1 Add frontmatter with description
  - [ ] 3.1.2 Add instructions for fast mode usage
  - [ ] 3.1.3 Include smart triage behavior explanation
  - [ ] 3.1.4 Add examples
- [ ] 3.2 Create `src/templates/slash-commands/claude-code/clavix-deep.md`
  - [ ] 3.2.1 Add frontmatter with description
  - [ ] 3.2.2 Add instructions for deep mode usage
  - [ ] 3.2.3 Explain comprehensive analysis features
  - [ ] 3.2.4 Add examples and when to use deep vs. fast
- [ ] 3.3 Remove `src/templates/slash-commands/claude-code/clavix-improve.md`
- [ ] 3.4 Update initialization logic to generate fast/deep commands instead of improve

## 4. Testing

- [ ] 4.1 Update `tests/core/prompt-optimizer.test.ts`
  - [ ] 4.1.1 Add tests for fast mode
  - [ ] 4.1.2 Add tests for deep mode
  - [ ] 4.1.3 Add tests for smart triage logic
  - [ ] 4.1.4 Add tests for "already good" assessment
  - [ ] 4.1.5 Add tests for "changes made" summary
- [ ] 4.2 Rename and update `tests/integration/improve-workflow.test.ts` → `fast-deep-workflow.test.ts`
  - [ ] 4.2.1 Add integration tests for fast mode
  - [ ] 4.2.2 Add integration tests for deep mode
  - [ ] 4.2.3 Test triage confirmation flow
  - [ ] 4.2.4 Test mode-specific features

## 5. Documentation

- [ ] 5.1 Update README.md
  - [ ] 5.1.1 Remove `/clavix-improve` documentation
  - [ ] 5.1.2 Add `/clavix-fast` documentation with examples
  - [ ] 5.1.3 Add `/clavix-deep` documentation with examples
  - [ ] 5.1.4 Add decision guide: when to use fast vs. deep vs. PRD
  - [ ] 5.1.5 Document smart triage behavior
- [ ] 5.2 Update managed blocks in templates
  - [ ] 5.2.1 Update AGENTS.md template with new commands
  - [ ] 5.2.2 Update CLAUDE.md template with new commands
- [ ] 5.3 Add examples directory with sample prompts for testing

## 6. Build and Deploy

- [ ] 6.1 Run TypeScript compilation
- [ ] 6.2 Run all tests
- [ ] 6.3 Update package.json if needed (version bump)
- [ ] 6.4 Build distribution files
- [ ] 6.5 Verify slash commands work in Claude Code environment
