import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import { DocInjector } from '../../core/doc-injector';
import { AgentManager } from '../../core/agent-manager';

export default class Update extends Command {
  static description = 'Update managed blocks and slash commands';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --docs-only',
    '<%= config.bin %> <%= command.id %> --commands-only',
  ];

  static flags = {
    'docs-only': Flags.boolean({
      description: 'Update only documentation blocks (AGENTS.md, CLAUDE.md)',
      default: false,
    }),
    'commands-only': Flags.boolean({
      description: 'Update only slash command files',
      default: false,
    }),
    force: Flags.boolean({
      char: 'f',
      description: 'Force update even if files haven\'t changed',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Update);

    const clavixDir = path.join(process.cwd(), '.clavix');
    const configPath = path.join(clavixDir, 'config.json');

    if (!fs.existsSync(clavixDir) || !fs.existsSync(configPath)) {
      this.error(
        chalk.red('No .clavix directory found.') +
        '\n' +
        chalk.yellow('Run ') +
        chalk.cyan('clavix init') +
        chalk.yellow(' to initialize Clavix in this project.')
      );
    }

    this.log(chalk.bold.cyan('🔄 Updating Clavix integration...\n'));

    // Load config to determine agent
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const agentType = config.agent || 'claude-code';

    const agentManager = new AgentManager();
    const adapter = agentManager.getAdapter(agentType);

    if (!adapter) {
      this.error(chalk.red(`Unknown agent type: ${agentType}`));
    }

    const updateDocs = flags['docs-only'] || (!flags['docs-only'] && !flags['commands-only']);
    const updateCommands = flags['commands-only'] || (!flags['docs-only'] && !flags['commands-only']);

    let updatedCount = 0;

    // Update documentation blocks
    if (updateDocs) {
      updatedCount += await this.updateDocumentation(adapter, agentType, flags.force);
    }

    // Update slash commands
    if (updateCommands) {
      updatedCount += await this.updateCommands(adapter, flags.force);
    }

    this.log('');
    if (updatedCount > 0) {
      this.log(chalk.green(`✅ Successfully updated ${updatedCount} file(s)`));
    } else {
      this.log(chalk.gray('✓ All files are up to date'));
    }
  }

  private async updateDocumentation(adapter: any, agentType: string, force: boolean): Promise<number> {
    this.log(chalk.cyan('📝 Updating documentation blocks...'));

    let updated = 0;

    // Update AGENTS.md
    const agentsPath = path.join(process.cwd(), 'AGENTS.md');
    if (fs.existsSync(agentsPath)) {
      const agentsContent = this.getAgentsContent();
      const currentContent = fs.readFileSync(agentsPath, 'utf-8');

      if (force || !this.hasUpToDateBlock(currentContent, agentsContent)) {
        await DocInjector.injectBlock(agentsPath, agentsContent);
        this.log(chalk.gray('  ✓ Updated AGENTS.md'));
        updated++;
      } else {
        this.log(chalk.gray('  • AGENTS.md already up to date'));
      }
    } else {
      this.log(chalk.yellow('  ⚠ AGENTS.md not found, skipping'));
    }

    // Update agent-specific docs (e.g., CLAUDE.md for Claude Code)
    if (agentType === 'claude-code') {
      const claudePath = path.join(process.cwd(), 'CLAUDE.md');
      if (fs.existsSync(claudePath)) {
        const claudeContent = this.getClaudeContent();
        const currentContent = fs.readFileSync(claudePath, 'utf-8');

        if (force || !this.hasUpToDateBlock(currentContent, claudeContent)) {
          await DocInjector.injectBlock(claudePath, claudeContent, {
            startMarker: '<!-- CLAVIX:START -->',
            endMarker: '<!-- CLAVIX:END -->',
          });
          this.log(chalk.gray('  ✓ Updated CLAUDE.md'));
          updated++;
        } else {
          this.log(chalk.gray('  • CLAUDE.md already up to date'));
        }
      } else {
        this.log(chalk.yellow('  ⚠ CLAUDE.md not found, skipping'));
      }
    }

    return updated;
  }

  private async updateCommands(adapter: any, force: boolean): Promise<number> {
    this.log(chalk.cyan('\n🔧 Updating slash commands...'));

    const commandsDir = adapter.getCommandPath();
    const commandsPath = path.join(process.cwd(), commandsDir);

    if (!fs.existsSync(commandsPath)) {
      this.log(chalk.yellow(`  ⚠ Commands directory not found: ${commandsDir}`));
      return 0;
    }

    const commands = ['prd', 'improve', 'start', 'summarize'];
    let updated = 0;

    for (const command of commands) {
      const commandFile = path.join(commandsPath, `clavix-${command}.md`);
      const templatePath = path.join(__dirname, '..', '..', 'templates', 'slash-commands', 'claude-code', `${command}.md`);

      if (!fs.existsSync(templatePath)) {
        this.log(chalk.yellow(`  ⚠ Template not found for ${command}, skipping`));
        continue;
      }

      const newContent = fs.readFileSync(templatePath, 'utf-8');

      if (fs.existsSync(commandFile)) {
        const currentContent = fs.readFileSync(commandFile, 'utf-8');

        if (force || currentContent !== newContent) {
          fs.writeFileSync(commandFile, newContent);
          this.log(chalk.gray(`  ✓ Updated clavix-${command}.md`));
          updated++;
        } else {
          this.log(chalk.gray(`  • clavix-${command}.md already up to date`));
        }
      } else {
        fs.writeFileSync(commandFile, newContent);
        this.log(chalk.gray(`  ✓ Created clavix-${command}.md`));
        updated++;
      }
    }

    return updated;
  }

  private getAgentsContent(): string {
    return `## Clavix Integration

This project uses Clavix for prompt improvement and PRD generation.

### Available Commands
- \`clavix prd\` - Generate a comprehensive PRD through guided questions
- \`clavix improve [prompt]\` - Analyze and improve a prompt
- \`clavix start\` - Start a conversational session for iterative development
- \`clavix summarize\` - Extract requirements from conversation history
- \`clavix list\` - List all sessions and outputs
- \`clavix show [session-id]\` - Show detailed session information

### Quick Start
\`\`\`bash
# Generate a PRD
clavix prd

# Improve a prompt
clavix improve "Build a user auth system"

# Start conversational mode
clavix start
\`\`\`

Learn more: https://github.com/Bob5k/Clavix`;
  }

  private getClaudeContent(): string {
    return `## Clavix Integration

This project uses Clavix for prompt improvement and PRD generation. The following slash commands are available:

### /clavix:prd
Launch the PRD generation workflow. Clavix will guide you through strategic questions and generate both a comprehensive PRD and a quick-reference version optimized for AI consumption.

### /clavix:improve [prompt]
Analyze and improve a prompt directly. Provide your prompt as an argument, and Clavix will identify gaps, ambiguities, and generate a structured, development-ready version.

### /clavix:start
Enter conversational mode for iterative prompt development. Discuss your requirements naturally, and later use \`/clavix:summarize\` to extract an optimized prompt.

### /clavix:summarize
Analyze the current conversation and extract key requirements into a structured prompt and mini-PRD.

**Pro tip**: Start complex features with \`/clavix:prd\` or \`/clavix:start\` to ensure clear requirements before implementation.`;
  }

  private hasUpToDateBlock(currentContent: string, newContent: string): boolean {
    // Check if the managed block contains the new content
    return currentContent.includes(newContent.trim());
  }
}
