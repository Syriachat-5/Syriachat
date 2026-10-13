# ملخص المحادثة مع Claude (للمتابعة على هاتف آخر)

## كيف تتابع
افتح محادثة جديدة، ارفع SyriaChat-dev.zip، واكتب:
"هذا مشروعي SyriaChat. اقرأ CONVERSATION-SUMMARY.md و SESSION-NOTES.md ونتابع من آخر طلب."

## تسلسل ما جرى
1. رفعتُ ملفات المشروع (HTML + Firebase + Capacitor + workflow) ولم ينجح بناء APK.
2. شُخّصت المشاكل: android.yml يجب أن يكون في .github/workflows، capacitor.config.json باسمه الصحيح،
   وجود package.json في الجذر، وجود admin.html و manifest.webmanifest.
3. فشل خطوة App icon: "convert: command not found" -> حُلّت بتثبيت imagemagick في android.yml.
4. نجح بناء APK وعمل التطبيق (شاشة التسجيل). الاسم + اسم المستخدم + كلمة سر 6 أحرف.
5. لوحة الإدارة: لا كلمة سر خاصة؛ الدخول بحساب عادي ثم في Firebase Console (مشروع syriachat-e10bd)
   Firestore -> users -> المستند: admin=true و verified=true.
6. طلب تعديلات (نُفذت في النسخة التجريبية): إصلاح صوت/فيديو المكالمات (TURN)، إشعارات أندرويد الأصلية،
   زر الرجوع، مشاهدو الحالة والرد عليها. (تتطلب نشر firestore.rules + رفع index.html و package.json + إعادة بناء APK)
7. آخر طلب: تغيير الواجهة بالكامل لتشبه صور مرجعية (تبويبات سفلية: الدردشات، التحديثات، المجتمعات، المكالمات،
   قائمة ثلاث نقاط، صفحة الإعدادات/الملف الشخصي، كل الأزرار تعمل ولكل زر ترتيبه المعروف).
   (بدون استخدام شعار أو اسم واتساب؛ الاسم يبقى SyriaChat)

## تعليمات الرفع العامة
- كل الملفات في جذر المستودع Syriachat-5/Syriachat (فرع main) عدا .github/workflows/android.yml.
- firestore.rules لا يُرفع إلى GitHub: يُنسخ في Firebase Console -> Firestore Database -> Rules -> Publish.
- بعد تعديل package.json/capacitor.config.json: Actions -> Build Android APK -> Run workflow -> حمّل SyriaChat-apk.
- تعديل index.html وحده يظهر في التطبيق بعد نشر Pages تلقائياً (التطبيق يحمّل الموقع من الرابط).

## تحديث: تم تنفيذ الواجهة الجديدة (انظر SESSION-NOTES.md - قسم الواجهة الجديدة)
الخطوات: ارفع index.html + package.json إلى GitHub، وانشر firestore.rules من Firebase Console، ثم أعد بناء APK.
أفكار قادمة: إشعارات FCM بعد إغلاق التطبيق، حالات بتبويب منفصل للتعليقات، قنوات بصور، إعدادات حساب إضافية.
