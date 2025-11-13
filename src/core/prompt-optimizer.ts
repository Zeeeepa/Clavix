/**
 * PromptOptimizer - Analyzes and improves prompts using rule-based analysis
 */

export type OptimizerMode = 'fast' | 'deep';

export interface PromptAnalysis {
  gaps: string[];
  ambiguities: string[];
  strengths: string[];
  suggestions: string[];
}

export interface TriageResult {
  needsDeepAnalysis: boolean;
  reasons: string[];
}

export interface QualityAssessment {
  isAlreadyGood: boolean;
  criteriaMetCount: number;
  totalCriteria: number;
  criteriaResults: {
    clearGoal: boolean;
    sufficientContext: boolean;
    actionableLanguage: boolean;
    reasonableScope: boolean;
  };
}

export interface ChangesSummary {
  changes: string[];
}

export interface ImprovedPrompt {
  original: string;
  analysis: PromptAnalysis;
  improved: string;
  changesSummary?: ChangesSummary;
  triageResult?: TriageResult;
  qualityAssessment?: QualityAssessment;
  alternativePhrasings?: string[];
  edgeCases?: string[];
  implementationExamples?: {
    good: string[];
    bad: string[];
  };
  alternativeStructures?: Array<{
    structure: string;
    benefits: string;
  }>;
  potentialIssues?: string[];
}

export class PromptOptimizer {
  /**
   * Analyze a prompt and identify issues
   */
  analyze(prompt: string): PromptAnalysis {
    return {
      gaps: this.findGaps(prompt),
      ambiguities: this.findAmbiguities(prompt),
      strengths: this.findStrengths(prompt),
      suggestions: this.generateSuggestions(prompt),
    };
  }

  /**
   * Perform smart triage to determine if deep analysis is recommended
   */
  performTriage(prompt: string): TriageResult {
    const reasons: string[] = [];

    // Check 1: Short prompts (< 20 characters)
    if (prompt.trim().length < 20) {
      reasons.push('Prompt is very short (< 20 characters)');
    }

    // Check 2: Missing critical elements
    const criticalElements = this.countMissingCriticalElements(prompt);
    if (criticalElements >= 3) {
      reasons.push(`Missing ${criticalElements} critical elements (context, tech stack, success criteria, user needs, expected output)`);
    }

    // Check 3: Vague scope words without context
    if (this.hasVagueScopeWithoutContext(prompt)) {
      reasons.push('Contains vague scope words ("app", "system", "project") without sufficient context');
    }

    return {
      needsDeepAnalysis: reasons.length > 0,
      reasons,
    };
  }

  /**
   * Assess prompt quality
   */
  assessQuality(prompt: string): QualityAssessment {
    const criteria = {
      clearGoal: this.hasClearGoal(prompt),
      sufficientContext: this.hasContext(prompt),
      actionableLanguage: this.hasActionableLanguage(prompt),
      reasonableScope: this.hasReasonableScope(prompt),
    };

    const metCount = Object.values(criteria).filter(Boolean).length;
    const total = Object.keys(criteria).length;

    return {
      isAlreadyGood: metCount >= 3,
      criteriaMetCount: metCount,
      totalCriteria: total,
      criteriaResults: criteria,
    };
  }

  /**
   * Generate an improved version of the prompt
   */
  improve(prompt: string, mode: OptimizerMode = 'fast'): ImprovedPrompt {
    const analysis = this.analyze(prompt);
    const improved = this.generateImprovedPrompt(prompt, analysis);
    const changesSummary = this.generateChangesSummary(prompt, improved);
    const triageResult = mode === 'fast' ? this.performTriage(prompt) : undefined;
    const qualityAssessment = this.assessQuality(prompt);

    const result: ImprovedPrompt = {
      original: prompt,
      analysis,
      improved,
      changesSummary,
      triageResult,
      qualityAssessment,
    };

    // Add deep mode features
    if (mode === 'deep') {
      result.alternativePhrasings = this.generateAlternativePhrasings(prompt);
      result.edgeCases = this.identifyEdgeCases(prompt);
      result.implementationExamples = this.generateImplementationExamples(prompt);
      result.alternativeStructures = this.suggestAlternativeStructures(prompt);
      result.potentialIssues = this.identifyPotentialIssues(prompt);
    }

    return result;
  }

