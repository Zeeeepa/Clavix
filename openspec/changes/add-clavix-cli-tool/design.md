## Context

Clavix is a global CLI tool designed to improve AI-assisted development by optimizing prompts and generating structured PRDs. The tool must:
- Work seamlessly with existing AI agent workflows (initially Claude Code)
- Be easily installable and require zero configuration for basic usage
- Maintain extensibility for future AI agents (Cursor, Windsurf, etc.)
- Store all data locally without external dependencies
- Integrate non-invasively into existing projects

### Key Stakeholders
- **Developers ("vibecoders")**: Primary users who want better AI outputs without workflow friction
- **AI agents**: Claude Code initially, with architecture supporting future integrations
- **Open source community**: Future contributors extending agent support

### Constraints
- Node.js v18+ runtime (no browser dependencies)
- Must work offline (no API calls required)
- Backward compatibility with future versions
- Cross-platform support (macOS, Linux, Windows)
- Minimal dependencies to reduce supply chain risk

---

## Goals / Non-Goals

### Goals
- Provide zero-friction installation: `npm i -g clavix && clavix init`
- Seamlessly integrate with Claude Code via slash commands
- Generate actionable PRDs through Socratic questioning
- Improve prompt quality with minimal user effort
- Store sessions and outputs locally with clear organization
- Make extensibility to new agents straightforward
- Maintain data persistence and session continuity

### Non-Goals
- **NOT** a project management or issue tracking system
- **NOT** a collaboration tool (Phase 1-2) - single-user focus
- **NOT** an AI service - no LLM API calls, purely structural tooling
- **NOT** a code generator - focuses on requirements and prompts
- **NOT** a replacement for existing documentation tools (Notion, Confluence)
- **NOT** supporting agents without file-based command systems (Phase 1-2)

---

## Decisions

### Decision 1: CLI Framework - oclif

**Choice**: Use oclif (Open CLI Framework) over Commander.js

**Rationale**:
- **Extensibility**: oclif's plugin architecture aligns perfectly with multi-agent support
- **TypeScript-first**: Native TypeScript support, no additional configuration
- **Command organization**: Auto-discovery of commands, cleaner structure for 10+ commands
- **Help generation**: Automatic help text and documentation
- **Testing utilities**: Built-in test helpers for CLI commands
- **Proven scale**: Used by Heroku CLI, Salesforce CLI - handles complexity well

**Alternatives Considered**:
- **Commander.js**: Simpler but lacks plugin architecture, would require custom extensibility layer
- **Yargs**: Good middle ground but less opinionated about structure

**Trade-offs**:
- More initial setup complexity (+30 minutes)
- Slightly larger dependency footprint (~2MB vs ~500KB)
- Worth it for long-term maintainability and extensibility

---

### Decision 2: Agent Integration Architecture

**Choice**: File-based, agent-agnostic plugin system

**Architecture**:
```typescript
interface AgentAdapter {
  name: string;
  detectProject(): boolean;
  generateCommands(templates: Template[]): void;
  injectDocumentation(blocks: ManagedBlock[]): void;
  getCommandPath(): string;
}

// Claude Code adapter
class ClaudeCodeAdapter implements AgentAdapter {
  name = 'claude-code';

  detectProject(): boolean {
    return fs.existsSync('.claude/');
  }

  generateCommands(templates: Template[]): void {
    // Generate files in .claude/commands/
  }

  injectDocumentation(blocks: ManagedBlock[]): void {
    // Inject into CLAUDE.md
  }

  getCommandPath(): string {
    return '.claude/commands/';
  }
}
```

**Rationale**:
- **Extensibility**: New agents = new adapter class, no core changes
- **Separation of concerns**: Agent-specific logic isolated
- **Testability**: Each adapter independently testable
- **Discovery**: Auto-detect available agents in project

**Future agents**:
- Cursor: `.cursor/rules` integration
- Windsurf: `.windsurf/workflows/` support
- Custom: User-defined adapters via plugins

---

### Decision 3: Managed Block Strategy (Inspired by OpenSpec)

**Choice**: HTML comment-based managed blocks with strict boundaries

**Format**:
```markdown
<!-- CLAVIX:START -->
# Clavix - Prompt Improvement Assistant
[Generated content - DO NOT EDIT]
<!-- CLAVIX:END -->
```

**Implementation**:
```typescript
class DocInjector {
  private readonly START_MARKER = '<!-- CLAVIX:START -->';
  private readonly END_MARKER = '<!-- CLAVIX:END -->';

  inject(filePath: string, content: string): void {
    const current = this.readFile(filePath);
    const blockRegex = new RegExp(
      `${this.START_MARKER}[\\s\\S]*?${this.END_MARKER}`,
      'g'
    );

    if (blockRegex.test(current)) {
      // Replace existing block
      this.backup(filePath);
      const updated = current.replace(blockRegex, this.wrapBlock(content));
      this.writeFile(filePath, updated);
    } else {
      // Append new block
      const updated = current + '\n\n' + this.wrapBlock(content);
      this.writeFile(filePath, updated);
    }
  }
}
```

