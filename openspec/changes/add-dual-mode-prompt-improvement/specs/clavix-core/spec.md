# Clavix Core Spec Deltas

## REMOVED Requirements

### Requirement: Direct Prompt Improvement

**Reason**: Replaced with dual-mode system (fast/deep) for better user flexibility

**Migration**: Users should use `/clavix-fast` for quick improvements or `/clavix-deep` for comprehensive analysis

---

## ADDED Requirements

### Requirement: Fast Mode Prompt Improvement

The system SHALL provide a fast command to quickly improve prompts with smart triage.

#### Scenario: Improve prompt in fast mode
- **WHEN** user runs `clavix fast "Create a login page"`
- **THEN** the system MUST analyze the provided prompt
- **AND** identify all gaps, ambiguities, strengths, and suggestions
- **AND** generate a single structured, development-ready prompt
- **AND** include a "Changes Made" summary showing what was improved
- **AND** display the results to the user

#### Scenario: Fast mode triggers smart triage for short prompts
- **WHEN** user runs `clavix fast "build app"`
- **AND** the prompt is less than 20 characters
- **THEN** the system MUST display a message recommending `/clavix-deep`
- **AND** ask user to confirm proceeding with fast mode or switch to deep mode
- **AND** proceed based on user's choice

#### Scenario: Fast mode triggers smart triage for missing critical elements
- **WHEN** user runs fast mode with a prompt missing 3 or more critical elements
- **AND** critical elements are: context, technical constraints, success criteria, user needs, expected output
- **THEN** the system MUST display a message recommending `/clavix-deep`
- **AND** ask user to confirm proceeding with fast mode or switch to deep mode

#### Scenario: Fast mode triggers smart triage for vague scope
- **WHEN** user runs fast mode with vague scope words without sufficient context
- **AND** vague scope words include: "app", "system", "repository", "project", "platform", "solution"
- **AND** the prompt lacks specific details about purpose, stack, or requirements
- **THEN** the system MUST display a message recommending `/clavix-deep`
- **AND** ask user to confirm proceeding with fast mode or switch to deep mode

#### Scenario: Already good prompt assessment
- **WHEN** user runs fast mode with a prompt meeting 3 of 4 quality criteria
- **AND** quality criteria are: clear goal, sufficient context, actionable language, reasonable scope
- **THEN** the system MUST affirm that the prompt is already good
- **AND** MAY suggest minor refinements if any exist
- **AND** display the assessment clearly to avoid approving bad prompts

#### Scenario: Optional critical questions
- **WHEN** fast mode identifies absolutely necessary missing information
- **THEN** the system MAY list critical clarifying questions
- **AND** include note "Consider answering these:" before the questions
- **AND** proceed with improvement regardless
- **AND** NOT spam the user with unnecessary questions

#### Scenario: Changes made summary
- **WHEN** fast mode generates an improved prompt
- **THEN** the system MUST include a "Changes Made" section
- **AND** the section MUST list specific improvements made (1-2 lines per change)
- **AND** serve as an educational tool to teach better prompting

#### Scenario: Fast mode output structure
- **WHEN** the system generates fast mode output
- **THEN** the output MUST include sections: Original Prompt, Analysis (gaps, ambiguities, strengths, suggestions), Changes Made, Improved Prompt
- **AND** the improved prompt MUST be in a single, structured format
- **AND** NOT include strategic analysis, detailed explanations, or alternative phrasings

#### Scenario: Slash command integration for fast mode
- **WHEN** user runs `/clavix-fast` in Claude Code with a prompt
- **THEN** Claude Code SHALL pass the prompt to `clavix fast` command
- **AND** display the improved prompt in the conversation

---

### Requirement: Deep Mode Prompt Improvement

The system SHALL provide a comprehensive deep analysis command for thorough prompt improvement.

#### Scenario: Improve prompt in deep mode
- **WHEN** user runs `clavix deep "Create a login page"`
- **THEN** the system MUST perform all fast mode analysis
- **AND** include alternative phrasings of requirements
- **AND** identify edge cases in the requirements themselves
- **AND** provide detailed examples of good and bad implementations
- **AND** suggest multiple ways to structure the prompt
- **AND** perform "what could go wrong with this prompt" analysis
- **AND** display comprehensive results to the user

#### Scenario: Deep mode includes fast mode features
- **WHEN** user runs deep mode
- **THEN** the system MUST include all features from fast mode
- **AND** include gaps, ambiguities, strengths, suggestions analysis
- **AND** include "Changes Made" summary
- **AND** include single improved prompt

#### Scenario: Alternative phrasings generation
- **WHEN** deep mode analyzes a prompt
- **THEN** the system MUST generate 2-3 alternative phrasings of key requirements
- **AND** explain when each phrasing might be more appropriate

#### Scenario: Edge case identification
- **WHEN** deep mode analyzes requirements
- **THEN** the system MUST identify potential edge cases in the requirements
- **AND** suggest how to address them in the prompt
- **AND** focus on requirement-level edge cases, NOT system architecture

#### Scenario: Implementation examples
- **WHEN** deep mode generates output
- **THEN** the system MUST provide examples of good implementations
- **AND** provide examples of bad implementations
- **AND** explain what makes each good or bad

