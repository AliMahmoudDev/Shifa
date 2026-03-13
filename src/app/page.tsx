"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Stethoscope, 
  Image, 
  MessageCircle, 
  MapPin, 
  Shield, 
  Clock, 
  Sparkles,
  ChevronLeft,
  Activity,
  Brain,
  Users
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";

// Features data
const features = [
  {
    icon: Stethoscope,
    title: "تحليل الأعراض",
    description: "صف أعراضك واحصل على تشخيص مبدئي وتوصية بالتخصص المناسب",
    href: "/symptoms",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Image,
    title: "تحليل الجلدية",
    description: "ارفع صورة للمنطقة المصابة واحصل على تحليل ذكي لحالتك",
    href: "/skin-analysis",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: MessageCircle,
    title: "المساعد الذكي",
    description: "تحدث مع مساعد طبي ذكي واحصل على إجابات فورية لأسئلتك",
    href: "/chat",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: MapPin,
    title: "البحث عن أطباء",
    description: "ابحث عن الأطباء القريبين منك حسب التخصص والموقع",
    href: "/doctors",
    color: "bg-orange-500/10 text-orange-600",
  },
];

// Stats data
const stats = [
  { value: "+50,000", label: "تشخيص شهرياً" },
  { value: "98%", label: "نسبة الرضا" },
  { value: "+500", label: "طبيب متاح" },
  { value: "24/7", label: "متاح دائماً" },
];

// Benefits data
const benefits = [
  {
    icon: Shield,
    title: "خصوصية تامة",
    description: "بياناتك الطبية مشفرة ومحمية بأعلى معايير الأمان",
  },
  {
    icon: Clock,
    title: "توفير الوقت",
    description: "احصل على توجيه فوري دون انتظار المواعيد",
  },
  {
    icon: Sparkles,
    title: "ذكاء اصطناعي متقدم",
    description: "تقنيات AI حديثة لتشخيص دقيق وموثوق",
  },
];

// Testimonials
const testimonials = [
  {
    name: "أحمد محمد",
    role: "مستخدم",
    content: "ساعدني شفا في معرفة أن الألم اللي كنت حس بيه محتاج طبيب عظام، وفعلاً طلع عندي انزلاق غضروفي وعالجته بدري.",
    avatar: "أ",
  },
  {
    name: "سارة أحمد",
    role: "أم لطفلين",
    content: "كل ما أطفالي ييجيلهم أي أعراض، بستخدم شفا الأول وأعرف هل الموضوع خطير ولا لأ.",
    avatar: "س",
  },
  {
    name: "د. محمود علي",
    role: "طبيب عام",
    content: "كطبيب، شفا بيساعد المرضى يفهموا حالتهم بشكل أفضل قبل ما يجلوا الاستشارة.",
    avatar: "م",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 gradient-hero -z-10" />
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent/10 dark:bg-accent/5 blur-3xl" />
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>مدعوم بالذكاء الاصطناعي</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground"
              >
                تشخيص طبي ذكي
                <br />
                <span className="text-primary">في ثوانٍ معدودة</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                صف أعراضك أو ارفع صورة واحصل على تشخيص مبدئي وتوجيه 
                للتخصص المناسب باستخدام أحدث تقنيات الذكاء الاصطناعي
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/symptoms">
                  <Button size="lg" className="rounded-xl px-8 h-12 text-base">
                    <Stethoscope className="w-5 h-5 ml-2" />
                    ابدأ التحليل الآن
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button size="lg" variant="outline" className="rounded-xl px-8 h-12 text-base">
                    <MessageCircle className="w-5 h-5 ml-2" />
                    تحدث مع المساعد
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-border bg-muted/20 dark:bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24" id="features">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                كيف يمكننا مساعدتك؟
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                نقدم لك مجموعة من الأدوات الذكية لتساعدك في رحلتك الصحية
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={feature.href}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 group cursor-pointer">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 md:py-24 bg-muted/20 dark:bg-muted/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                كيف يعمل شفا؟
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ثلاث خطوات بسيطة للحصول على تشخيص مبدئي
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "١",
                  title: "صف أعراضك",
                  description: "اختر من قائمة الأعراض أو اكتب وصفاً لحالتك",
                  icon: Activity,
                },
                {
                  step: "٢",
                  title: "التحليل الذكي",
                  description: "يقوم الذكاء الاصطناعي بتحليل أعراضك بدقة",
                  icon: Brain,
                },
                {
                  step: "٣",
                  title: "احصل على النتيجة",
                  description: "تشخيص مبدئي وتوصية بالتخصص المناسب",
                  icon: Users,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-0 w-1/2 h-[2px] bg-border">
                      <ChevronLeft className="absolute -left-1 -top-[7px] w-4 h-4 text-border" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  لماذا تثق في شفا؟
                </h2>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={benefit.title} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Heart className="w-24 h-24 text-primary mx-auto mb-4" />
                    <p className="text-xl font-semibold">صحتك أولويتنا</p>
                    <p className="text-muted-foreground mt-2">
                      نعمل على تقديم أفضل تجربة صحية رقمية
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-muted/20 dark:bg-muted/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ماذا يقول مستخدمونا؟
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground mb-4">
                        &quot;{testimonial.content}&quot;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center bg-primary dark:bg-primary/90 rounded-3xl p-8 md:p-12 text-primary-foreground"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                جاهز تبدأ رحلتك الصحية؟
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                احصل على تشخيص مبدئي الآن واكتشف التخصص المناسب لحالتك
              </p>
              <Link href="/symptoms">
                <Button size="lg" variant="secondary" className="rounded-xl px-8 h-12">
                  <Stethoscope className="w-5 h-5 ml-2" />
                  ابدأ التحليل مجاناً
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm text-muted-foreground">
                ⚠️ <strong>تنبيه مهم:</strong> هذا التطبيق للإرشاد والتوعية فقط وليس بديلاً عن الاستشارة الطبية المتخصصة. 
                في حالات الطوارئ، يرجى الاتصال بخدمات الطوارئ أو التوجه لأقرب مستشفى فوراً.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
