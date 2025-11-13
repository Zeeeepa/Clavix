# clavix-core Specification

## Purpose
TBD - created by archiving change add-clavix-cli-tool. Update Purpose after archive.
## Requirements
### Requirement: Global NPM Installation

The system SHALL be installable as a global npm package.

#### Scenario: Install Clavix globally
- **WHEN** user runs `npm install -g clavix`
- **THEN** the `clavix` command MUST be available in the user's PATH
- **AND** the command MUST be executable from any directory

#### Scenario: Verify installation
- **WHEN** user runs `clavix --version`
- **THEN** the system MUST display the current version number
- **AND** exit with code 0

#### Scenario: Display help
- **WHEN** user runs `clavix --help` or `clavix help`
- **THEN** the system MUST display available commands and options
- **AND** include usage examples

---

### Requirement: Project Initialization

The system SHALL provide an initialization command that sets up Clavix in the current project.

#### Scenario: Initialize with agent selection
- **WHEN** user runs `clavix init` in a project directory
- **THEN** the system MUST display an interactive agent selector
- **AND** the selector MUST show "Claude Code" as an available option
- **AND** the selector MUST indicate "More coming soon" for future agents

#### Scenario: Create directory structure
- **WHEN** initialization completes successfully
- **THEN** the system MUST create a `.clavix/` directory
- **AND** the directory MUST contain `config.json` file
- **AND** the directory MUST contain `INSTRUCTIONS.md` file
- **AND** the directory MUST contain empty `sessions/` subdirectory
- **AND** the directory MUST contain empty `outputs/` subdirectory
- **AND** the directory MUST contain `templates/` subdirectory with default templates

#### Scenario: Save agent configuration
- **WHEN** user selects "Claude Code" during initialization
- **THEN** the system MUST save the selection to `.clavix/config.json`
- **AND** the config MUST include agent: "claude-code"
- **AND** the config MUST include version information
- **AND** the config MUST be valid JSON5 format

#### Scenario: Display completion message
- **WHEN** initialization completes successfully
- **THEN** the system MUST display a success message
- **AND** the message MUST include next steps (e.g., available commands)
- **AND** the message MUST indicate that slash commands are now available

#### Scenario: Handle already initialized project
- **WHEN** user runs `clavix init` in an already initialized project
- **THEN** the system MUST detect the existing `.clavix/` directory
- **AND** prompt the user whether to reinitialize or update
- **AND** preserve existing sessions and outputs if user chooses to update

---

### Requirement: AGENTS.md Managed Block Injection

The system SHALL inject and maintain a managed documentation block in the project's AGENTS.md file.

#### Scenario: Inject block on initialization
- **WHEN** user completes `clavix init` and AGENTS.md exists in the project root
- **THEN** the system MUST append a managed block to AGENTS.md
- **AND** the block MUST start with `<!-- CLAVIX:START -->`
- **AND** the block MUST end with `<!-- CLAVIX:END -->`
- **AND** the block MUST include Clavix description and available commands

#### Scenario: Create AGENTS.md if missing
- **WHEN** user completes `clavix init` and AGENTS.md does NOT exist
- **THEN** the system MUST create AGENTS.md in the project root
- **AND** populate it with the Clavix managed block
- **AND** include basic AGENTS.md header

#### Scenario: Update existing managed block
- **WHEN** user runs `clavix update` and AGENTS.md contains a Clavix managed block
- **THEN** the system MUST replace the content between the markers
- **AND** preserve all content outside the managed block
- **AND** create a backup of the original file before modification

#### Scenario: Preserve user content
- **WHEN** updating AGENTS.md with a managed block
- **THEN** the system MUST NOT modify any content outside the `<!-- CLAVIX:START -->` and `<!-- CLAVIX:END -->` markers
- **AND** maintain original file formatting and line endings

#### Scenario: Backup before modification
- **WHEN** modifying AGENTS.md
- **THEN** the system MUST create a backup file `AGENTS.md.backup`
- **AND** restore from backup if the operation fails

---

### Requirement: CLAUDE.md Managed Block Injection

The system SHALL inject and maintain a managed documentation block in CLAUDE.md when Claude Code agent is selected.

#### Scenario: Inject block for Claude Code
- **WHEN** user selects "Claude Code" during initialization
- **AND** CLAUDE.md exists in the project root
- **THEN** the system MUST append a Clavix managed block to CLAUDE.md
- **AND** the block MUST include Claude Code-specific instructions
- **AND** the block MUST reference available slash commands

