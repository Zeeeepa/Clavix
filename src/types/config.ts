/**
 * Configuration types for Clavix
 */

export interface ClavixConfig {
  version: string;
  providers: string[];
  templates: TemplateConfig;
  outputs: OutputConfig;
  preferences: PreferencesConfig;
  experimental?: Record<string, unknown>;
}

/**
 * Legacy config format from v1.3.0 and earlier
 */
export interface LegacyConfig {
  version: string;
  agent: string;
  templates: TemplateConfig;
  outputs: OutputConfig;
  preferences: PreferencesConfig;
  experimental?: Record<string, unknown>;
}

export interface TemplateConfig {
  prdQuestions: string;
  fullPrd: string;
  quickPrd: string;
}

export interface OutputConfig {
  path: string;
  format: 'markdown' | 'pdf';
}

export interface PreferencesConfig {
  autoOpenOutputs: boolean;
  verboseLogging: boolean;
  preserveSessions: boolean;
}

export const DEFAULT_CONFIG: ClavixConfig = {
  version: '1.4.0',
  providers: [],
  templates: {
    prdQuestions: 'default',
    fullPrd: 'default',
    quickPrd: 'default',
  },
  outputs: {
    path: '.clavix/outputs',
    format: 'markdown',
  },
  preferences: {
    autoOpenOutputs: false,
    verboseLogging: false,
    preserveSessions: true,
  },
};

/**
 * Migrate legacy config (v1.3.0 and earlier) to new format
 */
export function migrateConfig(legacy: LegacyConfig): ClavixConfig {
  return {
    version: '1.4.0',
    providers: [legacy.agent],
    templates: legacy.templates,
    outputs: legacy.outputs,
    preferences: legacy.preferences,
    experimental: legacy.experimental,
  };
}

/**
 * Check if config is legacy format
 */
export function isLegacyConfig(config: unknown): config is LegacyConfig {
  return (
    config !== null &&
    config !== undefined &&
    typeof config === 'object' &&
    'agent' in config &&
    typeof (config as { agent: unknown }).agent === 'string' &&
    !('providers' in config)
  );
}
