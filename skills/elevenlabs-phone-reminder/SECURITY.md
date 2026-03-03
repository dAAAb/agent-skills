# 🔒 Security Checklist

## Before Publishing/Sharing

Run through this checklist to ensure no private data is leaked:

### ❌ Never Include:

- [ ] API Keys (ElevenLabs, Twilio, etc.)
- [ ] Auth Tokens / Secrets
- [ ] Account SIDs
- [ ] Phone numbers (yours or others)
- [ ] Email addresses
- [ ] Names / usernames
- [ ] Wallet addresses / private keys
- [ ] Passwords
- [ ] Session tokens
- [ ] Webhook URLs with tokens

### ✅ Always Use:

- [ ] Environment variables (`process.env.XXX`)
- [ ] Placeholder values (`YOUR_API_KEY_HERE`)
- [ ] `.env.example` files (not `.env`)
- [ ] Generic examples (`+1234567890`)

## Quick Grep Check

Run this to find potential leaks:

```bash
# Check for common patterns
grep -rn "sk_" .
grep -rn "AC[a-f0-9]{32}" .
grep -rn "+886" .
grep -rn "+1[0-9]{10}" .
grep -rn "@gmail" .
grep -rn "api_key.*=" .
grep -rn "token.*=" .
grep -rn "secret.*=" .
```

## .gitignore

Always include:
```
.env
*.env
.env.*
!.env.example
credentials.json
*-credentials.json
*.pem
*.key
```

## Review Process

1. Run grep checks above
2. Read through all files manually
3. Test with fresh credentials
4. Have someone else review

---

⚠️ If you find leaked credentials, rotate them immediately!