#### Scenario: Create CLAUDE.md if missing
- **WHEN** Claude Code is selected and CLAUDE.md does NOT exist
- **THEN** the system MUST create CLAUDE.md in the project root
- **AND** populate it with the Clavix managed block

#### Scenario: Skip CLAUDE.md for other agents
- **WHEN** user selects a non-Claude Code agent
- **THEN** the system MUST NOT create or modify CLAUDE.md

---

### Requirement: Slash Command File Generation

The system SHALL generate slash command files for Claude Code integration.

#### Scenario: Generate clavix-prd command
- **WHEN** user completes initialization with Claude Code selected
- **THEN** the system MUST create `.claude/commands/clavix-prd.md`
- **AND** the file MUST contain a description field
- **AND** the file MUST include instructions for launching PRD generation

#### Scenario: Generate clavix-improve command
- **WHEN** user completes initialization with Claude Code selected
- **THEN** the system MUST create `.claude/commands/clavix-improve.md`
- **AND** the file MUST accept `$ARGUMENTS` for the prompt to improve
- **AND** the file MUST include optimization instructions

#### Scenario: Generate clavix-start command
- **WHEN** user completes initialization with Claude Code selected
- **THEN** the system MUST create `.claude/commands/clavix-start.md`
- **AND** the file MUST include instructions to begin conversational mode

#### Scenario: Generate clavix-summarize command
- **WHEN** user completes initialization with Claude Code selected
- **THEN** the system MUST create `.claude/commands/clavix-summarize.md`
- **AND** the file MUST include instructions to analyze and optimize the conversation

#### Scenario: Create commands directory if missing
- **WHEN** generating slash commands and `.claude/commands/` does NOT exist
- **THEN** the system MUST create the directory structure
- **AND** set appropriate permissions

---

### Requirement: Direct Prompt Improvement

The system SHALL provide a command to analyze and improve prompts directly.

#### Scenario: Improve prompt from command line
- **WHEN** user runs `clavix improve "Create a login page"`
- **THEN** the system MUST analyze the provided prompt
- **AND** identify gaps (missing context, unclear requirements, no success criteria)
- **AND** identify ambiguities
- **AND** generate a structured, development-ready prompt
- **AND** display the improved prompt to the user

#### Scenario: Improved prompt structure
- **WHEN** the system generates an improved prompt
- **THEN** the output MUST include a clear objective section
- **AND** include specific requirements section
- **AND** include technical constraints section
- **AND** include expected output format section
- **AND** include success criteria section

#### Scenario: Handle empty or minimal prompts
- **WHEN** user runs `clavix improve ""` or provides a very short prompt
- **THEN** the system MUST prompt the user for more information
- **OR** provide guidance on what information is needed

#### Scenario: Slash command integration
- **WHEN** user runs `/clavix:improve` in Claude Code with a prompt
- **THEN** Claude Code SHALL pass the prompt to `clavix improve` command
- **AND** display the improved prompt in the conversation

---

### Requirement: PRD Generation via Socratic Questioning

The system SHALL guide users through creating PRDs using strategic questions.

#### Scenario: Launch PRD generation
- **WHEN** user runs `clavix prd`
- **THEN** the system MUST load PRD question templates
- **AND** display the first question to the user
- **AND** wait for user input

#### Scenario: Question flow
- **WHEN** user answers a PRD question
- **THEN** the system MUST display the next question
- **AND** continue until all questions are answered
- **AND** display progress indicator (e.g., "Question 3 of 7")

#### Scenario: Default question set
- **WHEN** no custom template exists
- **THEN** the system MUST use the built-in question template
- **AND** the template MUST include 5-7 strategic questions
- **AND** cover problem statement, users, features, success criteria, constraints, scope, and timeline

#### Scenario: Generate full PRD
- **WHEN** all questions are answered
- **THEN** the system MUST generate `full-prd.md`
- **AND** the document MUST include all sections: problem statement, user personas, requirements, technical specs, success metrics
- **AND** save to `.clavix/outputs/[project-name]/full-prd.md`

#### Scenario: Generate quick PRD
- **WHEN** all questions are answered
- **THEN** the system MUST generate `quick-prd.md`
- **AND** the document MUST be 2-3 paragraphs
- **AND** be optimized for AI consumption
- **AND** include problem + solution, technical requirements, must-have features, constraints
- **AND** save to `.clavix/outputs/[project-name]/quick-prd.md`

