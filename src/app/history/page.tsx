"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  History, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Trash2,
  Eye,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Diagnosis {
  id: string;
  symptoms: string;
  analysis: string;
  specialty: string | null;
  severity: string | null;
  createdAt: string;
}

export default function HistoryPage() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/symptoms");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      const data = await response.json();
      setDiagnoses(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDiagnosis = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التشخيص؟")) return;
    
    try {
      await fetch(`/api/diagnosis/${id}`, { method: "DELETE" });
      setDiagnoses(diagnoses.filter(d => d.id !== id));
      setSelectedDiagnosis(null);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const getSeverityInfo = (severity: string | null) => {
    switch (severity?.toLowerCase()) {
      case "عالية":
        return { color: "bg-red-500/10 text-red-600 border-red-200", icon: AlertCircle };
      case "متوسطة":
        return { color: "bg-yellow-500/10 text-yellow-600 border-yellow-200", icon: AlertTriangle };
      case "منخفضة":
        return { color: "bg-green-500/10 text-green-600 border-green-200", icon: CheckCircle };
      default:
        return { color: "bg-gray-500/10 text-gray-600 border-gray-200", icon: CheckCircle };
    }
  };

  const parseSymptoms = (symptomsJson: string) => {
    try {
      return JSON.parse(symptomsJson);
    } catch {
      return [];
    }
  };

  const parseAnalysis = (analysisJson: string) => {
    try {
      return JSON.parse(analysisJson);
    } catch {
      return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">سجل التشخيصات</h1>
            <p className="text-muted-foreground">
              عرض جميع تحليلات الأعراض السابقة
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : diagnoses.length === 0 ? (
            <Card className="p-8 text-center">
              <Stethoscope className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">لا توجد تشخيصات</h3>
              <p className="text-muted-foreground mb-4">
                لم تقم بأي تحليل أعراض بعد
              </p>
              <Button onClick={() => router.push("/symptoms")}>
                ابدأ تحليل جديد
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {diagnoses.map((diagnosis, index) => {
                  const symptoms = parseSymptoms(diagnosis.symptoms);
                  const severityInfo = getSeverityInfo(diagnosis.severity);
                  const SeverityIcon = severityInfo.icon;

                  return (
                    <motion.div
                      key={diagnosis.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedDiagnosis(diagnosis)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={cn("gap-1", severityInfo.color)}>
                                  <SeverityIcon className="w-3 h-3" />
                                  {diagnosis.severity || "غير محدد"}
                                </Badge>
                                {diagnosis.specialty && (
                                  <Badge variant="outline">
                                    {diagnosis.specialty}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-2">
                                {symptoms.slice(0, 4).map((symptom: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {symptom}
                                  </Badge>
                                ))}
                                {symptoms.length > 4 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{symptoms.length - 4}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(diagnosis.createdAt)}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDiagnosis(diagnosis);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteDiagnosis(diagnosis.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Diagnosis Detail Modal */}
      <AnimatePresence>
        {selectedDiagnosis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDiagnosis(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>تفاصيل التشخيص</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedDiagnosis(null)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <DiagnosisDetail diagnosis={selectedDiagnosis} />
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function DiagnosisDetail({ diagnosis }: { diagnosis: Diagnosis }) {
  const analysis = JSON.parse(diagnosis.analysis || "{}");
  const symptoms = JSON.parse(diagnosis.symptoms || "[]");

  return (
    <div className="space-y-4">
      {/* Symptoms */}
      <div>
        <h4 className="font-medium mb-2">الأعراض:</h4>
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom: string, i: number) => (
            <Badge key={i} variant="secondary">{symptom}</Badge>
          ))}
        </div>
      </div>

      {/* Conditions */}
      {analysis.possibleConditions && (
        <div>
          <h4 className="font-medium mb-2">الحالات المحتملة:</h4>
          <div className="space-y-2">
            {analysis.possibleConditions.map((condition: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{condition.name}</span>
                  <Badge variant="outline">{condition.probability}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{condition.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialty */}
      {diagnosis.specialty && (
        <div>
          <h4 className="font-medium mb-2">التخصص الموصى به:</h4>
          <Badge className="bg-primary/10 text-primary">{diagnosis.specialty}</Badge>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && (
        <div>
          <h4 className="font-medium mb-2">التوصيات:</h4>
          <ul className="space-y-1">
            {analysis.recommendations.map((rec: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Date */}
      <div className="pt-4 border-t text-sm text-muted-foreground">
        <Calendar className="w-4 h-4 inline ml-1" />
        {new Date(diagnosis.createdAt).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
