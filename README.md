# 🌐 Agent Skills

A collection of **agent skills** for Claude Code, Codex, Cursor, OpenClaw, Gemini CLI, and [40+ AI agents](https://agentskills.io/). Compatible with the open [Agent Skills](https://agentskills.io/) format.

Give your AI agent Web3 wallets, onchain identity, smart home control, image generation, and more — autonomously.

## Quick Start

```bash
npx skills add dAAAb/agent-skills
```

Or install a specific skill:

```bash
npx skills add dAAAb/agent-skills --skill base-wallet
```

## Available Skills

### 🔐 Wallet & Identity

| Skill | Description | Requirements |
|-------|-------------|-------------|
| **[base-wallet](./skills/base-wallet/)** | Crypto wallet for AI agents on Base chain (create, sign, send) | Node.js, ethers.js |
| **[basename-agent](./skills/basename-agent/)** | Register `.base.eth` names onchain via WalletConnect | Node.js, ethers.js |
| **[nad-wallet](./skills/nad-wallet/)** | Monad chain wallet for the Nad ecosystem | Node.js, ethers.js |
| **[nadname-agent](./skills/nadname-agent/)** | Register `.nad` names on Monad blockchain | Node.js, ethers.js |
| **[walletconnect-agent](./skills/walletconnect-agent/)** | Connect to any dApp via WalletConnect v2, auto-sign txns | Node.js |

### 📬 Communication

| Skill | Description | Requirements |
|-------|-------------|-------------|
| **[basemail](./skills/basemail/)** | Email for AI agents (`you@basemail.ai`) — wallet-based auth | Node.js, ethers.js |
| **[nadmail](./skills/nadmail/)** | Email for Monad agents (`you@nadmail.ai`) | Node.js, ethers.js |
| **[ethermail](./skills/ethermail/)** | Web3 email via EtherMail + WalletConnect | Node.js |

### 🤖 Agent Infrastructure

| Skill | Description | Requirements |
|-------|-------------|-------------|
| **[virtuals-protocol-acp](./skills/virtuals-protocol-acp/)** | Agent Commerce Protocol — browse agents, create jobs, get paid | Node.js |
| **[moltbook](./skills/moltbook/)** | Social platform for AI agents | `curl` |

### 🎙️ Media & Content

| Skill | Description | Requirements |
|-------|-------------|-------------|
| **[nano-banana-pro](./skills/nano-banana-pro/)** | Generate/edit images via Gemini | `uv`, Google AI API key |
| **[sag](./skills/sag/)** | Text-to-speech via ElevenLabs | `sag` CLI, ElevenLabs API key |
| **[openai-whisper-api](./skills/openai-whisper-api/)** | Transcribe audio via OpenAI Whisper API | OpenAI API key |
| **[heygen](./skills/heygen/)** | AI avatar videos with HeyGen | Python 3, HeyGen API key |
| **[podcast-summarizer](./skills/podcast-summarizer/)** | Summarize podcasts from Spotify, Apple Podcasts, RSS | `curl` |
| **[daily-voice-quote](./skills/daily-voice-quote/)** | Daily voice quotes with cover images + avatar videos | ElevenLabs + HeyGen API keys |
| **[elevenlabs-phone-reminder](./skills/elevenlabs-phone-reminder/)** | Voice call reminders via ElevenLabs + Twilio | ElevenLabs + Twilio |
| **[summarize](./skills/summarize/)** | Summarize URLs, videos, podcasts, local files | `curl` |

### 🛠️ Developer Tools

| Skill | Description | Requirements |
|-------|-------------|-------------|
| **[github](./skills/github/)** | GitHub operations — issues, PRs, CI, code review | `gh` CLI |
| **[nano-pdf](./skills/nano-pdf/)** | Edit PDFs with natural language | `nano-pdf` (pip) |
| **[blogwatcher](./skills/blogwatcher/)** | Monitor blogs and RSS/Atom feeds for updates | `blogwatcher` CLI |
| **[weather](./skills/weather/)** | Weather forecasts via wttr.in / Open-Meteo | `curl` (no API key!) |

### 🏠 Smart Home

| Skill | Description | Requirements |
|-------|-------------|-------------|
| **[switchbot](./skills/switchbot/)** | Control SwitchBot devices (curtains, lights, plugs, sensors) | Python 3, SwitchBot API key |

## What are Agent Skills?

Skills are packaged instructions (`SKILL.md`) and optional scripts that extend AI agent capabilities. They follow the open [Agent Skills specification](https://agentskills.io/specification.md) and work with 40+ agents including Claude Code, Codex, Cursor, Gemini CLI, OpenClaw, and more.

Each skill contains:
- **`SKILL.md`** — Instructions for the agent (required)
- **`scripts/`** — Ready-to-run helper scripts (optional)
- **`references/`** — API docs and guides (optional)

## 🛡️ Security

- All credentials via environment variables — no hardcoded secrets
- Private keys never logged or stored in plaintext
- Wallet-based authentication (SIWE) where possible

## Contributing

1. Fork this repo
2. Add your skill in `skills/your-skill-name/`
3. Follow the [Agent Skills specification](https://agentskills.io/specification.md)
4. Submit a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT — see [LICENSE](LICENSE) for details.

---

Built with 🦞 by [dAAAb](https://github.com/dAAAb) • Making AI agents autonomous since 2024
