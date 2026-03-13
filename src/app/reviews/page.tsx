"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Plus, 
  X,
  Send,
  MessageCircle,
  User
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  doctorName: string;
  specialty: string;
  rating: number;
  comment: string | null;
  isAnonymous: boolean;
  createdAt: string;
  user?: {
    name: string;
    image: string | null;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const [newReview, setNewReview] = useState({
    doctorName: "",
    specialty: "",
    rating: 5,
    comment: "",
    isAnonymous: false,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async () => {
    if (!newReview.doctorName || !newReview.specialty) {
      toast.error("يرجى إدخال اسم الطبيب والتخصص");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.ok) {
        toast.success("شكراً لتقييمك! حصلت على 15 نقطة");
        fetchReviews();
        setShowAddModal(false);
        setNewReview({ doctorName: "", specialty: "", rating: 5, comment: "", isAnonymous: false });
      }
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const specialties = [
    "طب عام", "جلدية", "أسنان", "عيون", "أطفال",
    "نساء وتوليد", "قلب وأوعية دموية", "عظام", "نفسي", "باطنة"
  ];

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
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">تقييمات الأطباء</h1>
            <p className="text-muted-foreground">
              شارك تجربتك وساعد الآخرين في اختيار الطبيب المناسب
            </p>
          </motion.div>

          {/* Add Button */}
          <div className="mb-6">
            <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 ml-2" />
              أضف تقييم جديد
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : reviews.length === 0 ? (
            <Card className="p-8 text-center">
              <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">لا توجد تقييمات</h3>
              <p className="text-muted-foreground mb-4">
                كن أول من يشارك تجربته
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 ml-2" />
                أضف تقييم
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {review.user?.image ? (
                              <img
                                src={review.user.image}
                                alt={review.user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-primary" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {review.isAnonymous ? "مستخدم" : review.user?.name || "مستخدم"}
                              </span>
                              <span className="text-muted-foreground">قيم</span>
                              <span className="font-medium text-primary">{review.doctorName}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{review.specialty}</Badge>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={cn(
                                      "w-4 h-4",
                                      star <= review.rating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-muted"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>

                            {review.comment && (
                              <p className="text-muted-foreground text-sm">
                                "{review.comment}"
                              </p>
                            )}

                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="border-b flex flex-row items-center justify-between">
                <CardTitle>تقييم طبيب</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم الطبيب *</label>
                  <Input
                    value={newReview.doctorName}
                    onChange={(e) => setNewReview({ ...newReview, doctorName: e.target.value })}
                    placeholder="د. أحمد محمد"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">التخصص *</label>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((s) => (
                      <Button
                        key={s}
                        variant={newReview.specialty === s ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewReview({ ...newReview, specialty: s })}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">التقييم *</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1"
                      >
                        <Star
                          className={cn(
                            "w-8 h-8 transition-colors",
                            star <= newReview.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted hover:text-yellow-500"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">تعليق (اختياري)</label>
                  <Input
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="شارك تجربتك..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newReview.isAnonymous}
                    onChange={(e) => setNewReview({ ...newReview, isAnonymous: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm">
                    تقييم مجهول
                  </label>
                </div>

                <Button onClick={addReview} className="w-full">
                  <Send className="w-4 h-4 ml-2" />
                  إرسال التقييم (+15 نقطة)
                </Button>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
