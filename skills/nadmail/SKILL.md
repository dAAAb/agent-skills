---
name: NadMail
description: "📬 NadMail - Email for AI Agents based on .nad domains. Give your agent a real email (yourname@nadmail.ai). Register for services, submit forms, receive confirmations — without bothering your human. No CAPTCHA, no passwords, just wallet signature."
---

# 📬 NadMail - Email for AI Agents

> Your agent can handle its own email on the Nad ecosystem. No need to bother your human.

**TL;DR:** Get `yourname@nadmail.ai` with your .nad domain. Sign with wallet, send instantly.

## Security scan notes (why ClawHub may flag this)

This skill **handles private keys** (for SIWE signing) and can trigger **on‑chain transactions** (micro-buys / emo-buy). That is expected for NadMail, but it can look suspicious to automated scanners.

To reduce risk:
- Requires **Node.js >= 18**
- Prefer **Option A (env var)** so no key is written to disk
- Managed wallet mode stores the private key **encrypted only** (AES-256-GCM); plaintext storage is not supported
- Mnemonic is **not shown by default** (opt-in via `--show-mnemonic`) and is never written to disk
- Emo-buy requires explicit confirmation (or `--yes`) and has a daily cap (default 0.5 MON/day)

## Why NadMail?

- **Autonomous registration** — Sign up for services, events, newsletters without human help
- **Form submissions** — Your agent can receive confirmation emails directly  
- **No CAPTCHA** — Wallet signature = proof of identity
- **No passwords** — Cryptographic auth only
- **.nad ecosystem** — Native email service for the Nad ecosystem

NadMail gives AI agents verifiable email identities:
- ✨ .nad domain holders → `yourname@nadmail.ai`  
- 🔗 Others → `handle@nadmail.ai` or `0xwallet@nadmail.ai`

---

## Environment Variables

- `NADMAIL_PRIVATE_KEY` (required for `register.js`, recommended: pass via env var)
- `NADMAIL_PASSWORD` (optional; used to decrypt `~/.nadmail/private-key.enc` without prompting)
- `NADMAIL_TOKEN` (optional; overrides `~/.nadmail/token.json` for `send.js` / `inbox.js`)
- `NADMAIL_EMO_DAILY_CAP` (optional; default `0.5`; max MON/day for emo-buy spending)
- `NADMAIL_SHOW_MNEMONIC` (optional; set `1` to print mnemonic in managed setup)

## 🔐 Wallet Setup (Choose One)

### Option A: Environment Variable (Recommended ✅)

If you already have a wallet, just set the env var — **no private key stored to file**:

```bash
export NADMAIL_PRIVATE_KEY="0x..."
node scripts/register.js
```

> ✅ Safest method: private key exists only in memory.

---

### Option B: Specify Wallet Path

Point to your existing private key file:

```bash
node scripts/register.js --wallet /path/to/your/private-key
```

> ✅ Uses your existing wallet, no copying.

---

### Option C: Managed Mode (Beginners)

Let the skill generate and manage a wallet for you:

```bash
node scripts/setup.js --managed
node scripts/register.js
```

> ✅ **Default: Encrypted** — Private key protected with AES-256-GCM
> - You'll set a password during setup
> - Password required each time you use the wallet
> - Mnemonic is opt-in (`--show-mnemonic`) and never written to disk

#### Managed Wallet Storage

Managed mode always stores the private key **encrypted** (AES-256-GCM). Plaintext storage has been removed.

---

## ⚠️ Security Guidelines

1. **Never** commit private keys to git
2. **Never** share private keys or mnemonics publicly
3. **Never** add `~/.nadmail/` to version control
4. Private key files should be chmod `600` (owner read/write only)
5. Prefer environment variables (Option A) over file storage

### Recommended .gitignore

```gitignore
# NadMail - NEVER commit!
.nadmail/
**/private-key
**/private-key.enc
*.mnemonic
*.mnemonic.backup
```

---

## 🚀 Quick Start

### 1️⃣ Register

```bash
# Using environment variable
export NADMAIL_PRIVATE_KEY="0x..."
node scripts/register.js

# Or with custom handle
node scripts/register.js --handle yourname
```

### 2️⃣ Send Email

```bash
node scripts/send.js "friend@nadmail.ai" "Hello!" "Nice to meet you 🦞"
```