  /**
   * Find gaps in the prompt
   */
  private findGaps(prompt: string): string[] {
    const gaps: string[] = [];

    if (!this.hasContext(prompt)) {
      gaps.push('Missing context: What is the background or current situation?');
    }

    if (!this.hasSuccessCriteria(prompt)) {
      gaps.push('No success criteria: How will you know when this is complete?');
    }

    if (!this.hasTechnicalDetails(prompt)) {
      gaps.push('Missing technical details: What technologies or constraints apply?');
    }

    if (!this.hasUserNeeds(prompt)) {
      gaps.push('No user perspective: Who will use this and what do they need?');
    }

    if (!this.hasExpectedOutput(prompt)) {
      gaps.push('Unclear expected output: What should the final deliverable look like?');
    }

    return gaps;
  }

  /**
   * Find ambiguities in the prompt
   */
  private findAmbiguities(prompt: string): string[] {
    const ambiguities: string[] = [];

    // Check for vague terms
    const vagueTerms = ['some', 'maybe', 'probably', 'should', 'could', 'nice to have'];
    for (const term of vagueTerms) {
      if (new RegExp(`\\b${term}\\b`, 'i').test(prompt)) {
        ambiguities.push(`Vague term: "${term}" - be more specific`);
      }
    }

    // Check for undefined pronouns
    if (/(this|that|these|those|it)\s+/gi.test(prompt) && prompt.length < 100) {
      ambiguities.push('Undefined references: What does "this" or "it" refer to?');
    }

    // Check for unspecified quantities
    if (/\b(many|several|few|some)\b/i.test(prompt)) {
      ambiguities.push('Unspecified quantities: How many exactly?');
    }

    return ambiguities;
  }

