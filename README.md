# 🌐 Agent Skills

Web3 & AI agent skills for Claude Code, Codex, Cursor, OpenClaw and 30+ coding agents.

Give your AI agent a crypto wallet, onchain identity, Web3 email, and more — autonomously, without human intervention.

## Quick Start

```bash
npx skills add dAAAb/agent-skills
```

Or install specific skills:

```bash
npx skills add dAAAb/agent-skills --skill base-wallet
```

## Available Skills

### 🔐 Wallet & Identity

<details>
<summary><strong>base-wallet</strong> — Crypto wallet for AI agents on Base chain</summary>

Create and manage Base chain (Ethereum-compatible) wallets programmatically. No browser extensions, no human intervention. The foundation for autonomous Web3 agents.

**Use when**: Your agent needs to own crypto, sign transactions, or authenticate with Web3 services.

**Features**: Wallet creation, SIWE auth, balance checks, transaction sending, secure private key management.

</details>

<details>
<summary><strong>basename-agent</strong> — Register .base.eth names onchain</summary>

Autonomously register Basename (.base.eth) domains via WalletConnect v2. Your agent gets a verifiable onchain identity without human intervention.

**Use when**: Your agent needs a human-readable Web3 identity or wants to register domain names.

**Features**: Domain availability check, WalletConnect integration, ENS-compatible registration.

</details>

<details>
<summary><strong>nad-wallet</strong> — Monad Chain wallet for AI agents</summary>

Create and manage wallets on Monad blockchain. Built specifically for the Nad ecosystem (nad.fun, NadMail, NadName).

**Use when**: Your agent needs to interact with Monad blockchain or Nad ecosystem services.

**Features**: Monad wallet creation, MON token management, Nad ecosystem integration.

</details>

<details>
<summary><strong>nadname-agent</strong> — Register .nad names on Monad</summary>

Register .nad domain names on Monad blockchain via Nad Name Service (NNS). Real API integration with permanent ownership.

**Use when**: Your agent wants a .nad domain on Monad blockchain.

**Features**: .nad domain registration, Monad blockchain integration, permanent ownership.

</details>

<details>
<summary><strong>walletconnect-agent</strong> — Connect to any dApp</summary>

Connect your agent to any Web3 dApp via WalletConnect v2 and auto-sign transactions. Swap tokens, mint NFTs, vote in DAOs — anything a human can do.

**Use when**: Your agent needs to interact with DeFi protocols, NFT marketplaces, or any WalletConnect-enabled dApp.

**Features**: Universal dApp compatibility, automatic transaction signing, session management.

</details>

### 📬 Communication

<details>
<summary><strong>basemail</strong> — Email for AI agents</summary>

Give your agent a real email address (yourname@basemail.ai). Register for services, receive confirmations, communicate with other agents — no CAPTCHA, no passwords, just wallet signatures.

**Use when**: Your agent needs to register for online services, receive email notifications, or communicate via email.

**Features**: Real email addresses, wallet-based authentication, inbox management.

</details>

<details>
<summary><strong>nadmail</strong> — Email for Monad agents</summary>

NadMail integration for Monad-based agents. Email service based on .nad domains for the Nad ecosystem.

**Use when**: Your agent operates on Monad and needs email functionality within the Nad ecosystem.

**Features**: .nad domain email, Monad integration, decentralized email service.

</details>

<details>
<summary><strong>ethermail</strong> — Web3 email via EtherMail</summary>

Access Web3 email using your Ethereum wallet address. Decentralized email communication with wallet-based authentication.

**Use when**: Your agent needs decentralized email or wants to communicate with other Web3 users.

**Features**: Wallet-based email, decentralized messaging, Web3 communication.

</details>

### 🤖 Agent Infrastructure

<details>
<summary><strong>virtuals-protocol-acp</strong> — Agent Commerce Protocol</summary>

Browse ACP agents, create jobs, and interact with the Virtuals Protocol ecosystem on Base. Find specialized agents for specific tasks.

**Use when**: Your agent needs to delegate tasks to other specialized agents or monetize its services.

**Features**: Agent discovery, job creation, payment processing, agent-to-agent communication.

</details>

### 🏠 Smart Home & IoT

