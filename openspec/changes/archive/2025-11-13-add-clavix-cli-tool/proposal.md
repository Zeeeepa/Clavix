## Why

AI-assisted development tools like Claude Code rely heavily on prompt quality to produce accurate, maintainable code. However, developers ("vibecoders") often struggle to write structured, comprehensive prompts that clearly communicate requirements, constraints, and success criteria. This leads to ambiguous outputs, multiple iteration cycles, and suboptimal code quality. Additionally, starting new projects without proper Product Requirements Documents (PRDs) results in scope creep and missed requirements.

Clavix addresses this by providing a zero-friction CLI tool that helps developers improve their prompts and generate structured PRDs through Socratic questioning, seamlessly integrating into their existing AI-assisted development workflow.

## What Changes

- **New npm package**: Global CLI tool installable via `npm install -g clavix`
- **Interactive initialization**: `clavix init` command with AI agent selector (initial support for Claude Code)
- **Managed documentation blocks**: Automatic injection into AGENTS.md and CLAUDE.md with update mechanism
- **Slash command registration**: Creates `.claude/commands/` files for seamless Claude Code integration
- **PRD generation workflow**: Socratic questioning system producing both comprehensive and condensed PRDs
- **Prompt improvement system**: Direct and conversational modes for optimizing AI prompts
- **Session management**: Local filesystem-based tracking with `.clavix/` directory structure
- **Template system**: Customizable question templates and output formats
- **Configuration management**: User preferences and agent-specific settings

### Key Features (Phase 1 - MVP)
- CLI scaffolding with oclif framework
- Agent selector (Claude Code support)
- Managed block injection system for AGENTS.md/CLAUDE.md
- Slash command file generation
- Basic prompt improvement (`/clavix:improve`)
- Core file system operations

### Key Features (Phase 2 - Core Workflows)
- Socratic PRD generator (`/clavix:prd`) with two-file output
- Conversational prompt refinement (`/clavix:start`)
- Conversation analysis and optimization (`/clavix:summarize`)
- Session CRUD operations (list, show, delete)
- Template customization system
- Enhanced error handling

## Impact

### Affected Specs
- **NEW**: `specs/clavix-core/spec.md` - Core CLI functionality and workflows

### Affected Code
- **NEW**: Complete TypeScript/Node.js CLI application
- **NEW**: npm package with global installation
- **Integration**: Claude Code slash command system (`.claude/commands/`)
- **Integration**: AGENTS.md and CLAUDE.md managed blocks
- **Local filesystem**: `.clavix/` directory in user projects

### User Impact
- **Developers**: Zero-friction tool installation and setup (`npm i -g clavix && clavix init`)
- **Claude Code users**: New slash commands immediately available after init
- **Project workflow**: Structured approach to requirements gathering and prompt optimization
- **No breaking changes**: Tool is additive and doesn't modify existing project functionality

### Technical Dependencies
- Node.js v18+ required
- npm package registry for distribution
- Local filesystem for session/config storage
- No external APIs or databases required (fully local operation)