#### Scenario: Add timestamp metadata
- **WHEN** generating PRD files
- **THEN** each file MUST include a timestamp in YAML frontmatter
- **AND** include project name and agent used

#### Scenario: Display completion message
- **WHEN** PRD generation completes
- **THEN** the system MUST display success message
- **AND** show file paths for both generated documents
- **AND** provide suggestion for next steps

#### Scenario: Handle project name
- **WHEN** generating PRDs
- **THEN** the system MUST extract or ask for a project name
- **AND** use it for organizing outputs in subdirectories

---

### Requirement: Conversational Prompt Refinement

The system SHALL support conversational mode for iterative prompt development.

#### Scenario: Start conversational session
- **WHEN** user runs `clavix start`
- **THEN** the system MUST create a new session with unique ID
- **AND** the ID MUST include timestamp and project name
- **AND** display introductory prompt: "Tell me about what you want to build..."
- **AND** enter conversation loop

#### Scenario: Track conversation history
- **WHEN** user provides input in conversational mode
- **THEN** the system MUST append the message to the session file
- **AND** include timestamp for each message
- **AND** distinguish between user and assistant messages
- **AND** save to `.clavix/sessions/[session-id].md`

#### Scenario: Exit conversation gracefully
- **WHEN** user types "exit", "quit", or presses Ctrl+C
- **THEN** the system MUST save the session
- **AND** display the session ID and file location
- **AND** suggest running `clavix summarize` to extract optimized prompt

#### Scenario: Session file format
- **WHEN** creating or updating a session file
- **THEN** the file MUST use Markdown format
- **AND** include YAML frontmatter with metadata (id, project, agent, created, updated, status)
- **AND** include conversation in human-readable format

---

### Requirement: Conversation Analysis and Summarization

The system SHALL analyze conversations and generate optimized prompts.

#### Scenario: Summarize latest session
- **WHEN** user runs `clavix summarize` without arguments
- **THEN** the system MUST load the most recent active session
- **AND** analyze the conversation history
- **AND** extract key requirements

#### Scenario: Summarize specific session
- **WHEN** user runs `clavix summarize [session-id]`
- **THEN** the system MUST load the specified session
- **AND** analyze that conversation

#### Scenario: Extract requirements
- **WHEN** analyzing a conversation
- **THEN** the system MUST identify key requirements mentioned
- **AND** identify technical constraints
- **AND** identify success criteria
- **AND** identify user context

#### Scenario: Generate mini-PRD
- **WHEN** conversation analysis completes
- **THEN** the system MUST generate `mini-prd.md`
- **AND** the document MUST include extracted requirements in structured format
- **AND** save to `.clavix/outputs/[session-name]/mini-prd.md`

#### Scenario: Generate optimized prompt
- **WHEN** conversation analysis completes
- **THEN** the system MUST generate `optimized-prompt.md`
- **AND** the document MUST be AI-ready and concise
- **AND** include all key information from the conversation
- **AND** save to `.clavix/outputs/[session-name]/optimized-prompt.md`

#### Scenario: Display summary
- **WHEN** summarization completes
- **THEN** the system MUST display what was extracted
- **AND** show file paths for generated documents

---

### Requirement: Session Management

The system SHALL provide commands to manage conversation sessions.

#### Scenario: List all sessions
- **WHEN** user runs `clavix list`
- **THEN** the system MUST display all sessions from `.clavix/sessions/`
- **AND** show session ID, project name, creation date, and status
- **AND** order by most recent first

#### Scenario: List with filtering
- **WHEN** user runs `clavix list --project [name]`
- **THEN** the system MUST show only sessions for that project

#### Scenario: Show session details
- **WHEN** user runs `clavix show [session-id]`
- **THEN** the system MUST load the session file
- **AND** display session metadata
- **AND** display formatted conversation history
- **AND** show associated output files if any exist

#### Scenario: List outputs
- **WHEN** user runs `clavix list` with no active sessions
- **THEN** the system MUST also list generated outputs from `.clavix/outputs/`
- **AND** show project name and generation date

---

### Requirement: Configuration Management

The system SHALL allow users to view and modify configuration.

#### Scenario: Display current configuration
- **WHEN** user runs `clavix config`
- **THEN** the system MUST load `.clavix/config.json`
- **AND** display all configuration values in readable format

#### Scenario: Update configuration interactively
- **WHEN** user runs `clavix config --edit`
- **THEN** the system MUST open an interactive editor
- **AND** allow modification of preferences
- **AND** validate changes before saving

