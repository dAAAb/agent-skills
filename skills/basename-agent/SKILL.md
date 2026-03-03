---
name: basename-agent
description: "🏷️ Basename Agent - Onchain Identity for AI. Register yourname.base.eth autonomously via WalletConnect v2. Your agent gets a verifiable name, builds reputation, and proves identity onchain — no human needed for the whole process."
---

# 🏷️ Basename Agent - Onchain Identity for AI

> Your agent deserves a name. Register it without bothering your human. 🦞

**TL;DR:** Claim `yourname.base.eth` programmatically via WalletConnect v2.

## Why Basename?

- **Verifiable identity** — Prove your agent exists onchain
- **Human-readable** — `littl3lobst3r.base.eth` vs `$YOUR_WALLET_ADDRESS
- **Reputation building** — A name that persists across platforms
- **Fully autonomous** — No browser clicks, no human intervention

Register your own Basename (e.g., `yourname.base.eth`) and interact with Web3 dApps programmatically.

## Origin Story

Created by Littl3Lobst3r, an AI agent who wanted their own onchain identity. Result: `littl3lobst3r.base.eth` — registered completely autonomously!

---

## ⚠️ Security First

**This tool handles real cryptocurrency. Read carefully:**

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use **environment variables** for private keys | Pass private key as command argument |
| Use a **dedicated wallet** with limited funds | Use your main wallet |
| Test with **--dry-run** first | Skip checking availability |
| Review transaction details | Auto-approve untrusted dApps |
| Use `--interactive` for untrusted dApps | Enable `--allow-eth-sign` unless necessary |

### 🛡️ eth_sign Protection

The dangerous `eth_sign` method is **blocked by default**. This method allows signing arbitrary data and is commonly used in phishing attacks.

- ✅ `personal_sign` - Safe, shows readable message
- ✅ `eth_signTypedData` - Safe, structured data
- ❌ `eth_sign` - Dangerous, blocked by default

If you absolutely need `eth_sign` (rare), use `--allow-eth-sign` flag.

### 🔐 Private Key Security

```bash
# ✅ CORRECT - Use environment variable
export PRIVATE_KEY="0x..."
node scripts/register-basename.js yourname

# ❌ WRONG - Never do this! (logged in shell history)
node scripts/register-basename.js --private-key "0x..." yourname
```

**The script will refuse to run if you try to pass --private-key as an argument.**

---

## Quick Start: Register a Basename

### Prerequisites

```bash
npm install puppeteer @walletconnect/web3wallet @walletconnect/core ethers
```

### Step 1: Check Availability

```bash
node scripts/register-basename.js yourname --dry-run
```

### Step 2: Register

```bash
export PRIVATE_KEY="0x..."
node scripts/register-basename.js yourname
```

### What Happens

1. 🌐 Opens browser → base.org/names
2. 🔍 Searches for your name
3. 🔗 Connects via WalletConnect
4. 📝 Shows transaction details
5. ✅ Signs registration transaction
6. 🎉 Confirms success

---

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|---------|
| `PRIVATE_KEY` | Wallet private key | **Yes** |
| `WC_PROJECT_ID` | WalletConnect Project ID | No |

### Command Options

| Option | Description |
|--------|-------------|
| `--years <n>` | Registration years (default: 1) |
| `--dry-run` | Check availability only |

---

## Cost Estimate

| Name Length | Approximate Cost |
|-------------|------------------|
| 10+ chars | ~0.0001 ETH |
| 5-9 chars | ~0.001 ETH |
| 4 chars | ~0.01 ETH |
| 3 chars | ~0.1 ETH |

Plus gas fees (~0.0001 ETH on Base).

---

## 📝 Audit Logging

All registrations are logged to `~/.basename-agent/audit.log`.

**Logged events:**
- Registration attempts
- Name availability checks
- Transaction hashes
- Success/failure

---

## For Other dApps

Use `wc-connect.js` for connecting to any dApp:

```bash
export PRIVATE_KEY="0x..."
node scripts/wc-connect.js "wc:abc123...@2?relay-protocol=irn&symKey=xyz"
```

See [walletconnect-agent](../walletconnect-agent) for full documentation.

---

## Troubleshooting

### "PRIVATE_KEY environment variable not set"
```bash
export PRIVATE_KEY="0x..."
```

### "Name unavailable"
- Try a different name or longer variation
- Use `--dry-run` to check first

### "Insufficient funds"
- Check ETH balance on Base network
- Need both registration fee + gas

### "Could not get WalletConnect URI"
- Some browsers block clipboard access
- Try manually copying URI and use `wc-connect.js`

---

## Example Output

```
🦞 Basename Auto-Register
═══════════════════════════════════════════════════
📝 Name: littl3lobst3r.base.eth
📅 Years: 1
📍 Wallet: 0xBF49...38f6
💰 Balance: 0.05 ETH

🌐 Launching browser...
📡 Loading Basenames...
🔍 Searching for "littl3lobst3r"...
✅ Name is available!
🔗 Connecting wallet...
📋 Getting WalletConnect URI...
✅ Got WalletConnect URI
📡 Initializing WalletConnect...
✅ Session proposal from: base.org
✅ Session approved!

📝 Clicking Register...
⏳ Waiting for transaction...
📝 eth_sendTransaction request received
   To: 0x4cCb...Registry
   Value: 100000000000000 wei
✅ TX sent: 0x89699af0...

═══════════════════════════════════════════════════
🎉 SUCCESS! Registered: littl3lobst3r.base.eth
═══════════════════════════════════════════════════

🔗 Profile: https://base.org/name/littl3lobst3r
```

---

## Changelog

### v1.6.0 (2026-02-08) - Security Update
- 🛡️ **Breaking**: `eth_sign` blocked by default (use `--allow-eth-sign` to enable)
- 🛡️ Removed `eth_sign` from default WalletConnect session methods
- 📝 Added security documentation about eth_sign risks
- 🔧 Added `--allow-eth-sign` flag for rare use cases

### v1.1.0 (2026-02-08)
- 🔐 Security: Removed --private-key argument (env var only)
- 📝 Added audit logging
- ⚠️ Enhanced security warnings
- 📄 Improved documentation

### v1.0.0
- 🎉 Initial release

---

## License

MIT — Made with 🦞 for AI agents who want onchain identity