**Rationale**:
- **Clear ownership**: Users know not to edit managed sections
- **Safe updates**: `clavix update` can refresh without destroying user content
- **Visibility**: HTML comments visible in markdown but don't render
- **Proven pattern**: OpenSpec uses this successfully

**Safety mechanisms**:
- Always backup before modification
- Validate markdown syntax after injection
- Warn if user edits managed blocks (Phase 3)

---

### Decision 4: Session Storage Format

**Choice**: Markdown files with YAML frontmatter

**Format**:
```markdown
---
id: 2025-01-13-14-30-user-auth
project: user-auth
agent: claude-code
created: 2025-01-13T14:30:00Z
updated: 2025-01-13T15:45:00Z
status: active
---

# Session: User Authentication Feature

## Conversation

**User** (14:30): I need to build a user authentication system

**Assistant** (14:31): What type of authentication are you considering?

**User** (14:32): JWT-based with refresh tokens
```

**Rationale**:
- **Human-readable**: Users can view sessions in any text editor
- **Git-friendly**: Easy to track, diff, and version control
- **Flexible**: Easy to add metadata fields without breaking format
- **Parseable**: YAML frontmatter + markdown body = easy parsing

**Alternatives Considered**:
- JSON: Not human-friendly for long conversations
- Plain text: Harder to parse structured metadata
- SQLite: Overkill, adds dependency, less transparent

---

### Decision 5: Template System

**Choice**: Handlebars for templates with fallback to built-in defaults

**Structure**:
```
src/templates/               # Built-in defaults
  ├── prd-questions.md
  ├── full-prd-template.hbs
  ├── quick-prd-template.hbs
  └── slash-commands/
      └── claude-code/
          ├── prd.md
          └── improve.md

.clavix/templates/           # User overrides (optional)
  ├── prd-questions.md       # Custom questions
  └── full-prd-template.hbs  # Custom PRD format
```

**Template Resolution**:
1. Check `.clavix/templates/` for user override
2. Fall back to built-in `src/templates/`
3. Error if neither exists

**Rationale**:
- **Customization**: Power users can tweak without forking
- **Sensible defaults**: Works out-of-box for 95% of users
- **Handlebars**: Simple, widely-known, no code execution risk

---

### Decision 6: Configuration Schema

**Choice**: JSON5 format for user-friendly config

```jsonc
// .clavix/config.json
{
  version: "1.0.0",
  agent: "claude-code",
  templates: {
    prdQuestions: ".clavix/templates/prd-questions.md", // or "default"
    fullPrd: "default",
    quickPrd: "default"
  },
  outputs: {
    path: ".clavix/outputs",
    format: "markdown" // or "pdf" (Phase 3)
  },
  preferences: {
    autoOpenOutputs: false,
    verboseLogging: false,
    preserveSessions: true
  },
  // Reserved for future use
  experimental: {}
}
```

**Validation**: Use JSON Schema for runtime validation

**Rationale**:
- **JSON5**: Supports comments and trailing commas, more user-friendly than strict JSON
- **Flat structure**: Easy to understand and modify
- **Defaults**: Missing keys fall back to sensible defaults
- **Extensible**: `experimental` key for beta features

---

### Decision 7: Prompt Optimization Strategy

**Choice**: Rule-based analysis with structured output (no AI API calls)

**Analysis Rules**:
```typescript
interface PromptAnalysis {
  gaps: string[];           // Missing information
  ambiguities: string[];    // Unclear requirements
  strengths: string[];      // What's good
  suggestions: string[];    // Improvements
}

class PromptOptimizer {
  analyze(prompt: string): PromptAnalysis {
    return {
      gaps: this.findGaps(prompt),
      ambiguities: this.findAmbiguities(prompt),
      strengths: this.findStrengths(prompt),
      suggestions: this.generateSuggestions(prompt)
    };
  }

  private findGaps(prompt: string): string[] {
    const gaps = [];
    if (!this.hasContext(prompt)) gaps.push('Missing context');
    if (!this.hasSuccessCriteria(prompt)) gaps.push('No success criteria');
    if (!this.hasTechnicalDetails(prompt)) gaps.push('Missing technical details');
    return gaps;
  }
}
```

**Rationale**:
- **No API costs**: Fully local, works offline
- **Deterministic**: Same input = same output
- **Fast**: Sub-second analysis
- **Transparent**: Users understand what's being checked

**Future enhancement (Phase 4)**: Optional AI-powered analysis via Claude API

---

### Decision 8: PRD Generation Approach

