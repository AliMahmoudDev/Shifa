"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, Loader2, Eye, EyeOff, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const passwordRequirements = [
  { id: "length", label: "8 أحرف على الأقل", test: (p: string) => p.length >= 8 },
  { id: "number", label: "رقم واحد على الأقل", test: (p: string) => /\d/.test(p) },
  { id: "letter", label: "حرف واحد على الأقل", test: (p: string) => /[a-zA-Z]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthDate: "",
    gender: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("كلمتا المرور غير متطابقتين");
        return;
      }
      const allRequirementsMet = passwordRequirements.every((req) => req.test(formData.password));
      if (!allRequirementsMet) {
        toast.error("كلمة المرور لا تستوفي المتطلبات");
        return;
      }
      setStep(2);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إنشاء الحساب");
      }

      toast.success("تم إنشاء الحساب بنجاح! مرحباً بك في شفا");
      
      // Wait a bit for cookie to be set, then redirect and refresh
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold">شفا</span>
          </Link>
          <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
          <p className="text-muted-foreground mt-2">
            أنشئ حسابك للوصول إلى جميع الميزات
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-4">
              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-6">
                <div
                  className={cn(
                    "flex-1 h-2 rounded-full transition-colors",
                    step >= 1 ? "bg-primary" : "bg-muted"
                  )}
                />
                <div
                  className={cn(
                    "flex-1 h-2 rounded-full transition-colors",
                    step >= 2 ? "bg-primary" : "bg-muted"
                  )}
                />
              </div>

              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        disabled={isLoading}
                        className="pl-10"
                        dir="ltr"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>

                    {/* Password requirements */}
                    {formData.password && (
                      <div className="space-y-1 mt-2">
                        {passwordRequirements.map((req) => (
                          <div
                            key={req.id}
                            className={cn(
                              "flex items-center gap-2 text-xs",
                              req.test(formData.password)
                                ? "text-green-600"
                                : "text-muted-foreground"
                            )}
                          >
                            <Check className="w-3 h-3" />
                            <span>{req.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-6">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">تاريخ الميلاد (اختياري)</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">الجنس (اختياري)</Label>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={formData.gender === "male" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setFormData({ ...formData, gender: "male" })}
                      >
                        ذكر
                      </Button>
                      <Button
                        type="button"
                        variant={formData.gender === "female" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setFormData({ ...formData, gender: "female" })}
                      >
                        أنثى
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <div className="flex gap-2 w-full">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    السابق
                  </Button>
                )}
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري إنشاء الحساب...
                    </>
                  ) : step === 1 ? (
                    "التالي"
                  ) : (
                    "إنشاء الحساب"
                  )}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                لديك حساب بالفعل؟{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  تسجيل الدخول
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
