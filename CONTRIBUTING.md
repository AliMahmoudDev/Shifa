# Contributing to Shifa

شكراً لاهتمامك بالمساهمة في مشروع شفا! 🎉

## 📋 قواعد المساهمة

### 1. الإبلاغ عن المشاكل (Issues)

عند الإبلاغ عن مشكلة، يرجى تضمين:
- وصف واضح للمشكلة
- خطوات إعادة إنتاج المشكلة
- السلوك المتوقع vs السلوك الفعلي
- لقطات شاشة (إن وجدت)
- معلومات البيئة (المتصفح، نظام التشغيل)

### 2. طلبات الميزات (Feature Requests)

- وصف واضح للميزة المطلوبة
- سبب الحاجة لهذه الميزة
- أمثلة على كيفية عملها (إن أمكن)

### 3. طلبات السحب (Pull Requests)

#### قبل البدء:
1. تأكد من وجود issue للميزة/الإصلاح
2. ناقش الاقتراح في الـ issue أولاً

#### خطوات الـ PR:
1. Fork المشروع
2. إنشاء فرع جديد:
   ```bash
   git checkout -b feature/amazing-feature
   # أو
   git checkout -b fix/bug-description
   ```
3. كتابة الكود مع اتباع المعايير
4. اختبار الكود محلياً
5. Commit مع رسالة واضحة:
   ```bash
   git commit -m "Add: وصف الميزة"
   git commit -m "Fix: وصف الإصلاح"
   git commit -m "Update: وصف التحديث"
   ```
6. Push للفرع:
   ```bash
   git push origin feature/amazing-feature
   ```
7. فتح Pull Request

### 4. معايير الكود

#### TypeScript/React
- استخدام TypeScript بصرامة
- تعريف الـ types والinterfaces
- استخدام functional components
- استخدام hooks بدلاً من class components

#### التنسيق
- استخدام Prettier للتنسيق
- مسافات بادئة: 2 spaces
- اقتباسات مفردة للـ strings
- فاصلة زائدة في الـ arrays والـ objects متعددة الأسطر

#### التسمية
- المتغيرات والدوال: camelCase
- المكونات: PascalCase
- الملفات: kebab-case للصفحات، PascalCase للمكونات
- الثوابت: UPPER_SNAKE_CASE

#### التعليقات
- التعليقات باللغة العربية
- شرح الـ functions المعقدة
- استخدام JSDoc للـ functions العامة

### 5. الهيكل

```
src/
├── app/           # صفحات Next.js
├── components/    # مكونات React
├── lib/          # مكتبات وأدوات
└── styles/       # أنماط CSS
```

### 6. الاختبارات

- إضافة اختبارات للميزات الجديدة
- التأكد من نجاح جميع الاختبارات:
  ```bash
  npm test
  npm run build
  ```

## 🚀 إعداد بيئة التطوير

```bash
# استنساخ المشروع
git clone https://github.com/your-username/shifa.git
cd shifa

# تثبيت المتطلبات
npm install

# إعداد البيئة
cp .env.example .env

# قاعدة البيانات
npx prisma db push

# تشغيل المشروع
npm run dev
```

## 📞 التواصل

للأسئلة والاستفسارات:
- افتح Discussion على GitHub
- أو راسلنا على: contact@shifa.app

---

شكراً لمساهمتك في جعل شفا أفضل! 💚