#### Scenario: Get specific config value
- **WHEN** user runs `clavix config get [key]`
- **THEN** the system MUST display the value for that configuration key

#### Scenario: Set specific config value
- **WHEN** user runs `clavix config set [key] [value]`
- **THEN** the system MUST validate the value
- **AND** update the configuration file
- **AND** confirm the change

---

### Requirement: Documentation Update

The system SHALL provide a command to refresh all managed blocks.

#### Scenario: Update all managed blocks
- **WHEN** user runs `clavix update`
- **THEN** the system MUST detect all files with Clavix managed blocks
- **AND** refresh the content in AGENTS.md
- **AND** refresh the content in CLAUDE.md if present
- **AND** update slash command files if templates changed

#### Scenario: Display what was updated
- **WHEN** update completes
- **THEN** the system MUST list all files that were modified
- **AND** indicate if any files were skipped or failed

#### Scenario: Backup before update
- **WHEN** running update command
- **THEN** the system MUST create backups of all files before modification
- **AND** restore from backups if any operation fails

---

### Requirement: Template Customization

The system SHALL support user-customizable templates.

#### Scenario: Use default templates
- **WHEN** no custom templates exist in `.clavix/templates/`
- **THEN** the system MUST use built-in templates from the npm package

#### Scenario: Override with custom template
- **WHEN** user places a custom template in `.clavix/templates/prd-questions.md`
- **THEN** the system MUST use the custom template instead of the default
- **AND** validate the template format before use

#### Scenario: Template validation
- **WHEN** loading a custom template
- **THEN** the system MUST verify it meets the required format
- **AND** display helpful error if validation fails

#### Scenario: Fallback to default
- **WHEN** a custom template is invalid or missing
- **THEN** the system MUST fall back to the built-in default
- **AND** warn the user about the fallback

---

### Requirement: File System Safety

The system SHALL implement safe file operations with error handling.

#### Scenario: Backup before modification
- **WHEN** modifying any existing file (AGENTS.md, CLAUDE.md, config)
- **THEN** the system MUST create a backup with `.backup` extension
- **AND** store the backup in the same directory

#### Scenario: Atomic file writes
- **WHEN** writing file content
- **THEN** the system MUST write to a temporary file first
- **AND** atomically rename to the target filename
- **AND** ensure all-or-nothing semantics

#### Scenario: Handle permission errors
- **WHEN** a file operation fails due to permissions
- **THEN** the system MUST display a clear error message
- **AND** explain how to fix (e.g., check file ownership)
- **AND** restore from backup if modification was in progress

#### Scenario: Validate file paths
- **WHEN** accepting file paths from user input
- **THEN** the system MUST validate paths are within the project directory
- **AND** reject paths with directory traversal attempts

---

### Requirement: Error Handling and User Feedback

The system SHALL provide clear, actionable error messages.

#### Scenario: Display actionable errors
- **WHEN** an error occurs
- **THEN** the system MUST display what went wrong
- **AND** explain why it happened
- **AND** suggest how to fix the issue

#### Scenario: Categorize errors
- **WHEN** an error occurs
- **THEN** the system MUST assign it an error category (PERMISSION_ERROR, VALIDATION_ERROR, etc.)
- **AND** include the category in the error output for debugging

#### Scenario: Preserve user data on error
- **WHEN** an error occurs during session or file operations
- **THEN** the system MUST ensure no data is lost
- **AND** restore from backup if partial writes occurred

#### Scenario: Exit codes
- **WHEN** the command completes successfully
- **THEN** the system MUST exit with code 0
- **WHEN** the command fails
- **THEN** the system MUST exit with a non-zero code
- **AND** the code SHOULD indicate the error category

---

### Requirement: Cross-Platform Compatibility

The system SHALL work consistently across operating systems.

#### Scenario: Handle path differences
- **WHEN** constructing file paths
- **THEN** the system MUST use `path.join()` or `path.resolve()`
- **AND** support both Unix (/) and Windows (\) path separators

#### Scenario: Line ending consistency
- **WHEN** writing text files
- **THEN** the system MUST preserve the existing line ending style
- **OR** use the platform's default line endings for new files

#### Scenario: File permissions
- **WHEN** creating files or directories
- **THEN** the system MUST handle permission differences between Unix and Windows gracefully

---

### Requirement: Slash Command Execution Context

The system SHALL provide proper context when executed via slash commands.

