#!/usr/bin/env node
/**
 * BaseMail Send Email Script
 * 
 * Usage: node send.js <to> <subject> <body>
 * Example: node send.js alice@basemail.ai "Hello" "How are you?"
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const API_BASE = 'https://api.basemail.ai';
const CONFIG_DIR = path.join(process.env.HOME, '.basemail');
const TOKEN_FILE = path.join(CONFIG_DIR, 'token.json');
const AUDIT_FILE = path.join(CONFIG_DIR, 'audit.log');

function logAudit(action, details = {}) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) return;
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      to: details.to ? `${details.to.split('@')[0].slice(0, 4)}...@${details.to.split('@')[1]}` : null,
      success: details.success ?? true,
      error: details.error,
    };
    fs.appendFileSync(AUDIT_FILE, JSON.stringify(entry) + '\n', { mode: 0o600 });
  } catch (e) {
    // Silently ignore audit errors
  }
}

function readTokenFile() {
  if (!fs.existsSync(TOKEN_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
}

function getToken() {
  // 1. Environment variable
  if (process.env.BASEMAIL_TOKEN) {
    return process.env.BASEMAIL_TOKEN;
  }

  // 2. Token file
  const data = readTokenFile();
  if (!data || !data.token) {
    console.error('❌ 尚未註冊或 token 檔案損壞。請先執行 register.js');
    process.exit(1);
  }

  // Check token age (warn if > 20 hours)
  if (data.saved_at) {
    const savedAt = new Date(data.saved_at);
    const now = new Date();
    const hoursSinceSaved = (now - savedAt) / 1000 / 60 / 60;

    if (hoursSinceSaved > 20) {
      console.log('⚠️ Token 可能即將過期，如遇錯誤會自動嘗試重新簽發');
    }
  }

  return data.token;
}

function tryReissueToken() {
  const tokenData = readTokenFile() || {};
  const args = [path.join(__dirname, 'register.js')];
  if (tokenData.basename) {
    args.push('--basename', tokenData.basename);
  }

  console.log('🔄 偵測到 token 失效，嘗試重新簽發（register.js）...');
  const res = spawnSync('node', args, { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error('❌ 自動重新簽發失敗（可能缺少 BASEMAIL_PRIVATE_KEY）');
    return false;
  }
  return true;
}

async function main() {
  const [to, subject, ...bodyParts] = process.argv.slice(2);
  const body = bodyParts.join(' ');

  if (!to || !subject) {
    console.log('📬 BaseMail - 發送郵件\n');
    console.log('用法: node send.js <收件人> <主旨> <內文>');
    console.log('範例: node send.js alice@basemail.ai "Hello" "How are you?"');
    process.exit(1);
  }

  const token = getToken();

  console.log('📧 發送郵件中...');
  console.log(`   收件人: ${to}`);
  console.log(`   主旨: ${subject}`);

  const res = await fetch(`${API_BASE}/api/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ to, subject, body: body || '' }),
  });

  const data = await res.json();

  if (data.success) {
    console.log('\n✅ 發送成功！');
    console.log(`   寄件人: ${data.from}`);
    console.log(`   郵件 ID: ${data.email_id}`);
    logAudit('send_email', { to, success: true });
  } else {
    // Auto re-issue token if expired
    if ((data.error || '').toLowerCase().includes('expired')) {
      const ok = tryReissueToken();
      if (ok) {
        const newToken = getToken();
        // Retry once
        const res2 = await fetch(`${API_BASE}/api/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
          },
          body: JSON.stringify({ to, subject, body: body || '' }),
        });
        const data2 = await res2.json();
        if (data2.success) {
          console.log('\n✅ 發送成功！（token 已自動更新）');
          console.log(`   寄件人: ${data2.from}`);
          console.log(`   郵件 ID: ${data2.email_id}`);
          logAudit('send_email', { to, success: true });
          return;
        }
      }
    }

    console.error('\n❌ 發送失敗:', data.error || data);
    logAudit('send_email', { to, success: false, error: data.error });
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ 錯誤:', err.message);
  process.exit(1);
});
