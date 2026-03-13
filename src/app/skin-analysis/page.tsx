"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  Upload, 
  Loader2, 
  AlertTriangle, 
  CheckCircle,
  AlertCircle,
  Camera,
  X,
  RotateCcw
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SkinAnalysisResult {
  possibleConditions: Array<{
    name: string;
    probability: string;
    description: string;
  }>;
  severity: string;
  isUrgent: boolean;
  recommendations: string[];
  whenToSeeDoctor: string;
  homeRemedies: string[];
  disclaimer: string;
}

export default function SkinAnalysisPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار صورة صالحة");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 10 ميجابايت");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) handleFileSelect(file);
          break;
        }
      }
    },
    [handleFileSelect]
  );

  // Paste listener
  if (typeof window !== "undefined") {
    window.addEventListener("paste", handlePaste);
  }

  const analyzeImage = async () => {
    if (!image) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/skin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
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
    } catch (error: any) {
      console.error("Skin analysis error:", error);
      toast.error(error.message || "حدث خطأ أثناء التحليل");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
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
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">تحليل صور الجلدية</h1>
            <p className="text-muted-foreground">
              ارفع صورة للمنطقة المصابة واحصل على تحليل ذكي لحالتك
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Upload Area */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    {!image ? (
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={cn(
                          "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
                          isDragging
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/50"
                        )}
                        onClick={() =>
                          document.getElementById("file-input")?.click()
                        }
                      >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium mb-2">
                          اسحب الصورة هنا أو انقر للرفع
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          يمكنك أيضاً لصق صورة من الحافظة (Ctrl+V)
                        </p>
                        <Button variant="outline">
                          <Camera className="w-4 h-4 ml-2" />
                          اختر صورة
                        </Button>
                        <input
                          id="file-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur-sm"
                          onClick={() => setImage(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <img
                          src={image}
                          alt="Uploaded skin condition"
                          className="max-h-96 mx-auto rounded-lg"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Important Notes */}
                <Card className="mb-6 border-amber-200 bg-amber-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 mb-2">
                          تعليمات مهمة:
                        </p>
                        <ul className="text-amber-700 space-y-1 list-disc list-inside">
                          <li>التقط الصورة في إضاءة جيدة</li>
                          <li>ركز على المنطقة المصابة فقط</li>
                          <li>تجنب الصور الضبابية أو البعيدة</li>
                          <li>هذا التحليل للإرشاد فقط وليس تشخيصاً نهائياً</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analyze Button */}
                <Button
                  className="w-full h-12"
                  onClick={analyzeImage}
                  disabled={!image || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <Image className="w-5 h-5 ml-2" />
                      تحليل الصورة
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Image Preview */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={image!}
                        alt="Analyzed skin condition"
                        className="w-full md:w-48 h-48 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getSeverityColor(result.severity)}>
                            خطورة {result.severity}
                          </Badge>
                          {result.isUrgent && (
                            <Badge variant="destructive">يتطلب زيارة عاجلة</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {result.whenToSeeDoctor}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Possible Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle>الحالات المحتملة</CardTitle>
                    <CardDescription>
                      بناءً على تحليل الصورة، هذه هي الاحتمالات
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.possibleConditions.map((condition, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <div className="font-medium">{condition.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {condition.description}
                            </div>
                          </div>
                          <Badge variant="outline">{condition.probability}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>التوصيات</CardTitle>
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

                {/* Home Remedies */}
                {result.homeRemedies && result.homeRemedies.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>علاجات منزلية</CardTitle>
                      <CardDescription>
                        يمكن تجربة هذه العلاجات المنزلية الآمنة
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.homeRemedies.map((remedy, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                            <span>{remedy}</span>
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
                  <Button variant="outline" onClick={resetAnalysis} className="flex-1">
                    <RotateCcw className="w-4 h-4 ml-2" />
                    تحليل صورة جديدة
                  </Button>
                  <Button className="flex-1">البحث عن طبيب جلدية</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
