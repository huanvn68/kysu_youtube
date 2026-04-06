module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, phone, plan } = req.body || {};
  if (!name || !phone) return res.status(400).json({ error: 'Missing fields' });

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

  if (BOT_TOKEN && CHAT_ID) {
    const planLabel = plan === 'installment' ? 'Trả góp (2.956.000đ × 3)' : 'Một lần (8.868.000đ)';
    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const text =
      '🔔 KHÁCH HÀNG MỚI ĐĂNG KÝ\n\n' +
      '👤 Họ tên: ' + name + '\n' +
      '📧 Email: ' + (email || 'Không điền') + '\n' +
      '📱 SĐT: ' + phone + '\n' +
      '💳 Hình thức: ' + planLabel + '\n' +
      '⏰ ' + now + '\n\n' +
      '⏳ Đang chờ thanh toán...';

    await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    }).catch(e => console.error('[Telegram]', e.message));
  }

  return res.status(200).json({ ok: true });
};
