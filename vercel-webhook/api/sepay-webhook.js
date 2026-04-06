const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Xác thực chữ ký nếu có secret
  const signature = req.headers['x-sepay-signature'];
  const secret = process.env.SEPAY_WEBHOOK_SECRET;
  if (secret && signature) {
    const hmac = crypto.createHmac('sha256', secret);
    const expected = hmac.update(JSON.stringify(req.body)).digest('hex');
    try {
      if (!crypto.timingSafeEqual(Buffer.from(signature,'utf8'), Buffer.from(expected,'utf8'))) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } catch(e) { return res.status(401).json({ error: 'Signature error' }); }
  }

  const body = req.body || {};

  // SePay thực tế gửi format: transferType, transferAmount, content, gateway, accountNumber
  const transferType   = body.transferType;
  const transferAmount = body.transferAmount;
  const content        = body.content || body.des || '';
  const gateway        = body.gateway || body.bank || '';
  const accountNumber  = body.accountNumber || '';
  const transactionDate = body.transactionDate || new Date().toISOString();
  const referenceCode  = body.referenceCode || body.id || 'N/A';

  console.log(`[SePay] type=${transferType} amount=${transferAmount} content=${content} bank=${gateway}`);

  // Chỉ xử lý tiền VÀO tài khoản
  if (transferType === 'in' && transferAmount > 0) {
    await notifyTelegram({ transferAmount, content, gateway, accountNumber, transactionDate, referenceCode });
  }

  return res.status(200).json({ received: true });
};

async function notifyTelegram({ transferAmount, content, gateway, accountNumber, transactionDate, referenceCode }) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
  if (!BOT_TOKEN || !CHAT_ID) return;

  const vnd = Number(transferAmount).toLocaleString('vi-VN');
  const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  // Xác định sản phẩm từ nội dung CK
  let product = 'Kỹ Sư YouTube';
  if (content.includes('DOT1')) product = 'Kỹ Sư YouTube — Trả góp đợt 1/3';
  else if (content.includes('DOT2')) product = 'Kỹ Sư YouTube — Trả góp đợt 2/3';
  else if (content.includes('DOT3')) product = 'Kỹ Sư YouTube — Trả góp đợt 3/3';

  const text =
    '💰 ĐƠN HÀNG MỚI — GODA EDU\n\n' +
    '📦 Sản phẩm: ' + product + '\n' +
    '💵 Số tiền: ' + vnd + 'đ\n' +
    '🏦 Ngân hàng: ' + gateway + ' · ' + accountNumber + '\n' +
    '📝 Nội dung CK: ' + content + '\n' +
    '🔖 Mã GD: ' + referenceCode + '\n' +
    '⏰ ' + transactionDate + '\n\n' +
    '👉 Kích hoạt khoá học cho học viên này.';

  await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text })
  }).catch(e => console.error('[Telegram]', e.message));
}
