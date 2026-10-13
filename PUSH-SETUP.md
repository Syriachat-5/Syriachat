# تفعيل الإشعارات عند إغلاق التطبيق تماماً (FCM)

بدون هذه الخطوات: الإشعارات تعمل فقط والتطبيق مفتوح أو في الخلفية القريبة. أندرويد يوقف التطبيق المغلق، والحل الوحيد هو خادم يرسل الإشعار (Cloud Functions).

## 1) ترقية Firebase إلى خطة Blaze (الدفع حسب الاستخدام)
Cloud Functions لا تعمل على الخطة المجانية. للاستخدام الصغير التكلفة غالباً صفر، لكن تلزم بطاقة دفع.

## 2) ملف google-services.json
Firebase Console -> Project settings -> Your apps -> Add app (Android) -> اسم الحزمة نفسه الموجود في capacitor.config.json (appId) -> حمّل google-services.json
ارفعه إلى جذر المستودع، ثم في android.yml أضف خطوة بعد "npx cap add android" وقبل البناء:
```yaml
      - name: Add google-services.json
        run: cp google-services.json android/app/google-services.json
```

## 3) نشر الدالة (Functions)
Firebase Console -> Project settings -> Service accounts -> Generate new private key (ملف JSON).
GitHub -> Settings -> Secrets and variables -> Actions -> New secret باسم FIREBASE_SERVICE_ACCOUNT والصق محتوى الملف.
ثم Actions -> "Deploy Firebase Functions" -> Run workflow.
(إن ظهر خطأ صلاحيات: Google Cloud Console -> IAM -> أعطِ حساب الخدمة دور Cloud Functions Admin و Service Account User.)

## 4) القواعد والتطبيق
- انشر firestore.rules المحدثة (فيها tokens و reports).
- ارفع index.html و package.json ثم أعد بناء APK وثبّته. عند أول فتح يطلب إذن الإشعارات (وافق).
- جرّب: أغلق التطبيق من قائمة التطبيقات الأخيرة، وأرسل لك رسالة/اتصالاً من حساب آخر.