#### Scenario: Multiple prompt structures
- **WHEN** deep mode improves a prompt
- **THEN** the system MUST suggest alternative ways to structure the prompt
- **AND** explain the benefits of each structure

#### Scenario: What could go wrong analysis
- **WHEN** deep mode analyzes a prompt
- **THEN** the system MUST identify potential issues with the prompt
- **AND** explain how the prompt could be misinterpreted
- **AND** suggest how to make it more clear

#### Scenario: Deep mode does NOT include architecture
- **WHEN** deep mode analyzes a prompt
- **THEN** the system MUST NOT include system architecture recommendations
- **AND** MUST NOT include security best practices
- **AND** MUST NOT include scalability strategy
- **AND** MUST NOT include business impact analysis
- **AND** those concerns belong in `/clavix-prd` instead

#### Scenario: More thorough clarifying questions
- **WHEN** deep mode identifies missing information
- **THEN** the system MAY include more detailed clarifying questions than fast mode
- **AND** group questions by category (requirements, constraints, success criteria)

#### Scenario: Slash command integration for deep mode
- **WHEN** user runs `/clavix-deep` in Claude Code with a prompt
- **THEN** Claude Code SHALL pass the prompt to `clavix deep` command
- **AND** display the comprehensive analysis in the conversation

---

### Requirement: Smart Triage System

The system SHALL implement smart triage logic to recommend appropriate analysis depth.

#### Scenario: Detect short prompts
- **WHEN** a prompt is less than 20 characters
- **THEN** the triage system MUST flag it as needing deep analysis

#### Scenario: Detect missing critical elements
- **WHEN** a prompt is missing 3 or more critical elements
- **AND** critical elements are: context, technical constraints, success criteria, user needs, expected output
- **THEN** the triage system MUST flag it as needing deep analysis

#### Scenario: Detect vague scope words
- **WHEN** a prompt contains vague scope words without sufficient context
- **AND** vague scope words are: "app", "system", "repository", "project", "platform", "solution", "tool", "service"
- **AND** the prompt does NOT include specific purpose, tech stack, or detailed requirements
- **THEN** the triage system MUST flag it as needing deep analysis

#### Scenario: Recommend deep analysis
- **WHEN** the triage system flags a prompt as needing deep analysis
- **THEN** the system MUST display a clear message recommending `/clavix-deep`
- **AND** explain WHY deep analysis is recommended
- **AND** ask user to confirm: proceed with fast mode (at their own risk) or switch to deep mode

#### Scenario: User proceeds with fast mode despite recommendation
- **WHEN** triage recommends deep mode and user chooses to proceed with fast mode
- **THEN** the system MUST proceed with fast mode analysis
- **AND** include a note that deep analysis was recommended

#### Scenario: User switches to deep mode
- **WHEN** triage recommends deep mode and user chooses to switch
- **THEN** the system MUST execute deep mode analysis instead
- **AND** use the same prompt provided originally

#### Scenario: Triage accuracy
- **WHEN** the triage system is evaluated
- **THEN** it MUST correctly identify 90% or more of prompts needing deep analysis
- **AND** minimize false positives (prompts incorrectly flagged as needing deep mode)

---

## MODIFIED Requirements

### Requirement: Slash Command File Generation

The system SHALL generate slash command files for Claude Code integration, including fast and deep mode commands.

#### Scenario: Generate clavix-prd command
- **WHEN** user completes initialization with Claude Code selected
- **THEN** the system MUST create `.claude/commands/clavix-prd.md`
- **AND** the file MUST contain a description field
- **AND** the file MUST include instructions for launching PRD generation

#### Scenario: Generate clavix-fast command
- **WHEN** user completes initialization with Claude Code selected
- **THEN** the system MUST create `.claude/commands/clavix-fast.md`
- **AND** the file MUST accept `$ARGUMENTS` for the prompt to improve
- **AND** the file MUST include fast mode instructions
- **AND** the file MUST explain smart triage behavior

#### Scenario: Generate clavix-deep command
- **WHEN** user completes initialization with Claude Code selected
- **THEN** the system MUST create `.claude/commands/clavix-deep.md`
- **AND** the file MUST accept `$ARGUMENTS` for the prompt to improve
- **AND** the file MUST include deep mode comprehensive analysis instructions
- **AND** the file MUST explain when to use deep vs. fast mode

#### Scenario: Generate clavix-start command
- **WHEN** user completes initialization with Claude Code selected
- **THEN** the system MUST create `.claude/commands/clavix-start.md`
- **AND** the file MUST include instructions to begin conversational mode

#### Scenario: Generate clavix-summarize command
- **WHEN** user completes initialization with Claude Code selected
- **THEN** the system MUST create `.claude/commands/clavix-summarize.md`
- **AND** the file MUST include instructions to analyze and optimize the conversation

#### Scenario: Do NOT generate clavix-improve command
- **WHEN** user completes initialization with Claude Code selected
- **THEN** the system MUST NOT create `.claude/commands/clavix-improve.md`
- **AND** MUST create fast and deep mode commands instead

#### Scenario: Create commands directory if missing
- **WHEN** generating slash commands and `.claude/commands/` does NOT exist
- **THEN** the system MUST create the directory structure
- **AND** set appropriate permissions