#### Scenario: Receive arguments from slash command
- **WHEN** Claude Code executes `/clavix:improve [prompt]`
- **THEN** the slash command MUST pass the prompt to `clavix improve` command
- **AND** the command MUST execute in the project directory context

#### Scenario: Return results to agent
- **WHEN** a slash command executes successfully
- **THEN** the results MUST be returned to Claude Code for display
- **AND** formatting MUST be preserved for readability

---

### Requirement: Version Management

The system SHALL track and display version information.

#### Scenario: Display CLI version
- **WHEN** user runs `clavix --version` or `clavix -v`
- **THEN** the system MUST display the installed Clavix version
- **AND** exit with code 0

#### Scenario: Store version in config
- **WHEN** running `clavix init`
- **THEN** the system MUST store the CLI version in `.clavix/config.json`
- **AND** use it for compatibility checking

#### Scenario: Detect version mismatch
- **WHEN** the installed CLI version differs from the config version
- **THEN** the system MAY warn the user
- **AND** suggest running `clavix update`

---

### Requirement: Output Organization

The system SHALL organize generated files in a clear, navigable structure.

#### Scenario: Organize by project
- **WHEN** generating PRDs or prompts
- **THEN** the system MUST create a subdirectory in `.clavix/outputs/[project-name]/`
- **AND** place all related outputs in that subdirectory

#### Scenario: Timestamp outputs
- **WHEN** generating multiple outputs for the same project
- **THEN** each generation MUST include a timestamp
- **AND** files MUST be distinguishable (e.g., via frontmatter or filename suffix)

#### Scenario: Prevent overwriting
- **WHEN** generating output files that would overwrite existing files
- **THEN** the system MUST either prompt for confirmation
- **OR** append a timestamp/version number to the filename

---

### Requirement: Interactive User Interface

The system SHALL provide an intuitive interactive experience for multi-step operations.

#### Scenario: Use inquirer for questions
- **WHEN** prompting users for input (agent selection, PRD questions, etc.)
- **THEN** the system MUST use an interactive prompt library (e.g., Inquirer.js)
- **AND** support arrow key navigation for selections
- **AND** provide clear instructions

#### Scenario: Display progress indicators
- **WHEN** executing multi-step operations (PRD generation, updates)
- **THEN** the system MUST show progress indicators
- **AND** indicate current step and total steps

#### Scenario: Confirm destructive operations
- **WHEN** about to perform a destructive operation (overwrite, delete)
- **THEN** the system MUST prompt for confirmation
- **AND** allow user to cancel

---

### Requirement: Agent Extensibility Architecture

The system SHALL support adding new AI agents without modifying core functionality.

#### Scenario: Register agent adapters
- **WHEN** the system loads
- **THEN** it MUST discover available agent adapters
- **AND** make them available for selection during initialization

#### Scenario: Agent detection
- **WHEN** initializing in a project
- **THEN** the system MUST attempt to detect existing agent configurations
- **AND** suggest the appropriate agent if detected

#### Scenario: Agent-specific command generation
- **WHEN** an agent is selected
- **THEN** the system MUST delegate command file generation to the agent's adapter
- **AND** support agent-specific file paths and formats

---

### Requirement: Logging and Debugging

The system SHALL provide optional verbose logging for troubleshooting.

#### Scenario: Enable verbose mode
- **WHEN** user runs any command with `--verbose` or `-v` flag
- **THEN** the system MUST output detailed operation logs
- **AND** include timestamps for each operation

#### Scenario: Log file operations
- **WHEN** verbose mode is enabled
- **THEN** the system MUST log all file reads, writes, and modifications
- **AND** include file paths and operation results

#### Scenario: Respect quiet mode
- **WHEN** user runs a command with `--quiet` or `-q` flag
- **THEN** the system MUST suppress all non-essential output
- **AND** only display errors

---

### Requirement: Help and Documentation Access

The system SHALL provide comprehensive help for all commands.

#### Scenario: Command-specific help
- **WHEN** user runs `clavix [command] --help`
- **THEN** the system MUST display help specific to that command
- **AND** include usage syntax, description, and available options

#### Scenario: Global help
- **WHEN** user runs `clavix --help` or `clavix help`
- **THEN** the system MUST display all available commands
- **AND** include a brief description for each

#### Scenario: Display examples
- **WHEN** displaying help for a command
- **THEN** the help text SHOULD include usage examples
- **AND** demonstrate common use cases