**Choice**: Guided Socratic questioning with dual output format

**Workflow**:
1. Load question template (5-7 strategic questions)
2. Present questions one at a time using Inquirer.js
3. Collect and validate answers
4. Generate two files:
   - `full-prd.md`: Comprehensive document (human-readable)
   - `quick-prd.md`: Condensed prompt (AI-optimized, 2-3 paragraphs)

**Question Template Example**:
```markdown
1. **Problem Statement**: What problem are you solving? Who experiences this problem?
2. **Target Users**: Who will use this? What are their key characteristics?
3. **Core Features**: What are the must-have features? (List 3-5)
4. **Success Criteria**: How will you measure success?
5. **Technical Constraints**: Any specific technologies, performance requirements, or integrations?
6. **Out of Scope**: What are you explicitly NOT building?
7. **Timeline**: Any deadlines or milestones?
```

**Rationale**:
- **Socratic method**: Guides thinking without being prescriptive
- **Two formats**: Full PRD for team alignment, quick PRD for immediate AI use
- **Customizable**: Users can modify questions for different project types

---

### Decision 9: Error Handling Strategy

**Choice**: Graceful degradation with helpful error messages

**Principles**:
1. **Never crash silently**: Always show what went wrong
2. **Actionable errors**: Tell user how to fix
3. **Preserve user data**: Never lose session data on error
4. **Atomic operations**: File writes are all-or-nothing

**Example**:
```typescript
try {
  this.injectManagedBlock('AGENTS.md', content);
} catch (error) {
  if (error.code === 'EACCES') {
    throw new ClavixError(
      'Permission denied: Cannot write to AGENTS.md',
      'Try running with appropriate permissions or check file ownership',
      'PERMISSION_ERROR'
    );
  }
  // Always restore backup on failure
  this.restoreBackup('AGENTS.md');
  throw error;
}
```

**Error Categories**:
- `PERMISSION_ERROR`: File system permission issues
- `VALIDATION_ERROR`: Invalid user input or configuration
- `INTEGRATION_ERROR`: Agent detection/integration failures
- `DATA_ERROR`: Session or config corruption

---

## Risks / Trade-offs

### Risk 1: Managed Block Conflicts
**Risk**: User edits managed block manually, `clavix update` overwrites changes

**Mitigation**:
- Clear documentation: "DO NOT EDIT" warnings in blocks
- Backup before every modification
- Phase 3: Add file watcher to warn when managed blocks edited
- Future: Detect manual edits and prompt user

**Trade-off**: Accept that power users might break managed blocks, prioritize simplicity over complex merge logic

---

### Risk 2: Agent Detection Ambiguity
**Risk**: Multiple agents in same project (e.g., .claude/ AND .cursor/)

**Mitigation**:
- Phase 1: Single agent selection during init, store in config
- Explicit: Ask user which agent to use if multiple detected
- Future: Support multi-agent projects with agent-specific commands

**Trade-off**: Start simple (one agent per project), add complexity when proven need

---

### Risk 3: Session Storage Growth
**Risk**: `.clavix/sessions/` grows unbounded with long conversations

**Mitigation**:
- Implement session cleanup command (`clavix clean`)
- Add session archival (move old sessions to `sessions/archive/`)
- Document best practices (one session per feature)
- Future: Add session compression

**Trade-off**: Storage is cheap, prefer keeping data over aggressive cleanup

---

### Risk 4: Cross-Platform File System Differences
**Risk**: Path handling differs (Windows `\` vs Unix `/`)

**Mitigation**:
- Use `path.join()` and `path.resolve()` consistently
- Test on all platforms in CI/CD
- Handle file permission differences gracefully
- Use `fs-extra` for consistent cross-platform behavior

---

### Risk 5: Template Versioning
**Risk**: Built-in templates change, user overrides become incompatible

**Mitigation**:
- Version templates in filename: `prd-questions-v1.md`
- `clavix update` warns about outdated custom templates
- Provide migration guide for template updates
- Semantic versioning for breaking template changes

**Trade-off**: Some manual migration burden for users with custom templates

---

## Migration Plan

### Phase 1 (MVP) → Phase 2 (Core Workflows)
**Changes**:
- Add new commands (seamless, backward compatible)
- Extend config schema (new optional keys)
- Add new directories (`.clavix/outputs/`, `.clavix/sessions/`)

**Migration**: None required - all changes additive

---

### Phase 2 → Phase 3 (Future)
**Potential Breaking Changes**:
- Config schema major version bump
- Template format changes
- Agent adapter interface changes

**Migration Strategy**:
1. Detect old config version
2. Run automatic migration: `clavix migrate`
3. Backup old config before migration
4. Provide rollback if migration fails

---

### Distribution and Updates
**Initial Install**:
```bash
npm install -g clavix
clavix init
```

**Updates**:
```bash
npm update -g clavix
clavix update  # Refresh managed blocks and slash commands
```

**Version Compatibility**:
- Major version (1.x → 2.x): Breaking changes, migration required
- Minor version (1.1 → 1.2): New features, backward compatible
- Patch version (1.1.1 → 1.1.2): Bug fixes, always safe

---

## Open Questions

### Q1: Should we support team-shared templates via Git?
**Context**: Teams might want standardized PRD questions

**Options**:
- A) Support remote template URLs (e.g., `https://company.com/templates/prd.md`)
- B) Document Git-based template sharing (commit `.clavix/templates/` to repo)
- C) Add template marketplace (Phase 4)

