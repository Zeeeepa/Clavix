import { Command, Args } from '@oclif/core';
import chalk from 'chalk';
import { PromptOptimizer } from '../../core/prompt-optimizer';

export default class Deep extends Command {
  static description = 'Perform comprehensive deep analysis of a prompt';

  static examples = [
    '<%= config.bin %> <%= command.id %> "Create a login page"',
    '<%= config.bin %> <%= command.id %> "Build an API for user management"',
  ];

  static args = {
    prompt: Args.string({
      description: 'The prompt to analyze deeply',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Deep);

    if (!args.prompt || args.prompt.trim().length === 0) {
      console.log(chalk.red('\n✗ Please provide a prompt to analyze\n'));
      console.log(chalk.gray('Example:'), chalk.cyan('clavix deep "Create a login page"'));
      return;
    }

    console.log(chalk.bold.cyan('\n🔍 Performing deep analysis...\n'));

    const optimizer = new PromptOptimizer();
    const result = optimizer.improve(args.prompt, 'deep');

    this.displayOutput(result);
  }

  private displayOutput(result: any): void {
    console.log(chalk.bold('Original Prompt:'));
    console.log(chalk.gray(result.original));
    console.log();

    // Quality assessment
    if (result.qualityAssessment?.isAlreadyGood) {
      console.log(chalk.bold.green('✅ Already Good!'));
      console.log(
        chalk.green(
          `  This prompt meets ${result.qualityAssessment.criteriaMetCount}/${result.qualityAssessment.totalCriteria} quality criteria`
        )
      );
      console.log();
    }

    // Display analysis results
    if (result.analysis.strengths.length > 0) {
      console.log(chalk.bold.green('✓ Strengths:'));
      result.analysis.strengths.forEach((strength: string) => {
        console.log(chalk.green(`  • ${strength}`));
      });
      console.log();
    }

    if (result.analysis.gaps.length > 0) {
      console.log(chalk.bold.yellow('⚠ Gaps:'));
      result.analysis.gaps.forEach((gap: string) => {
        console.log(chalk.yellow(`  • ${gap}`));
      });
      console.log();
    }

    if (result.analysis.ambiguities.length > 0) {
      console.log(chalk.bold.red('⚠ Ambiguities:'));
      result.analysis.ambiguities.forEach((ambiguity: string) => {
        console.log(chalk.red(`  • ${ambiguity}`));
      });
      console.log();
    }

    if (result.analysis.suggestions.length > 0) {
      console.log(chalk.bold.blue('💡 Suggestions:'));
      result.analysis.suggestions.forEach((suggestion: string) => {
        console.log(chalk.blue(`  • ${suggestion}`));
      });
      console.log();
    }

    // Changes made summary
    if (result.changesSummary?.changes.length > 0) {
      console.log(chalk.bold.magenta('📝 Changes Made:'));
      result.changesSummary.changes.forEach((change: string) => {
        console.log(chalk.magenta(`  • ${change}`));
      });
      console.log();
    }

    // Deep mode specific sections
    if (result.alternativePhrasings && result.alternativePhrasings.length > 0) {
      console.log(chalk.bold.cyan('🔄 Alternative Phrasings:'));
      result.alternativePhrasings.forEach((phrasing: string, index: number) => {
        console.log(chalk.cyan(`  ${index + 1}. ${phrasing}`));
      });
      console.log(chalk.gray('  Use when: Different stakeholders need different framings'));
      console.log();
    }

    if (result.edgeCases && result.edgeCases.length > 0) {
      console.log(chalk.bold.yellow('🔍 Edge Cases to Consider:'));
      result.edgeCases.forEach((edgeCase: string) => {
        console.log(chalk.yellow(`  • ${edgeCase}`));
      });
      console.log();
    }

    if (result.implementationExamples) {
      console.log(chalk.bold.green('✅ Good Implementation Patterns:'));
      result.implementationExamples.good.forEach((example: string) => {
        console.log(chalk.green(`  • ${example}`));
      });
      console.log();

      console.log(chalk.bold.red('❌ Bad Implementation Patterns:'));
      result.implementationExamples.bad.forEach((example: string) => {
        console.log(chalk.red(`  • ${example}`));
      });
      console.log();
    }

    if (result.alternativeStructures && result.alternativeStructures.length > 0) {
      console.log(chalk.bold.blue('📋 Alternative Prompt Structures:'));
      result.alternativeStructures.forEach((alt: any, index: number) => {
        console.log(chalk.blue(`  ${index + 1}. ${alt.structure}`));
        console.log(chalk.gray(`     → ${alt.benefits}`));
      });
      console.log();
    }

    if (result.potentialIssues && result.potentialIssues.length > 0) {
      console.log(chalk.bold.red('⚠️  What Could Go Wrong:'));
      result.potentialIssues.forEach((issue: string) => {
        console.log(chalk.red(`  • ${issue}`));
      });
      console.log();
    }

    // Display improved prompt
    console.log(chalk.bold.cyan('✨ Improved Prompt:\n'));
    console.log(chalk.dim('─'.repeat(80)));
    console.log(result.improved);
    console.log(chalk.dim('─'.repeat(80)));

    console.log(
      chalk.gray('\n💡 Tip: Copy the improved prompt above and use it with your AI agent')
    );
    console.log(chalk.gray('💡 Deep mode analysis complete! Consider edge cases and alternative structures.\n'));
  }
}