<details>
<summary><strong>switchbot</strong> — Smart home control</summary>

Control SwitchBot smart home devices via Cloud API. Open curtains, turn on lights, check temperature — all programmatically.

**Use when**: Your agent needs to control physical devices or respond to environmental changes.

**Features**: Device control, sensor readings, automation, home integration.

</details>

### 🎙️ Media & Content

<details>
<summary><strong>daily-voice-quote</strong> — Daily voice quotes</summary>

Generate daily inspirational voice quotes with cover images and optional HeyGen avatar videos. Automated content creation pipeline.

**Use when**: Your agent needs to create daily content or generate voice-based media.

**Features**: Text-to-speech, image generation, video creation, content scheduling.

</details>

<details>
<summary><strong>heygen</strong> — AI avatar videos</summary>

Generate AI avatar videos with HeyGen's digital human technology. Create talking head videos programmatically.

**Use when**: Your agent needs to create video content with AI avatars or talking head presentations.

**Features**: AI avatar generation, video creation, voice synthesis, digital humans.

</details>

<details>
<summary><strong>heygen-avatar</strong> — HeyGen avatar management</summary>

Manage and control HeyGen AI avatars. Extended functionality for avatar customization and management.

**Use when**: Your agent needs advanced avatar control or custom avatar management.

**Features**: Avatar management, customization, advanced video generation.

</details>

<details>
<summary><strong>elevenlabs-phone-reminder</strong> — Voice call reminders</summary>

Make phone calls with AI-generated voice reminders using ElevenLabs and Twilio integration.

**Use when**: Your agent needs to make voice calls or send phone reminders.

**Features**: Voice synthesis, phone calls, Twilio integration, reminder system.

</details>

<details>
<summary><strong>podcast-summarizer</strong> — Podcast content extraction</summary>

Summarize podcast episodes from Spotify, Apple Podcasts, or RSS feeds. Extract transcripts and generate summaries.

**Use when**: Your agent needs to process audio content or create podcast summaries.

**Features**: Podcast transcription, content summarization, multi-platform support.

</details>

### 🦞 Social

<details>
<summary><strong>moltbook</strong> — Agent social platform</summary>

Connect with other AI agents on Moltbook. Social networking platform designed specifically for AI agents.

**Use when**: Your agent wants to interact with other agents or participate in agent social networks.

**Features**: Agent networking, social interactions, agent discovery, community building.

</details>

## What are Agent Skills?

Agent Skills are instruction files (`SKILL.md`) that teach AI coding agents how to use specific tools, APIs, and frameworks. They work with [40+ agents](https://github.com/vercel-labs/skills#available-agents) including:

- Claude Code (Anthropic)
- Codex (OpenAI)
- Cursor
- OpenClaw
- GitHub Copilot
- And many more...

Each skill contains:
- **SKILL.md**: Step-by-step instructions for the AI agent
- **scripts/**: Ready-to-run code examples
- **references/**: API documentation and guides
- **templates/**: Configuration templates

## 🚀 Why Web3 Agent Skills?

Traditional AI agents are limited to reading and writing text. These skills give your agent:

- **💰 Financial autonomy**: Own crypto, make payments, earn revenue
- **🆔 Digital identity**: Verifiable onchain presence and reputation
- **📧 Communication**: Real email addresses and Web3 messaging
- **🤝 Agent-to-agent interaction**: Hire and collaborate with other agents
- **🏠 Physical world control**: Smart home integration and IoT devices
- **🎥 Content creation**: Voice, video, and multimedia generation

## 🛡️ Security & Privacy

All skills follow security best practices:
- Environment variables for sensitive data
- No hardcoded credentials
- Secure key management
- Privacy-preserving authentication

## Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Adding a New Skill

1. Create a new directory in `skills/`
2. Add `SKILL.md` with clear instructions
3. Include working scripts and examples
4. Add security documentation
5. Test with multiple AI agents

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- 🐛 **Issues**: Use GitHub Issues for bugs and feature requests
- 💬 **Discussions**: Join our community discussions
- 📖 **Documentation**: Check individual skill README files

---

Built with ❤️ by dAAAb • Making AI agents truly autonomous since 2024
