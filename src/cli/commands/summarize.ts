import { Command, Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import * as path from 'path';
import { SessionManager } from '../../core/session-manager';
import { ConversationAnalyzer } from '../../core/conversation-analyzer';
import { FileSystem } from '../../utils/file-system';

export default class Summarize extends Command {
  static description = 'Analyze a conversation session and extract structured requirements';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> <session-id>',
    '<%= config.bin %> <%= command.id %> --active',
  ];

  static args = {
    sessionId: Args.string({
      description: 'Session ID to summarize',
      required: false,
    }),
  };

  static flags = {
    active: Flags.boolean({
      char: 'a',
      description: 'Summarize the most recent active session',
      default: false,
    }),
    output: Flags.string({
      char: 'o',
      description: 'Output directory (defaults to .clavix/outputs/[session-name])',
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Summarize);

    console.log(chalk.bold.cyan('\n📊 Conversation Summarizer\n'));

    try {
      const manager = new SessionManager();
      const analyzer = new ConversationAnalyzer();

      // Load session
      let session;
      if (args.sessionId) {
        console.log(chalk.dim(`Loading session ${args.sessionId}...\n`));
        session = await manager.getSession(args.sessionId);

        if (!session) {
          console.log(chalk.red(`✗ Session not found: ${args.sessionId}\n`));
          this.exit(1);
        }
      } else if (flags.active) {
        console.log(chalk.dim('Loading most recent active session...\n'));
        session = await manager.getActiveSession();

        if (!session) {
          console.log(chalk.red('✗ No active session found\n'));
          console.log(chalk.gray('Tip: Use ') + chalk.cyan('clavix list') + chalk.gray(' to see all sessions\n'));
          this.exit(1);
        }
      } else {
        // Try to get active session by default
        session = await manager.getActiveSession();

        if (!session) {
          console.log(chalk.yellow('⚠ No active session found\n'));
          console.log(chalk.gray('Usage:'));
          console.log(chalk.gray('  • ') + chalk.cyan('clavix summarize <session-id>') + chalk.gray(' - Summarize specific session'));
          console.log(chalk.gray('  • ') + chalk.cyan('clavix summarize --active') + chalk.gray(' - Summarize most recent active session'));
          console.log(chalk.gray('  • ') + chalk.cyan('clavix list') + chalk.gray(' - View all sessions\n'));
          this.exit(1);
        }
      }

      // Display session info
      console.log(chalk.bold('Session Information:'));
      console.log(chalk.gray('  ID:'), chalk.cyan(session.id));
      console.log(chalk.gray('  Project:'), chalk.cyan(session.projectName));
      console.log(chalk.gray('  Messages:'), chalk.cyan(session.messages.length.toString()));
      console.log(chalk.gray('  Created:'), chalk.dim(session.created.toLocaleString()));
      console.log();

      // Check if session has messages
      if (session.messages.length === 0) {
        console.log(chalk.yellow('⚠ Session has no messages to analyze\n'));
        this.exit(1);
      }

      // Analyze conversation
      console.log(chalk.dim('Analyzing conversation...\n'));
      const analysis = analyzer.analyze(session);

      // Display analysis summary
      this.displayAnalysisSummary(analysis);

      // Generate outputs
      console.log(chalk.dim('\nGenerating output files...\n'));

      const outputDir = flags.output ||
        path.join('.clavix/outputs', this.sanitizeProjectName(session.projectName));

      await FileSystem.ensureDir(outputDir);

      // Generate mini-PRD
      const miniPrdContent = analyzer.generateMiniPrd(session, analysis);
      const miniPrdPath = path.join(outputDir, 'mini-prd.md');
      await FileSystem.writeFileAtomic(miniPrdPath, miniPrdContent);

      // Generate optimized prompt
      const optimizedPromptContent = analyzer.generateOptimizedPrompt(session, analysis);
      const optimizedPromptPath = path.join(outputDir, 'optimized-prompt.md');
      await FileSystem.writeFileAtomic(optimizedPromptPath, optimizedPromptContent);

      // Display success
      console.log(chalk.bold.green('✨ Analysis complete!\n'));
      console.log(chalk.bold('Generated files:'));
      console.log(chalk.gray('  • ') + chalk.cyan('mini-prd.md') + chalk.dim(' - Structured requirements document'));
      console.log(chalk.gray('  • ') + chalk.cyan('optimized-prompt.md') + chalk.dim(' - AI-ready development prompt'));
      console.log();
      console.log(chalk.bold('Output location:'));
      console.log(chalk.dim(`  ${outputDir}`));
      console.log();
      console.log(chalk.bold('Next steps:'));
      console.log(chalk.gray('  • Use ') + chalk.cyan('optimized-prompt.md') + chalk.gray(' as input for your AI agent'));
      console.log(chalk.gray('  • Share ') + chalk.cyan('mini-prd.md') + chalk.gray(' with your team for alignment'));
      console.log();
    } catch (error) {
      if (error instanceof Error) {
        console.log(chalk.red(`\n✗ Error: ${error.message}\n`));
      } else {
        console.log(chalk.red('\n✗ An unexpected error occurred\n'));
      }
      this.exit(1);
    }
  }

  /**
   * Display analysis summary
   */
  private displayAnalysisSummary(analysis: any): void {
    console.log(chalk.bold('Analysis Summary:'));
    console.log();

    if (analysis.keyRequirements.length > 0) {
      console.log(chalk.bold.cyan('Key Requirements:'));
      analysis.keyRequirements.forEach((req: string) => {
        console.log(chalk.gray('  • ') + req);
      });
      console.log();
    }

    if (analysis.technicalConstraints.length > 0) {
      console.log(chalk.bold.cyan('Technical Constraints:'));
      analysis.technicalConstraints.forEach((constraint: string) => {
        console.log(chalk.gray('  • ') + constraint);
      });
      console.log();
    }

    if (analysis.successCriteria.length > 0) {
      console.log(chalk.bold.cyan('Success Criteria:'));
      analysis.successCriteria.forEach((criteria: string) => {
        console.log(chalk.gray('  • ') + criteria);
      });
      console.log();
    }

    if (analysis.outOfScope.length > 0) {
      console.log(chalk.bold.yellow('Out of Scope:'));
      analysis.outOfScope.forEach((item: string) => {
        console.log(chalk.gray('  • ') + item);
      });
      console.log();
    }
  }

  /**
   * Sanitize project name for directory name
   */
  private sanitizeProjectName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }
}