**Decision**: Start with B (Git-based), consider A/C in Phase 3+

---

### Q2: How to handle very long conversation sessions?
**Context**: 50+ message conversations might become unwieldy

**Options**:
- A) Paginate in `clavix show`
- B) Add conversation threading/topics
- C) Limit session length, encourage new sessions
- D) Add conversation search/filtering

**Decision**: Phase 2 - implement A (pagination), revisit B/C/D based on user feedback

---

### Q3: Should `clavix improve` support batch mode?
**Context**: Users might want to improve multiple prompts at once

**Options**:
- A) `clavix improve --file prompts.txt` (batch from file)
- B) `clavix improve --dir ./prompts/` (directory of prompts)
- C) Keep it single-prompt focused

**Decision**: Phase 2 - stick with C, add A/B in Phase 3 if requested

---

### Q4: How to handle sensitive data in sessions?
**Context**: Users might discuss API keys, credentials in conversations

**Options**:
- A) Add `--no-log` flag to exclude messages from session
- B) Implement automatic secret detection and redaction
- C) Document best practices, leave responsibility to user
- D) Add session encryption (opt-in)

**Decision**: Phase 2 - implement C (documentation), consider B/D in Phase 3

---

## Success Metrics

### Phase 1 (MVP)
- ✅ `clavix init` completes in < 10 seconds
- ✅ Slash commands appear in Claude Code immediately after init
- ✅ `clavix improve` produces measurably better prompts (via user survey)
- ✅ Zero crashes during basic workflows

### Phase 2 (Core Workflows)
- ✅ PRD generation completes in < 2 minutes (including question time)
- ✅ Generated PRDs are actionable (80%+ don't need manual editing)
- ✅ Conversational mode successfully extracts requirements (user validation)
- ✅ Session list/show commands load in < 500ms for 100+ sessions

### Technical Metrics
- Test coverage: > 80% for core modules
- Load time: CLI starts in < 1 second
- Package size: < 5MB installed
- Memory usage: < 50MB for typical operations
- Cross-platform: 100% test pass rate on macOS, Linux, Windows

---

## Architectural Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Clavix CLI                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Commands   │  │   Commands   │  │   Commands   │      │
│  │    init      │  │     prd      │  │   improve    │      │
│  │    start     │  │  summarize   │  │     list     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────┐      │
│  │                   Core Layer                       │      │
│  ├────────────────────────────────────────────────────┤      │
│  │  AgentManager  │  DocInjector  │  SessionManager  │      │
│  │  PrdGenerator  │  PromptOptim  │  QuestionEngine  │      │
│  └─────────────────────────────────────────────────────┘      │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────┐      │
│  │              Agent Adapters (Plugins)              │      │
│  ├────────────────────────────────────────────────────┤      │
│  │  ClaudeCodeAdapter  │  CursorAdapter (future)     │      │
│  └─────────────────────────────────────────────────────┘      │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────┐      │
│  │                 Utilities Layer                    │      │
│  ├────────────────────────────────────────────────────┤      │
│  │  FileSystem  │  Validators  │  Logger  │  Parser  │      │
│  └─────────────────────────────────────────────────────┘      │
│                            │                                 │
└────────────────────────────┴─────────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
    ┌────▼──────┐                    ┌──────────▼────────┐
    │  Project  │                    │   Agent Files     │
    │   Files   │                    │   (.claude/)      │
    ├───────────┤                    ├───────────────────┤
    │ AGENTS.md │◄───────────────────┤ commands/         │
    │ CLAUDE.md │                    │   clavix-prd.md   │
    │ .clavix/  │                    │   clavix-*.md     │
    │   config  │                    └───────────────────┘
    │   sessions│
    │   outputs │
    └───────────┘
```

---

## Conclusion

Clavix's architecture prioritizes:
1. **Simplicity**: File-based, local-first, no external dependencies
2. **Extensibility**: Agent adapter pattern for future integrations
3. **Safety**: Backup-first, atomic operations, clear error messages
4. **User experience**: Zero-friction install, intuitive commands, helpful defaults

The design decisions favor pragmatism over perfection, with clear paths for future enhancement without breaking existing functionality.
