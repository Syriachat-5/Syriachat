// إشعارات SyriaChat عند إغلاق التطبيق: رسائل ومكالمات عبر FCM
const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

async function send(uid, from, chatId, msg) {
  const s = await db.doc('tokens/' + uid).get();
  const t = s.exists ? s.data() : null;
  if (!t || !t.t) return;
  if ((t.blk || []).includes(from)) return;           // الحظر
  if (chatId && (t.mute || []).includes(chatId) && msg.data.type === 'msg') return; // الكتم
  if (chatId && (t.priv || []).includes(chatId) && msg.notification) msg.notification.body = 'رسالة جديدة';
  try { await admin.messaging().send({ token: t.t, ...msg }); }
  catch (e) {
    if (/registration-token-not-registered|invalid-argument|invalid-registration/.test(e.code || ''))
      await db.doc('tokens/' + uid).delete().catch(() => {});
  }
}
const nameOf = async (uid) => ((await db.doc('users/' + uid).get()).data() || {}).name || 'SyriaChat';
const bodyOf = (m) => m.del ? '' : m.kind === 'img' ? '📷 صورة' : m.kind === 'aud' ? '🎤 رسالة صوتية'
  : m.kind === 'doc' ? '📄 مستند' : m.kind === 'loc' ? '📍 موقع' : m.kind === 'poll' ? '📊 استطلاع'
  : m.kind === 'evt' ? '📅 مناسبة' : m.kind === 'con' ? '👤 جهة اتصال' : m.pay ? '💸 دفعة' : (m.text || '');

exports.onMessage = functions.firestore.document('chats/{id}').onUpdate(async (chg, ctx) => {
  const b = chg.before.data(), a = chg.after.data();
  const nb = (b.msgs || []).length, na = (a.msgs || []).length;
  if (na <= nb) return;
  const fresh = a.msgs.slice(nb).slice(-3);
  for (const m of fresh) {
    const sender = await nameOf(m.from);
    const title = a.type === 'group' ? (a.name || 'مجموعة') + ' · ' + sender : sender;
    for (const uid of (a.members || []).filter((u) => u !== m.from)) {
      await send(uid, m.from, ctx.params.id, {
        notification: { title, body: bodyOf(m) },
        data: { type: 'msg', chat: ctx.params.id },
        android: { priority: 'high', notification: { channelId: 'msgs', tag: ctx.params.id } },
      });
    }
  }
});

exports.onCall = functions.firestore.document('calls/{id}').onCreate(async (snap, ctx) => {
  const d = snap.data();
  if (d.status !== 'ringing' || !d.to) return;
  const name = await nameOf(d.from);
  await send(d.to, d.from, null, {
    notification: { title: '📞 ' + name, body: d.type === 'video' ? 'مكالمة فيديو واردة' : 'مكالمة صوتية واردة' },
    data: { type: 'call', call: ctx.params.id },
    android: { priority: 'high', ttl: 45000,
      notification: { channelId: 'calls', priority: 'max', visibility: 'public', defaultVibrateTimings: true, sound: 'default' } },
  });
});