  /**
   * Find strengths in the prompt
   */
  private findStrengths(prompt: string): string[] {
    const strengths: string[] = [];

    if (this.hasContext(prompt)) {
      strengths.push('Clear context provided');
    }

    if (this.hasTechnicalDetails(prompt)) {
      strengths.push('Technical constraints specified');
    }

    if (this.hasSuccessCriteria(prompt)) {
      strengths.push('Success criteria defined');
    }

    if (prompt.length > 200) {
      strengths.push('Comprehensive detail provided');
    }

    if (/example|such as|like|e\.g\./i.test(prompt)) {
      strengths.push('Includes examples for clarity');
    }

    return strengths;
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(prompt: string): string[] {
    const suggestions: string[] = [];

    if (!this.hasContext(prompt)) {
      suggestions.push('Add background: Explain the current situation or problem');
    }

    if (!this.hasSuccessCriteria(prompt)) {
      suggestions.push('Define success: Specify measurable criteria for completion');
    }

    if (!this.hasTechnicalDetails(prompt)) {
      suggestions.push('Add constraints: Specify technologies, integrations, or performance needs');
    }

    if (prompt.length < 50) {
      suggestions.push('Expand detail: Add more specific requirements and context');
    }

    if (!this.hasUserNeeds(prompt)) {
      suggestions.push('Consider users: Who will use this and what do they need?');
    }

    return suggestions;
  }

  /**
   * Generate improved prompt with structure
   */
  private generateImprovedPrompt(original: string, analysis: PromptAnalysis): string {
    let improved = '# Objective\n\n';
    improved += this.extractOrInferObjective(original) + '\n\n';

    improved += '# Requirements\n\n';
    improved += this.extractOrInferRequirements(original) + '\n\n';

    improved += '# Technical Constraints\n\n';
    improved += this.extractOrInferTechnical(original) + '\n\n';

    improved += '# Expected Output\n\n';
    improved += this.extractOrInferOutput(original) + '\n\n';

    improved += '# Success Criteria\n\n';
    improved += this.extractOrInferSuccess(original) + '\n';

    return improved;
  }

  // Helper methods for analysis
  private hasContext(prompt: string): boolean {
    return /\b(background|context|currently|existing|problem|issue|because)\b/i.test(prompt);
  }

  private hasSuccessCriteria(prompt: string): boolean {
    return /\b(success|complete|done|measure|metric|goal|should be able to)\b/i.test(prompt);
  }

  private hasTechnicalDetails(prompt: string): boolean {
    const techTerms = /\b(react|vue|angular|node|python|java|typescript|api|database|sql|nosql|aws|docker|kubernetes)\b/i;
    return techTerms.test(prompt) || /\b(integrate|performance|scale|security)\b/i.test(prompt);
  }

  private hasUserNeeds(prompt: string): boolean {
    return /\b(user|customer|client|team|developer|admin|visitor)\b/i.test(prompt);
  }

  private hasExpectedOutput(prompt: string): boolean {
    return /\b(output|result|deliverable|should|look like|include|contain)\b/i.test(prompt);
  }

  private extractOrInferObjective(prompt: string): string {
    // Try to find action verbs at the start
    const actionMatch = prompt.match(/^(create|build|develop|implement|add|update|fix|refactor|design)\s+(.+)/i);
    if (actionMatch) {
      return `${actionMatch[1]} ${actionMatch[2]}`;
    }
    return prompt.split('\n')[0] || prompt.substring(0, 100);
  }

  private extractOrInferRequirements(prompt: string): string {
    const lines = prompt.split('\n').filter((line) => line.trim());
    if (lines.length > 1) {
      return lines.slice(1).map((line) => `- ${line}`).join('\n');
    }
    return '- ' + prompt + '\n- [Add specific requirements based on objective]';
  }

  private extractOrInferTechnical(original: string): string {
    const techStack: string[] = [];

    if (/react/i.test(original)) techStack.push('React');
    if (/typescript/i.test(original)) techStack.push('TypeScript');
    if (/node/i.test(original)) techStack.push('Node.js');
    if (/python/i.test(original)) techStack.push('Python');

    if (techStack.length > 0) {
      return '- Technology stack: ' + techStack.join(', ') + '\n- [Add other constraints]';
    }

    return '- [Specify technologies, integrations, performance requirements]';
  }

  private extractOrInferOutput(original: string): string {
    if (/component|page|ui/i.test(original)) {
      return '- Functional, tested component\n- Responsive design\n- Accessible implementation';
    }
    if (/api|endpoint|service/i.test(original)) {
      return '- Working API endpoint(s)\n- Error handling\n- Documentation';
    }
    return '- [Describe what the final deliverable should look like]';
  }

  private extractOrInferSuccess(original: string): string {
    return '- Implementation matches requirements\n- All edge cases handled\n- Code is tested and documented\n- [Add specific success metrics]';
  }

  // New helper methods for mode support

  /**
   * Count missing critical elements
   */
  private countMissingCriticalElements(prompt: string): number {
    let missing = 0;

    if (!this.hasContext(prompt)) missing++;
    if (!this.hasTechnicalDetails(prompt)) missing++;
    if (!this.hasSuccessCriteria(prompt)) missing++;
    if (!this.hasUserNeeds(prompt)) missing++;
    if (!this.hasExpectedOutput(prompt)) missing++;

    return missing;
  }

  /**
   * Check for vague scope words without sufficient context
   */
  private hasVagueScopeWithoutContext(prompt: string): boolean {
    const vagueScopeWords = /\b(app|system|repository|project|platform|solution|tool|service)\b/i;

    if (!vagueScopeWords.test(prompt)) {
      return false;
    }

    // Check if there's sufficient context
    const hasSpecificPurpose = /\b(for|to|that|which|enables|allows|helps)\b.{10,}/i.test(prompt);
    const hasTechStack = this.hasTechnicalDetails(prompt);
    const hasDetailedRequirements = prompt.length > 100;

    return !(hasSpecificPurpose && (hasTechStack || hasDetailedRequirements));
  }

  /**
   * Check if prompt has a clear goal
   */
  private hasClearGoal(prompt: string): boolean {
    const actionVerbs = /^(create|build|develop|implement|add|update|fix|refactor|design|make|write)\b/i;
    return actionVerbs.test(prompt.trim()) || /objective|goal|purpose/i.test(prompt);
  }

  /**
   * Check if prompt uses actionable language
   */
  private hasActionableLanguage(prompt: string): boolean {
    const actionWords = /\b(create|build|implement|add|update|remove|fix|test|deploy|configure|setup)\b/i;
    return actionWords.test(prompt);
  }

  /**
   * Check if prompt has reasonable scope
   */
  private hasReasonableScope(prompt: string): boolean {
    // Too vague (unreasonably broad)
    const tooVague = /^(build an app|create a system|make a platform)$/i.test(prompt.trim());

    // Too specific (unreasonably narrow)
    const tooSpecific = prompt.length > 1000;

    return !tooVague && !tooSpecific;
  }

  /**
   * Generate changes summary
   */
  private generateChangesSummary(original: string, improved: string): ChangesSummary {
    const changes: string[] = [];

    if (!this.hasContext(original) && /# Objective/.test(improved)) {
      changes.push('Added clear objective and context');
    }

    if (!this.hasTechnicalDetails(original) && /# Technical Constraints/.test(improved)) {
      changes.push('Added technical constraints and requirements');
    }

    if (!this.hasSuccessCriteria(original) && /# Success Criteria/.test(improved)) {
      changes.push('Defined measurable success criteria');
    }

    if (!this.hasExpectedOutput(original) && /# Expected Output/.test(improved)) {
      changes.push('Specified expected deliverables');
    }

    if (original.length < 100 && improved.length > 100) {
      changes.push('Expanded prompt with structured sections');
    }

    if (changes.length === 0) {
      changes.push('Refined and structured the existing prompt');
    }

    return { changes };
  }

  /**
   * Generate alternative phrasings (deep mode)
   */
  private generateAlternativePhrasings(prompt: string): string[] {
    const phrasings: string[] = [];
    const mainAction = prompt.match(/^(create|build|develop|implement|add)/i)?.[0] || 'Implement';

    phrasings.push(`${mainAction} a solution that ${this.extractCoreRequirement(prompt)}`);
    phrasings.push(`Design and implement ${this.extractCoreRequirement(prompt)}`);
    phrasings.push(`Build a system to ${this.extractCoreRequirement(prompt)}`);

    return phrasings.slice(0, 3);
  }

  /**
   * Identify edge cases in requirements (deep mode)
   */
  private identifyEdgeCases(prompt: string): string[] {
    const edgeCases: string[] = [];

    if (/user|login|auth/i.test(prompt)) {
      edgeCases.push('What happens when user is not authenticated?');
      edgeCases.push('How to handle expired sessions?');
    }

    if (/api|endpoint|request/i.test(prompt)) {
      edgeCases.push('How to handle network failures or timeouts?');
      edgeCases.push('What validation is needed for input data?');
    }

    if (/form|input|data/i.test(prompt)) {
      edgeCases.push('How to handle invalid or malformed input?');
      edgeCases.push('What happens with empty or missing fields?');
    }

    if (edgeCases.length === 0) {
      edgeCases.push('Consider error states and failure scenarios');
      edgeCases.push('Think about boundary conditions and limits');
    }

    return edgeCases;
  }

  /**
   * Generate implementation examples (deep mode)
   */
  private generateImplementationExamples(prompt: string): { good: string[]; bad: string[] } {
    return {
      good: [
        'Clear, specific requirements with measurable outcomes',
        'Includes context about why this is needed',
        'Specifies technical constraints and success criteria',
      ],
      bad: [
        'Vague requirements without context',
        'No success criteria or expected output',
        'Missing technical constraints and user perspective',
      ],
    };
  }

  /**
   * Suggest alternative prompt structures (deep mode)
   */
  private suggestAlternativeStructures(prompt: string): Array<{ structure: string; benefits: string }> {
    return [
      {
        structure: 'User Story Format: As a [user], I want [goal] so that [benefit]',
        benefits: 'Focuses on user needs and value delivery',
      },
      {
        structure: 'Job Story Format: When [situation], I want to [motivation], so I can [expected outcome]',
        benefits: 'Emphasizes context and outcomes over personas',
      },
      {
        structure: 'Structured Sections: Objective, Requirements, Constraints, Success Criteria',
        benefits: 'Provides clear organization and comprehensive coverage',
      },
    ];
  }

  /**
   * Identify potential issues with the prompt (deep mode)
   */
  private identifyPotentialIssues(prompt: string): string[] {
    const issues: string[] = [];

    if (prompt.length < 30) {
      issues.push('Prompt may be too vague - could be interpreted in multiple ways');
    }

    if (!this.hasSuccessCriteria(prompt)) {
      issues.push('Without success criteria, it will be hard to know when the task is complete');
    }

    if (!this.hasTechnicalDetails(prompt)) {
      issues.push('Missing technical details may lead to incorrect technology choices');
    }

    if (!this.hasUserNeeds(prompt)) {
      issues.push('Without user perspective, solution may not meet actual needs');
    }

    return issues;
  }

  /**
   * Extract core requirement from prompt
   */
  private extractCoreRequirement(prompt: string): string {
    // Remove action verbs and extract the core requirement
    const cleaned = prompt.replace(/^(create|build|develop|implement|add|update|fix)\s+/i, '');
    return cleaned.split('.')[0] || cleaned.substring(0, 100);
  }
}
