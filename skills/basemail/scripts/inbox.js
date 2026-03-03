#!/usr/bin/env node
/**
 * BaseMail Inbox Script
 * 
 * Usage: 
 *   node inbox.js              # List inbox
 *   node inbox.js <email_id>   # Read specific email
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
      success: details.success ?? true,
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
  // Requires a private key source (env BASEMAIL_PRIVATE_KEY or managed wallet file)
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

async function listInbox(token) {
  const res = await fetch(`${API_BASE}/api/inbox`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  const data = await res.json();

  if (data.error) {
    // Auto re-issue token if expired
    if ((data.error || '').toLowerCase().includes('expired')) {
      const ok = tryReissueToken();
      if (ok) {
        const newToken = getToken();
        return listInbox(newToken);
      }
    }

    console.error('❌ 錯誤:', data.error);
    logAudit('inbox_list', { success: false });
    process.exit(1);
  }

  console.log(`📬 收件箱 (${data.unread} 未讀 / ${data.total} 總計)`);
  console.log('═'.repeat(60));

  if (data.emails.length === 0) {
    console.log('沒有郵件。');
    return;
  }

  for (const email of data.emails) {
    const unread = email.read ? ' ' : '●';
    const date = new Date(email.created_at * 1000).toLocaleString();
    console.log(`${unread} [${email.id}]`);
    console.log(`  寄件人: ${email.from_addr}`);
    console.log(`  主旨: ${email.subject}`);
    console.log(`  時間: ${date}`);
    console.log(`  預覽: ${email.snippet?.slice(0, 80)}...`);
    console.log('');
  }
  
  logAudit('inbox_list', { success: true });
}

async function readEmail(token, emailId) {
  const res = await fetch(`${API_BASE}/api/inbox/${emailId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  const data = await res.json();

  if (data.error) {
    // Auto re-issue token if expired
    if ((data.error || '').toLowerCase().includes('expired')) {
      const ok = tryReissueToken();
      if (ok) {
        const newToken = getToken();
        return readEmail(newToken, emailId);
      }
    }

    console.error('❌ 錯誤:', data.error);
    logAudit('inbox_read', { success: false });
    process.exit(1);
  }

  console.log('📧 郵件內容');
  console.log('═'.repeat(60));
  console.log(`寄件人: ${data.from_addr}`);
  console.log(`收件人: ${data.to_addr}`);
  console.log(`主旨: ${data.subject}`);
  console.log(`時間: ${new Date(data.created_at * 1000).toLocaleString()}`);
  console.log('═'.repeat(60));
  console.log(data.body);
  
  logAudit('inbox_read', { success: true });
}

async function main() {
  const emailId = process.argv[2];
  const token = getToken();

  if (emailId) {
    await readEmail(token, emailId);
  } else {
    await listInbox(token);
  }
}

main().catch(err => {
  console.error('❌ 錯誤:', err.message);
  process.exit(1);
});
