// deploy.js
import { execSync } from 'child_process';
import ftp from 'basic-ftp';
import dotenv from 'dotenv';
import process from 'process';
dotenv.config();

async function deploy() {
  console.log('🚀 Bắt đầu build project...');
  // Lưu ý: Nếu dùng Windows PowerShell mà lỗi, hãy thử đổi lệnh build đơn giản hơn hoặc dùng cross-env
  execSync('npm run build', { stdio: 'inherit' });

  console.log('📡 Đang kết nối FTP...');
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: false, // Thử true nếu host hỗ trợ để bảo mật hơn
    });

    const remotePath = '/domains/fishstore.mnhwua.id.vn/public_html';

    console.log('uwu Đang upload file mới...');
    // Chú ý: Thay 'dist' bằng 'build' nếu dùng Create-React-App
    await client.uploadFromDir('build', remotePath);

    console.log('✅ Deploy thành công!');
  } catch (err) {
    console.error('❌ Lỗi deploy:', err);
  } finally {
    client.close();
  }
}

deploy();