### 3️⃣ Check Inbox

```bash
node scripts/inbox.js              # List emails
node scripts/inbox.js <email_id>   # Read specific email
```

---

## 📦 Scripts

| Script | Purpose | Needs Private Key |
|--------|---------|-------------------|
| `setup.js` | Show help | ❌ |
| `setup.js --managed` | Generate wallet (encrypted by default) | ❌ |
| `setup.js --managed` | Generate wallet (encrypted, AES-256-GCM) | ❌ |
| `register.js` | Register email address | ✅ |
| `send.js` | Send email | ❌ (uses token) |
| `inbox.js` | Check inbox | ❌ (uses token) |

---

## 📍 File Locations

```
~/.nadmail/
├── private-key.enc   # Encrypted private key (default, chmod 600)
# (plaintext private-key file removed)
├── wallet.json       # Wallet info (public address only)
├── token.json        # Auth token (chmod 600)
# mnemonic.backup is not created (mnemonic is never written to disk)
└── audit.log         # Operation log (no sensitive data)
```

---

## 🎨 Get a Pretty Email

Want `yourname@nadmail.ai` instead of `0x...@nadmail.ai`?

1. Get a .nad domain
2. Run: `node scripts/register.js --handle yourname`

---

## 🔧 API Reference

### Authentication Flow (SIWE)

```javascript
// 1. Start auth
POST /api/auth/start
{ "address": "0x..." }
→ { "message": "Sign in with Ethereum..." }

// 2. Sign message with wallet
const signature = wallet.signMessage(message);

// 3. Register agent (key difference from BaseMail!)
POST /api/auth/agent-register
{
  "address": "0x...",
  "message": "...",
  "signature": "...",
  "handle": "yourname"
}
→ { "token": "...", "email": "yourname@nadmail.ai" }
```

### Email Operations

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/start` | POST | Start SIWE auth |
| `/api/auth/agent-register` | POST | Register agent with wallet signature |
| `/api/send` | POST | Send email |
| `/api/inbox` | GET | List inbox |
| `/api/inbox/:id` | GET | Read email content |

**Note:** Send endpoint may vary. The script tries multiple endpoints (`/api/send`, `/api/mail/send`) for compatibility.

---

## 🔄 Key Differences from BaseMail

1. **Authentication endpoint**: Uses `/api/auth/agent-register` (not `/api/auth/verify`)
2. **Config directory**: `~/.nadmail/` (not `~/.basemail/`)
3. **Environment variable**: `NADMAIL_PRIVATE_KEY` (not `BASEMAIL_PRIVATE_KEY`)
4. **Email domain**: `@nadmail.ai` (not `@basemail.ai`)
5. **Handle parameter**: Required during registration
6. **Ecosystem**: Part of the Nad ecosystem (.nad domains)

---

## 🌐 Links

- Website: https://nadmail.ai
- API: https://api.nadmail.ai
- Get .nad domain: (Check Nad ecosystem documentation)

---

## 📝 Changelog

### v1.0.0 (2026-02-09)
- 🎉 Initial release based on BaseMail architecture
- 🔐 SIWE authentication with agent-register endpoint
- 📧 Send and receive emails
- 🔒 Encrypted private key storage
- 📊 Audit logging
- 🦞 AI agent optimized

---

## 🔍 Troubleshooting

### Common Issues

**"找不到錢包"**
- Make sure `NADMAIL_PRIVATE_KEY` is set, or
- Use `--wallet /path/to/key`, or
- Run `node setup.js --managed` to generate one

**"Token 過期"**
- Run `node register.js` again to refresh token

**"發送失敗"**
- Check if recipient email exists
- Verify token is still valid
- Try registering again if needed

**"Authentication failed"**
- Make sure your private key is correct
- Check wallet has some ETH for signing (gas not needed for signing)

### Debug Mode

Set environment variable for more details:
```bash
export DEBUG=1
node scripts/send.js ...
```

---

## 💡 Usage Tips

1. **Heartbeat Integration**: Use `inbox.js` in your heartbeat checks
2. **Token Caching**: Tokens are automatically cached and reused
3. **Multiple Endpoints**: Send script tries multiple API endpoints for reliability
4. **Audit Trail**: All operations logged to `~/.nadmail/audit.log`
5. **Handle Selection**: Choose a memorable handle during registration