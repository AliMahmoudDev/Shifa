"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Stethoscope, 
  Loader2, 
  AlertTriangle, 
  Pill, 
  UserCheck, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  X,
  Microscope,
  Heart,
  Shield,
  Home,
  Activity,
  MapPin
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { commonSymptoms, medicalSpecialties } from "@/lib/utils";

interface DiagnosisResult {
  possibleConditions: Array<{
    name: string;
    probability: string;
    description: string;
    causes?: string[];
    riskFactors?: string[];
  }>;
  recommendedSpecialty: string;
  urgency: string;
  diagnosticMethods?: Array<{
    name: string;
    purpose: string;
    whatToExpect?: string;
  }>;
  treatments?: {
    medications: Array<{
      name: string;
      type: string;
      howItWorks: string;
      importantNotes: string;
    }>;
    homeRemedies: Array<{
      remedy: string;
      howToUse: string;
      effectiveness?: string;
    }>;
    lifestyleChanges?: string[];
  };
  recommendations: string[];
  warningSigns?: string[];
  preventionTips?: string[];
  disclaimer: string;
}

export default function SymptomsPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [showSymptomPicker, setShowSymptomPicker] = useState(false);
  
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    symptoms: [] as string[],
    description: "",
  });

  const [symptomSearch, setSymptomSearch] = useState("");

  const filteredSymptoms = commonSymptoms.filter(
    (s) =>
      s.name.includes(symptomSearch) &&
      !formData.symptoms.includes(s.name)
  );

  const groupedSymptoms = filteredSymptoms.reduce((acc, symptom) => {
    if (!acc[symptom.category]) {
      acc[symptom.category] = [];
    }
    acc[symptom.category].push(symptom);
    return acc;
  }, {} as Record<string, typeof commonSymptoms>);

  const addSymptom = (symptom: string) => {
    if (!formData.symptoms.includes(symptom)) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, symptom],
      });
    }
    setSymptomSearch("");
  };

  const removeSymptom = (symptom: string) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter((s) => s !== symptom),
    });
  };

  const handleSubmit = async () => {
    if (!formData.age || !formData.gender || formData.symptoms.length === 0) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(formData.age),
          gender: formData.gender,
          symptoms: formData.symptoms,
          description: formData.description || undefined,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء التحليل");
      }

      setResult(data);
      setStep(3);
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "حدث خطأ أثناء التحليل");
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "عالية":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "متوسطة":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "منخفضة":
        return "bg-green-500/10 text-green-600 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      age: "",
      gender: "",
      symptoms: [],
      description: "",
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">تحليل الأعراض</h1>
            <p className="text-muted-foreground">
              صف أعراضك واحصل على تشخيص مبدئي وتوصية بالتخصص المناسب
            </p>
          </motion.div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
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
            <div
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                step >= 3 ? "bg-primary" : "bg-muted"
              )}
            />
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات أساسية</CardTitle>
                    <CardDescription>
                      ساعدنا نعرفك أفضل لنقدم لك تشخيص أدق
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="age">العمر *</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="أدخل عمرك"
                          value={formData.age}
                          onChange={(e) =>
                            setFormData({ ...formData, age: e.target.value })
                          }
                          min={1}
                          max={120}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">الجنس *</Label>
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant={formData.gender === "male" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() =>
                              setFormData({ ...formData, gender: "male" })
                            }
                          >
                            ذكر
                          </Button>
                          <Button
                            type="button"
                            variant={formData.gender === "female" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() =>
                              setFormData({ ...formData, gender: "female" })
                            }
                          >
                            أنثى
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => setStep(2)}
                      disabled={!formData.age || !formData.gender}
                    >
                      التالي
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Symptoms */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>الأعراض</CardTitle>
                    <CardDescription>
                      اختر الأعراض التي تشعر بها
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Selected Symptoms */}
                    {formData.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.symptoms.map((symptom) => (
                          <Badge
                            key={symptom}
                            variant="secondary"
                            className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeSymptom(symptom)}
                          >
                            {symptom}
                            <X className="w-3 h-3 mr-1" />
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Symptom Search */}
                    <div className="relative">
                      <Input
                        placeholder="ابحث عن عرض أو اضغط للعرض الكل..."
                        value={symptomSearch}
                        onChange={(e) => {
                          setSymptomSearch(e.target.value);
                          setShowSymptomPicker(true);
                        }}
                        onFocus={() => setShowSymptomPicker(true)}
                      />

                      {/* Symptom Picker Dropdown */}
                      <AnimatePresence>
                        {showSymptomPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg max-h-64 overflow-y-auto"
                          >
                            {Object.entries(groupedSymptoms).map(([category, symptoms]) => (
                              <div key={category}>
                                <div className="px-3 py-2 bg-muted/50 text-sm font-medium text-muted-foreground">
                                  {category}
                                </div>
                                {symptoms.map((symptom) => (
                                  <button
                                    key={symptom.id}
                                    type="button"
                                    className="w-full px-3 py-2 text-right hover:bg-muted/50 transition-colors"
                                    onClick={() => addSymptom(symptom.name)}
                                  >
                                    {symptom.name}
                                  </button>
                                ))}
                              </div>
                            ))}
                            {filteredSymptoms.length === 0 && (
                              <div className="px-3 py-4 text-center text-muted-foreground">
                                لا توجد نتائج
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Additional Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">وصف إضافي (اختياري)</Label>
                      <Textarea
                        id="description"
                        placeholder="صف أعراضك بشكل أكبر، متى بدأت، ما الذي يزيدها أو يقللها..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        السابق
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleSubmit}
                        disabled={formData.symptoms.length === 0 || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                            جاري التحليل...
                          </>
                        ) : (
                          <>
                            تحليل الأعراض
                            <Stethoscope className="w-4 h-4 mr-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === 3 && result && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Urgency Banner */}
                <Card className={cn("border-2", getUrgencyColor(result.urgency))}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {result.urgency === "عالية" ? (
                        <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                      ) : result.urgency === "متوسطة" ? (
                        <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                      )}
                      <div>
                        <h3 className="font-semibold mb-1">
                          مستوى الأولوية: {result.urgency}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {result.urgency === "عالية"
                            ? "ينصح بزيارة الطبيب في أقرب وقت ممكن"
                            : result.urgency === "متوسطة"
                            ? "ينصح بزيارة الطبيب خلال الأيام القليلة القادمة"
                            : "يمكنك مراقبة الأعراض وزيارة الطبيب إذا استمرت"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Possible Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      الحالات المحتملة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.possibleConditions.map((condition, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-muted/50 border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-lg">{condition.name}</div>
                            <Badge variant="outline">{condition.probability}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {condition.description}
                          </p>
                          
                          {condition.causes && condition.causes.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-foreground mb-1">الأسباب المحتملة:</p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {condition.causes.map((cause, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    {cause}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {condition.riskFactors && condition.riskFactors.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-foreground mb-1">عوامل الخطر:</p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {condition.riskFactors.map((factor, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <AlertTriangle className="w-3 h-3 text-amber-500 mt-1 shrink-0" />
                                    {factor}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Diagnostic Methods */}
                {result.diagnosticMethods && result.diagnosticMethods.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Microscope className="w-5 h-5 text-primary" />
                        طرق التشخيص والفحوصات
                      </CardTitle>
                      <CardDescription>
                        الفحوصات التي قد يطلبها الطبيب للتأكد من التشخيص
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.diagnosticMethods.map((method, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20"
                          >
                            <div className="font-medium text-blue-700 dark:text-blue-400">{method.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <strong>الغرض:</strong> {method.purpose}
                            </div>
                            {method.whatToExpect && (
                              <div className="text-sm text-muted-foreground mt-1">
                                <strong>ما تتوقعه:</strong> {method.whatToExpect}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommended Specialty */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-primary" />
                      التخصص المناسب
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <span className="text-lg font-semibold">
                        {result.recommendedSpecialty}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Treatments */}
                {result.treatments && (
                  <>
                    {/* Medications */}
                    {result.treatments.medications && result.treatments.medications.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Pill className="w-5 h-5 text-primary" />
                            الأدوية الشائعة
                          </CardTitle>
                          <CardDescription>
                            ⚠️ معلومات توعوية فقط - يجب استشارة الطبيب أو الصيدلي قبل الاستخدام
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {result.treatments.medications.map((med, index) => (
                              <div
                                key={index}
                                className="p-4 rounded-lg border bg-muted/30"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{med.name}</span>
                                  <Badge variant="secondary">{med.type}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  <strong>كيف يعمل:</strong> {med.howItWorks}
                                </div>
                                <div className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-start gap-1 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
                                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                  {med.importantNotes}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Home Remedies */}
                    {result.treatments.homeRemedies && result.treatments.homeRemedies.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Home className="w-5 h-5 text-primary" />
                            العلاجات المنزلية
                          </CardTitle>
                          <CardDescription>
                            نصائح يمكنك تطبيقها في المنزل للتخفيف من الأعراض
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {result.treatments.homeRemedies.map((remedy, index) => (
                              <div
                                key={index}
                                className="p-3 rounded-lg border bg-green-50/50 dark:bg-green-950/20"
                              >
                                <div className="font-medium text-green-700 dark:text-green-400">{remedy.remedy}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  <strong>طريقة الاستخدام:</strong> {remedy.howToUse}
                                </div>
                                {remedy.effectiveness && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    <strong>الفعالية:</strong> {remedy.effectiveness}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Lifestyle Changes */}
                    {result.treatments.lifestyleChanges && result.treatments.lifestyleChanges.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            تغييرات في نمط الحياة
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {result.treatments.lifestyleChanges.map((change, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      التوصيات الفورية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Prevention Tips */}
                {result.preventionTips && result.preventionTips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        نصائح وقائية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.preventionTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Warning Signs */}
                {result.warningSigns && result.warningSigns.length > 0 && (
                  <Card className="border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        علامات خطرة - اذهب للطوارئ فوراً
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.warningSigns.map((sign, index) => (
                          <li key={index} className="flex items-start gap-2 text-red-800 dark:text-red-300">
                            <AlertCircle className="w-4 h-4 text-red-600 mt-1 shrink-0" />
                            <span>{sign}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Disclaimer */}
                <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground text-center">
                  {result.disclaimer}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={resetForm} className="flex-1">
                    تحليل جديد
                  </Button>
                  <Link href="/doctors" className="flex-1">
                    <Button className="w-full">
                      <MapPin className="w-4 h-4 ml-2" />
                      البحث عن أطباء
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      {/* Click outside to close dropdown */}
      {showSymptomPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSymptomPicker(false)}
        />
      )}
    </div>
  );
}
