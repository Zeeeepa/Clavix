# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Clavix team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

To report a security issue, please use one of the following methods:

### Preferred Method: GitHub Security Advisories

Report security vulnerabilities via [GitHub Security Advisories](https://github.com/Bob5k/Clavix/security/advisories/new).

This is the preferred method as it allows for private disclosure and coordinated vulnerability handling.

### Alternative Method: GitHub Issues

If you cannot use Security Advisories, you can report security issues via [GitHub Issues](https://github.com/Bob5k/Clavix/issues) with the label `security`.

**Please do not publicly disclose the vulnerability until we've had a chance to address it.**

## What to Include

When reporting a security vulnerability, please include:

- Type of vulnerability (e.g., code injection, path traversal, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Response Timeline

- **Initial Response**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Status Updates**: We will send you regular updates about our progress every 7 days
- **Fix Timeline**: We aim to release a fix within 30 days for critical vulnerabilities
- **Disclosure**: We will coordinate the public disclosure timing with you

## Security Best Practices for Users

When using Clavix:

1. **Keep Updated**: Always use the latest version of Clavix
2. **Review Configuration**: Regularly review your `.clavix/config.json` settings
3. **Session Data**: Be aware that conversation sessions are stored locally in `.clavix/sessions/`
4. **Sensitive Information**: Avoid including sensitive credentials or secrets in prompts
5. **Custom Templates**: If using custom templates, ensure they don't expose sensitive data

## Known Security Considerations

### Local File System Access

Clavix creates and manages files in the `.clavix/` directory. This directory may contain:

- Session data from conversations
- Configuration files
- Generated PRDs and outputs

**Recommendation**: Add `.clavix/sessions/` to `.gitignore` if working on public repositories to avoid accidentally committing sensitive conversation data.

### Command Injection

Clavix does not execute shell commands based on user input. However, when using custom templates:

- Templates are processed using Handlebars
- User input is not directly executed as code
- Custom templates should be reviewed before use

## Security Updates

Security updates will be released as:

- **Patch versions** for minor security fixes (e.g., 1.1.1)
- **Minor versions** for security improvements with new features (e.g., 1.2.0)
- **Major versions** for breaking changes required for security (e.g., 2.0.0)

Security advisories will be posted to:

- GitHub Security Advisories
- CHANGELOG.md
- Release notes

## Contact

For any security-related questions or concerns, please:

- Open a [GitHub Issue](https://github.com/Bob5k/Clavix/issues) with the `security` label
- Or use [GitHub Security Advisories](https://github.com/Bob5k/Clavix/security/advisories/new) for sensitive disclosures

Thank you for helping keep Clavix and its users safe!
