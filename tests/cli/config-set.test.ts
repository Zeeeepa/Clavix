/**
 * Tests for clavix config set command
 * 
 * Tests updating nested configuration properties with different data types
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import Config from '../../src/cli/commands/config';

describe('clavix config set', () => {
  const testDir = path.join(__dirname, '../fixtures/test-config');
  const clavixDir = path.join(testDir, '.clavix');
  const configPath = path.join(clavixDir, 'config.json');

  beforeEach(async () => {
    // Set up test directory with config
    await fs.remove(testDir);
    await fs.ensureDir(clavixDir);

    // Create initial config
    const initialConfig = {
      version: '1.0.0',
      agent: 'Claude Code',
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
      experimental: {},
    };

    await fs.writeJSON(configPath, initialConfig, { spaces: 2 });

    // Mock process.cwd() to return test directory
    jest.spyOn(process, 'cwd').mockReturnValue(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
    jest.restoreAllMocks();
  });

  describe('top-level properties', () => {
    it('should update string property', async () => {
      const config = new Config(['set', 'agent', 'Cursor'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.agent).toBe('Cursor');
    });

    it('should update version string', async () => {
      const config = new Config(['set', 'version', '2.0.0'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.version).toBe('2.0.0');
    });
  });

  describe('nested properties', () => {
    it('should update nested string property', async () => {
      const config = new Config(['set', 'templates.prdQuestions', 'custom'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.templates.prdQuestions).toBe('custom');
    });

    it('should update nested path property', async () => {
      const config = new Config(['set', 'outputs.path', '/custom/path'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.outputs.path).toBe('/custom/path');
    });

    it('should update deeply nested string property', async () => {
      const config = new Config(['set', 'outputs.format', 'json'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.outputs.format).toBe('json');
    });
  });

  describe('boolean properties', () => {
    it('should update boolean property to true', async () => {
      const config = new Config(['set', 'preferences.autoOpenOutputs', 'true'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.preferences.autoOpenOutputs).toBe(true);
      expect(typeof updated.preferences.autoOpenOutputs).toBe('boolean');
    });

    it('should update boolean property to false', async () => {
      const config = new Config(['set', 'preferences.verboseLogging', 'false'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.preferences.verboseLogging).toBe(false);
      expect(typeof updated.preferences.verboseLogging).toBe('boolean');
    });

    it('should update nested boolean property', async () => {
      const config = new Config(['set', 'preferences.preserveSessions', 'false'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.preferences.preserveSessions).toBe(false);
    });
  });

  describe('number properties', () => {
    it('should update with integer value', async () => {
      // Add a numeric property to initial config
      const currentConfig = await fs.readJSON(configPath);
      currentConfig.maxSessions = 10;
      await fs.writeJSON(configPath, currentConfig);

      const config = new Config(['set', 'maxSessions', '20'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.maxSessions).toBe(20);
      expect(typeof updated.maxSessions).toBe('number');
    });

    it('should update with floating point value', async () => {
      // Add a numeric property to initial config
      const currentConfig = await fs.readJSON(configPath);
      currentConfig.timeout = 30.5;
      await fs.writeJSON(configPath, currentConfig);

      const config = new Config(['set', 'timeout', '45.25'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.timeout).toBe(45.25);
      expect(typeof updated.timeout).toBe('number');
    });

    it('should update nested number property', async () => {
      // Add nested numeric property
      const currentConfig = await fs.readJSON(configPath);
      currentConfig.outputs.maxSize = 1024;
      await fs.writeJSON(configPath, currentConfig);

      const config = new Config(['set', 'outputs.maxSize', '2048'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.outputs.maxSize).toBe(2048);
    });
  });

  describe('JSON object properties', () => {
    it('should update with JSON object', async () => {
      const jsonValue = JSON.stringify({ key1: 'value1', key2: 'value2' });
      const config = new Config(['set', 'experimental.feature', jsonValue], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.experimental.feature).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should update with complex nested JSON', async () => {
      const jsonValue = JSON.stringify({ 
        enabled: true, 
        settings: { 
          level: 5,
          name: 'test' 
        } 
      });
      const config = new Config(['set', 'experimental.advanced', jsonValue], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.experimental.advanced).toEqual({
        enabled: true,
        settings: {
          level: 5,
          name: 'test',
        },
      });
    });
  });

  describe('JSON array properties', () => {
    it('should update with JSON array of strings', async () => {
      const arrayValue = JSON.stringify(['item1', 'item2', 'item3']);
      const config = new Config(['set', 'experimental.features', arrayValue], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.experimental.features).toEqual(['item1', 'item2', 'item3']);
    });

    it('should update with JSON array of numbers', async () => {
      const arrayValue = JSON.stringify([1, 2, 3, 4, 5]);
      const config = new Config(['set', 'experimental.limits', arrayValue], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.experimental.limits).toEqual([1, 2, 3, 4, 5]);
    });

    it('should update with mixed type array', async () => {
      const arrayValue = JSON.stringify(['text', 42, true, null]);
      const config = new Config(['set', 'experimental.mixed', arrayValue], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.experimental.mixed).toEqual(['text', 42, true, null]);
    });
  });

  describe('creating new nested properties', () => {
    it('should create new nested path if it does not exist', async () => {
      const config = new Config(['set', 'newSection.newProperty', 'value'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.newSection).toBeDefined();
      expect(updated.newSection.newProperty).toBe('value');
    });

    it('should create deeply nested path', async () => {
      const config = new Config(['set', 'level1.level2.level3', 'deep'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.level1.level2.level3).toBe('deep');
    });

    it('should create nested boolean in new section', async () => {
      const config = new Config(['set', 'newPreferences.enabled', 'true'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.newPreferences.enabled).toBe(true);
    });

    it('should create nested number in new section', async () => {
      const config = new Config(['set', 'limits.maxItems', '100'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.limits.maxItems).toBe(100);
    });
  });

  describe('special values', () => {
    it('should handle null value', async () => {
      const config = new Config(['set', 'experimental.nullValue', 'null'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.experimental.nullValue).toBeNull();
    });

    it('should handle empty string', async () => {
      const config = new Config(['set', 'agent', '""'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.agent).toBe('');
    });

    it('should handle string with spaces', async () => {
      const config = new Config(['set', 'agent', '"Claude Code Pro"'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.agent).toBe('Claude Code Pro');
    });

    it('should handle numeric strings that should remain strings', async () => {
      // If value is not valid JSON, it should be treated as string
      const config = new Config(['set', 'version', '1.0.0'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.version).toBe('1.0.0');
      expect(typeof updated.version).toBe('string');
    });
  });

  describe('multiple updates', () => {
    it('should preserve other properties when updating one', async () => {
      const config = new Config(['set', 'agent', 'New Agent'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      
      // Updated property
      expect(updated.agent).toBe('New Agent');
      
      // Other properties preserved
      expect(updated.version).toBe('1.0.0');
      expect(updated.templates).toBeDefined();
      expect(updated.outputs).toBeDefined();
      expect(updated.preferences).toBeDefined();
    });

    it('should preserve sibling nested properties', async () => {
      const config = new Config(['set', 'preferences.autoOpenOutputs', 'true'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      
      // Updated property
      expect(updated.preferences.autoOpenOutputs).toBe(true);
      
      // Sibling properties preserved
      expect(updated.preferences.verboseLogging).toBe(false);
      expect(updated.preferences.preserveSessions).toBe(true);
    });

    it('should allow sequential updates', async () => {
      // First update
      let config = new Config(['set', 'agent', 'Agent 1'], {} as any);
      await config.run();

      // Second update
      config = new Config(['set', 'preferences.verboseLogging', 'true'], {} as any);
      await config.run();

      // Third update
      config = new Config(['set', 'outputs.format', 'json'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      
      expect(updated.agent).toBe('Agent 1');
      expect(updated.preferences.verboseLogging).toBe(true);
      expect(updated.outputs.format).toBe('json');
    });
  });

  describe('type conversions', () => {
    it('should convert string "true" to boolean true', async () => {
      const config = new Config(['set', 'preferences.autoOpenOutputs', 'true'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.preferences.autoOpenOutputs).toBe(true);
      expect(typeof updated.preferences.autoOpenOutputs).toBe('boolean');
    });

    it('should convert string "false" to boolean false', async () => {
      const config = new Config(['set', 'preferences.autoOpenOutputs', 'false'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.preferences.autoOpenOutputs).toBe(false);
      expect(typeof updated.preferences.autoOpenOutputs).toBe('boolean');
    });

    it('should convert numeric string to number', async () => {
      const currentConfig = await fs.readJSON(configPath);
      currentConfig.maxItems = 10;
      await fs.writeJSON(configPath, currentConfig);

      const config = new Config(['set', 'maxItems', '42'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.maxItems).toBe(42);
      expect(typeof updated.maxItems).toBe('number');
    });

    it('should parse JSON arrays correctly', async () => {
      const config = new Config(['set', 'tags', '["tag1","tag2","tag3"]'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(Array.isArray(updated.tags)).toBe(true);
      expect(updated.tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should parse JSON objects correctly', async () => {
      const config = new Config(['set', 'metadata', '{"author":"test","version":2}'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(typeof updated.metadata).toBe('object');
      expect(updated.metadata).toEqual({ author: 'test', version: 2 });
    });
  });

  describe('error cases', () => {
    it('should handle invalid JSON gracefully', async () => {
      // Invalid JSON should be treated as a string
      const config = new Config(['set', 'experimental.data', '{invalid json}'], {} as any);
      await config.run();

      const updated = await fs.readJSON(configPath);
      expect(updated.experimental.data).toBe('{invalid json}');
    });

    it('should error when config file does not exist', async () => {
      await fs.remove(clavixDir);

      const config = new Config(['set', 'agent', 'test'], {} as any);
      
      await expect(config.run()).rejects.toThrow();
    });
  });
});
