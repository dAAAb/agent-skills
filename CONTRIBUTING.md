# Contributing to Agent Skills

Thank you for your interest in contributing! We welcome contributions that help make AI agents more autonomous and capable.

## How to Contribute

### Adding a New Skill

1. **Fork and clone** this repository
2. **Create a new directory** in `skills/` named after your skill
3. **Add required files**:
   - `SKILL.md` - Main instruction file for AI agents
   - `scripts/` - Working code examples
   - `references/` (optional) - API docs, guides
   - `templates/` (optional) - Config templates

### Skill Requirements

#### SKILL.md Format
```markdown
---
name: your-skill-name
description: "Brief description of what this skill does"
---

# Skill Name

Clear explanation of what this skill enables.

## Use Cases
- When to use this skill
- What problems it solves

## Setup
Step-by-step setup instructions

## Usage
Working examples and code snippets

## Security
Security considerations and best practices
```

#### Security Guidelines
- **Never include real credentials** in any files
- Use environment variables: `$YOUR_API_KEY`
- Use placeholders: `YOUR_WALLET_ADDRESS`
- Include security warnings where needed
- Test all examples before submitting

#### Code Quality
- Include working, tested scripts
- Add clear comments
- Handle errors gracefully
- Follow the language's best practices

### Testing Your Skill

Before submitting, test your skill with:
1. **Claude Code** or **Cursor** - Try the instructions
2. **Real scenarios** - Verify all examples work
3. **Security scan** - No credentials in files

### Submitting Changes

1. **Create a branch**: `git checkout -b add-your-skill`
2. **Make your changes** following the guidelines above
3. **Test thoroughly** with multiple AI agents
4. **Commit with clear messages**: `feat: add [skill-name] for [purpose]`
5. **Create a pull request** with:
   - Clear title and description
   - List of what the skill enables
   - Testing notes

## Skill Ideas We'd Love

- **DeFi protocols**: Uniswap, Aave, Compound
- **NFT platforms**: OpenSea, Foundation
- **Social platforms**: Farcaster, Lens Protocol  
- **Developer tools**: GitHub, Vercel, Railway
- **Communication**: Discord, Slack, Matrix
- **Content creation**: Midjourney, Stable Diffusion
- **Infrastructure**: AWS, Docker, Kubernetes

## Code of Conduct

- Be respectful and constructive
- Focus on helping AI agents become more capable
- Security first - never expose credentials
- Test before you ship

## Questions?

Open an issue or start a discussion. We're happy to help!

Thanks for helping build the future of autonomous AI agents! 🤖✨
