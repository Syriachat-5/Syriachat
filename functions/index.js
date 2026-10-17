/* إشعار المكالمات الواردة والتطبيق مغلق (FCM) */
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.onCall = onDocumentCreated('calls/{id}', async (event) => {
  const c = event.data && event.data.data();
  if (!c || c.status !== 'ringing' || !c.to || !c.from) return;
  if (Date.now() - (c.t || 0) > 60000) return;

  const tk = await db.doc('tokens/' + c.to).get();
  const t = tk.exists ? tk.data() : null;
  if (!t || !t.t) return;
  if ((t.blk || []).includes(c.from)) return;

  const u = await db.doc('users/' + c.from).get();
  const name = (u.exists && u.data().name) || 'مكالمة';
  const video = c.type === 'video';

  try {
    await admin.messaging().send({
      token: t.t,
      data: { kind: 'call', callId: event.params.id, from: c.from, type: c.type || 'audio', name },
      notification: {
        title: '📞 ' + name,
        body: video ? 'مكالمة فيديو واردة' : 'مكالمة صوتية واردة'
      },
      android: {
        priority: 'high',
        ttl: 45000,
        notification: {
          channelId: 'calls',
          tag: 'call',
          sound: 'default',
          priority: 'max',
          visibility: 'public',
          defaultVibrateTimings: true,
          sticky: true
        }
      }
    });
  } catch (e) {
    if (e.code === 'messaging/registration-token-not-registered') {
      await db.doc('tokens/' + c.to).update({ t: admin.firestore.FieldValue.delete() }).catch(() => {});
    }
    console.error('push failed', e.code || e);
  }
});
