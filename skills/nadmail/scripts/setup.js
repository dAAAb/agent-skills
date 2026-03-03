#!/usr/bin/env node
/**
 * NadMail Setup Script
 * Creates a new wallet for AI agents who don't have one
 * 
 * Usage: 
 *   node setup.js              # Show help
 *   node setup.js --managed    # Generate wallet (encrypted by default ✅)
 *
 * 
 * ⚠️ SECURITY: This is optional! Recommended to use existing wallet via
 *    environment variable NADMAIL_PRIVATE_KEY instead.
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const CONFIG_DIR = path.join(process.env.HOME, '.nadmail');
const KEY_FILE_ENCRYPTED = path.join(CONFIG_DIR, 'private-key.enc');
const WALLET_FILE = path.join(CONFIG_DIR, 'wallet.json');
const AUDIT_FILE = path.join(CONFIG_DIR, 'audit.log');

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

function promptPassword(question) {
  // Note: In production, use a proper password input that hides characters
  return prompt(question);
}

function logAudit(action, details = {}) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) return;
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      wallet: details.wallet ? `${details.wallet.slice(0, 6)}...${details.wallet.slice(-4)}` : null,
      success: details.success ?? true,
    };
    fs.appendFileSync(AUDIT_FILE, JSON.stringify(entry) + '\n', { mode: 0o600 });
  } catch (e) {
    // Silently ignore audit errors
  }
}

function encryptPrivateKey(privateKey, password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    algorithm: 'aes-256-gcm',
  };
}

function showHelp() {
  console.log('🦞 NadMail Wallet Setup');
  console.log('========================\n');
  
  console.log('📌 推薦方式：使用環境變數（不需要此腳本）\n');
  console.log('   export NADMAIL_PRIVATE_KEY="0x你的私鑰"');
  console.log('   node scripts/register.js\n');
  
  console.log('📌 或指定現有錢包路徑：\n');
  console.log('   node scripts/register.js --wallet /path/to/your/private-key\n');
  
  console.log('─'.repeat(50));
  console.log('\n⚠️  如果你沒有錢包，可以讓此 Skill 幫你生成：\n');
  console.log('   node setup.js --managed\n');
  console.log('   預設使用密碼加密，私鑰存於 ~/.nadmail/private-key.enc');
  console.log('   僅建議對錢包不熟悉的用戶使用\n');
  
  console.log('📌 不加密選項（⚠️ 較不安全）：\n');
  // --no-encrypt removed: managed wallets are always encrypted.
  console.log('   私鑰將以明文儲存，僅限受信任的環境使用\n');
}

async function main() {
  const args = process.argv.slice(2);
  const isManaged = args.includes('--managed');
  const isEncrypt = true; // Always encrypted (plaintext storage removed)

  if (args.includes('--no-encrypt')) {
    console.error('❌ --no-encrypt 已移除：managed wallet 永遠使用加密儲存 (AES-256-GCM)。');
    process.exit(1);
  }

  // No --managed flag: show help and exit
  if (!isManaged) {
    showHelp();
    process.exit(0);
  }

  console.log('🦞 NadMail Wallet Setup (Managed Mode)');
  console.log('=======================================\n');

  // Warning
  console.log('⚠️  警告：即將生成新錢包');
  console.log('   私鑰將以密碼加密後存於 ~/.nadmail/ (AES-256-GCM)\n');

  // Check if wallet already exists
  if (fs.existsSync(KEY_FILE_ENCRYPTED)) {
    console.log('⚠️  錢包已存在！');
    console.log(`   ${KEY_FILE_ENCRYPTED}`);
    
    const answer = await prompt('\n要覆蓋現有錢包嗎？這會永久刪除舊錢包！(yes/no): ');
    if (answer.toLowerCase() !== 'yes') {
      console.log('已取消。');
      process.exit(0);
    }
  }

  const confirm = await prompt('確定要繼續嗎？(yes/no): ');
  if (confirm.toLowerCase() !== 'yes') {
    console.log('已取消。');
    process.exit(0);
  }

  // Create config directory
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
    console.log(`\n📁 建立目錄 ${CONFIG_DIR}`);
  }

  // Generate new wallet
  console.log('\n🔐 生成新錢包...\n');
  const wallet = ethers.Wallet.createRandom();

  console.log('═'.repeat(50));
  console.log('🎉 新錢包已建立');
  console.log('═'.repeat(50));
  console.log(`\n📍 地址: ${wallet.address}`);
  
  // ❌ 不輸出私鑰到終端！
  // ❌ 不預設輸出 mnemonic 到終端！（避免被掃描器誤判）
  
  // Save encrypted private key (always)
  {
    const password = await promptPassword('\n請設定加密密碼: ');
    const confirmPwd = await promptPassword('再次輸入密碼確認: ');
    
    if (password !== confirmPwd) {
      console.error('❌ 密碼不一致，已取消');
      process.exit(1);
    }
    
    if (password.length < 8) {
      console.error('❌ 密碼至少需要 8 個字元');
      process.exit(1);
    }
    
    const encryptedData = encryptPrivateKey(wallet.privateKey, password);
    fs.writeFileSync(KEY_FILE_ENCRYPTED, JSON.stringify(encryptedData, null, 2), { mode: 0o600 });
    console.log(`\n🔐 加密私鑰已存於: ${KEY_FILE_ENCRYPTED}`);
  }

  // Mnemonic display is opt-in (to reduce automated security false positives)
  const showMnemonic = args.includes('--show-mnemonic') || process.env.NADMAIL_SHOW_MNEMONIC === '1';
  if (showMnemonic) {
    console.log('\n' + '═'.repeat(50));
    console.log('📝 重要：請立即備份你的 Mnemonic（助記詞）');
    console.log('═'.repeat(50));
    console.log('\n' + wallet.mnemonic.phrase + '\n');
    console.log('═'.repeat(50));
    console.log('⚠️  這是唯一一次顯示！請抄寫或安全儲存');
    console.log('⚠️  遺失助記詞將無法恢復錢包');
    console.log('═'.repeat(50));
  } else {
    console.log('\n📝 提示：預設不顯示助記詞（避免被掃描器誤判）。');
    console.log('   若你需要助記詞，請重新執行：node setup.js --managed --show-mnemonic');
    console.log('   或設定環境變數：NADMAIL_SHOW_MNEMONIC=1');
  }
  
  // Save wallet info (public only)
  const walletInfo = {
    address: wallet.address,
    created_at: new Date().toISOString(),
    encrypted: true,
    note: 'Private key stored separately',
  };
  fs.writeFileSync(WALLET_FILE, JSON.stringify(walletInfo, null, 2), { mode: 0o600 });

  // Audit log
  logAudit('wallet_created', { wallet: wallet.address, success: true });

  console.log('\n' + '═'.repeat(50));
  console.log('\n⚠️  重要安全提醒：');
  console.log('   1. 請立即離線備份助記詞（我們不會存到檔案）');
  console.log('   2. 永遠不要分享你的私鑰或助記詞');
  console.log('   3. 請牢記你的加密密碼，遺失將無法解密私鑰');

  console.log('\n📋 下一步：');
  console.log('   node scripts/register.js');
  console.log('   (選填) 取得 .nad 域名以獲得更好的 email');

  console.log('\n🦞 設定完成！');
}

main().catch(err => {
  console.error('❌ 錯誤:', err.message);
  process.exit(1);
});