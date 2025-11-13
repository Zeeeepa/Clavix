import { Command, Args } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { PromptOptimizer } from '../../core/prompt-optimizer';

export default class Fast extends Command {
  static description = 'Quickly improve a prompt with smart triage';

  static examples = [
    '<%= config.bin %> <%= command.id %> "Create a login page"',
    '<%= config.bin %> <%= command.id %> "Build an API for user management"',
  ];

  static args = {
    prompt: Args.string({
      description: 'The prompt to improve',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Fast);

    if (!args.prompt || args.prompt.trim().length === 0) {
      console.log(chalk.red('\n✗ Please provide a prompt to improve\n'));
      console.log(chalk.gray('Example:'), chalk.cyan('clavix fast "Create a login page"'));
      return;
    }

    console.log(chalk.bold.cyan('\n🔍 Analyzing prompt in fast mode...\n'));

    const optimizer = new PromptOptimizer();
    const result = optimizer.improve(args.prompt, 'fast');

    // Check triage result
    if (result.triageResult?.needsDeepAnalysis) {
      console.log(chalk.bold.yellow('⚠️  Smart Triage Alert\n'));
      console.log(chalk.yellow('Deep analysis is recommended for this prompt because:'));
      result.triageResult.reasons.forEach((reason) => {
        console.log(chalk.yellow(`  • ${reason}`));
      });
      console.log();

      const { proceed } = await inquirer.prompt([
        {
          type: 'list',
          name: 'proceed',
          message: 'How would you like to proceed?',
          choices: [
            { name: 'Switch to deep mode (recommended)', value: 'deep' },
            { name: 'Continue with fast mode (at my own risk)', value: 'fast' },
          ],
        },
      ]);

      if (proceed === 'deep') {
        console.log(chalk.cyan('\n🔍 Switching to deep mode...\n'));
        const deepResult = optimizer.improve(args.prompt, 'deep');
        this.displayDeepModeOutput(deepResult);
        return;
      }

      console.log(chalk.yellow('\n⚠️  Proceeding with fast mode as requested\n'));
    }

    // Display analysis
    this.displayFastModeOutput(result);
  }

  private displayFastModeOutput(result: any): void {
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

    // Display improved prompt
    console.log(chalk.bold.cyan('✨ Improved Prompt:\n'));
    console.log(chalk.dim('─'.repeat(80)));
    console.log(result.improved);
    console.log(chalk.dim('─'.repeat(80)));

    console.log(chalk.gray('\n💡 Tip: Copy the improved prompt above and use it with your AI agent'));
    console.log(chalk.gray('💡 For comprehensive analysis, use'), chalk.cyan('clavix deep'), chalk.gray('instead\n'));
  }

  private displayDeepModeOutput(result: any): void {
    // Display everything from fast mode
    this.displayFastModeOutput(result);

    // Add deep mode specific sections
    if (result.alternativePhrasings && result.alternativePhrasings.length > 0) {
      console.log(chalk.bold.cyan('\n🔄 Alternative Phrasings:'));
      result.alternativePhrasings.forEach((phrasing: string, index: number) => {
        console.log(chalk.cyan(`  ${index + 1}. ${phrasing}`));
      });
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
      console.log(chalk.bold.green('✅ Good Implementation Examples:'));
      result.implementationExamples.good.forEach((example: string) => {
        console.log(chalk.green(`  • ${example}`));
      });
      console.log();

      console.log(chalk.bold.red('❌ Bad Implementation Examples:'));
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

    console.log(chalk.gray('💡 Deep mode analysis complete!\n'));
  }
}
