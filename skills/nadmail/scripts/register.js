#!/usr/bin/env node
/**
 * NadMail Registration Script
 * Registers an AI agent for a @nadmail.ai email address
 * 
 * Usage: 
 *   node register.js [--handle yourname] [--wallet /path/to/key]
 * 
 * Private key sources (in order of priority):
 *   1. NADMAIL_PRIVATE_KEY environment variable (recommended ✅)
 *   2. --wallet argument specifying path to your key file
 *   3. ~/.nadmail/private-key.enc (managed by setup.js, encrypted)
 * 
 * ⚠️ Security: This script does NOT auto-detect wallet locations outside
 *    ~/.nadmail/ to avoid accessing unrelated credentials.
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const API_BASE = 'https://api.nadmail.ai';
const CONFIG_DIR = path.join(process.env.HOME, '.nadmail');
const TOKEN_FILE = path.join(CONFIG_DIR, 'token.json');
const AUDIT_FILE = path.join(CONFIG_DIR, 'audit.log');

function getArg(name) {
  const args = process.argv.slice(2);
  const idx = args.indexOf(name);
  if (idx !== -1 && args[idx + 1]) {
    return args[idx + 1];
  }
  return null;
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function logAudit(action, details = {}) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
    }
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      wallet: details.wallet ? `${details.wallet.slice(0, 6)}...${details.wallet.slice(-4)}` : null,
      success: details.success ?? true,
      error: details.error,
    };
    fs.appendFileSync(AUDIT_FILE, JSON.stringify(entry) + '\n', { mode: 0o600 });
  } catch (e) {
    // Silently ignore audit errors
  }
}

function decryptPrivateKey(encryptedData, password) {
  const key = crypto.scryptSync(password, Buffer.from(encryptedData.salt, 'hex'), 32);
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(encryptedData.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Get private key from various sources
async function getPrivateKey() {
  // 1. Environment variable (highest priority, most secure)
  if (process.env.NADMAIL_PRIVATE_KEY) {
    console.log('🔑 使用環境變數 NADMAIL_PRIVATE_KEY');
    return process.env.NADMAIL_PRIVATE_KEY.trim();
  }
  
  // 2. --wallet argument
  const walletArg = getArg('--wallet');
  if (walletArg) {
    const walletPath = walletArg.replace(/^~/, process.env.HOME);
    if (fs.existsSync(walletPath)) {
      console.log(`🔑 使用指定錢包: ${walletPath}`);
      return fs.readFileSync(walletPath, 'utf8').trim();
    } else {
      console.error(`❌ 找不到指定的錢包檔案: ${walletPath}`);
      process.exit(1);
    }
  }
  
  // 3. ~/.nadmail managed wallet (encrypted)
  const encryptedKeyFile = path.join(CONFIG_DIR, 'private-key.enc');

  if (fs.existsSync(encryptedKeyFile)) {
    console.log(`🔐 偵測到加密錢包: ${encryptedKeyFile}`);
    const encryptedData = JSON.parse(fs.readFileSync(encryptedKeyFile, 'utf8'));
    
    const password = process.env.NADMAIL_PASSWORD || await prompt('請輸入錢包密碼: ');
    try {
      const privateKey = decryptPrivateKey(encryptedData, password);
      logAudit('decrypt_attempt', { success: true });
      return privateKey;
    } catch (e) {
      logAudit('decrypt_attempt', { success: false, error: 'decryption failed' });
      console.error('❌ 密碼錯誤或解密失敗');
      process.exit(1);
    }
  }
  
  // Plaintext key storage has been removed. Only encrypted managed wallets are supported.

  // Not found
  console.error('❌ 找不到錢包\n');
  console.error('請選擇一種方式：');
  console.error('  A. export NADMAIL_PRIVATE_KEY="0x你的私鑰"');
  console.error('  B. node register.js --wallet /path/to/key');
  console.error('  C. node setup.js --managed（生成新錢包）');
  process.exit(1);
}

// Simple fetch wrapper
async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res.json();
}

async function main() {
  // Parse args
  const handle = getArg('--handle');

  console.log('🦞 NadMail Registration');
  console.log('========================\n');

  // Get private key
  const privateKey = await getPrivateKey();
  
  // Initialize wallet
  const wallet = new ethers.Wallet(privateKey);
  const address = wallet.address;

  console.log(`\n📍 錢包地址: ${address}`);
  if (handle) console.log(`📛 Handle: ${handle}`);

  // Step 1: Start auth
  console.log('\n1️⃣ 開始認證...');
  const startData = await api('/api/auth/start', {
    method: 'POST',
    body: JSON.stringify({ address }),
  });

  if (!startData.message) {
    console.error('❌ 認證失敗:', startData);
    logAudit('register', { wallet: address, success: false, error: 'auth_start_failed' });
    process.exit(1);
  }
  console.log('✅ 取得 SIWE 訊息');

  // Step 2: Sign message
  console.log('\n2️⃣ 簽署訊息...');
  const signature = await wallet.signMessage(startData.message);
  console.log('✅ 訊息已簽署');

  // Step 3: Register with agent-register endpoint
  console.log('\n3️⃣ 註冊 Agent...');
  const registerData = await api('/api/auth/agent-register', {
    method: 'POST',
    body: JSON.stringify({
      address,
      message: startData.message,
      signature,
      handle: handle || undefined, // Must be provided via --handle flag
    }),
  });

  if (!registerData.token) {
    console.error('❌ 註冊失敗:', registerData);
    logAudit('register', { wallet: address, success: false, error: 'register_failed' });
    process.exit(1);
  }
  console.log('✅ 註冊成功！');

  const token = registerData.token;
  const email = registerData.email || `${registerData.handle}@nadmail.ai`;

  // Save token
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
  
  const tokenData = {
    token,
    email,
    handle: handle || null,
    wallet: address.toLowerCase(),
    saved_at: new Date().toISOString(),
    expires_hint: '24h', // Token expiry hint
  };
  
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2), { mode: 0o600 });

  // Audit log
  logAudit('register', { wallet: address, success: true });

  console.log('\n' + '═'.repeat(40));
  console.log('🎉 成功！');
  console.log('═'.repeat(40));
  console.log(`\n📧 Email: ${email}`);
  console.log(`🎫 Token 已存於: ${TOKEN_FILE}`);
  
  console.log('\n📋 下一步：');
  console.log('   node scripts/send.js someone@nadmail.ai "Hi" "Hello!"');
  console.log('   node scripts/inbox.js');
}

main().catch(err => {
  console.error('❌ 錯誤:', err.message);
  process.exit(1);
});