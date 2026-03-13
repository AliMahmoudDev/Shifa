"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MapPin, 
  Phone, 
  Trash2, 
  Plus,
  Heart,
  ExternalLink,
  X
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FavoriteDoctor {
  id: string;
  name: string;
  specialty: string;
  address: string | null;
  phone: string | null;
  notes: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    address: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async () => {
    if (!newDoctor.name || !newDoctor.specialty) {
      toast.error("يرجى إدخال اسم الطبيب والتخصص");
      return;
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoctor),
      });

      if (response.ok) {
        toast.success("تمت الإضافة للمفضلة");
        fetchFavorites();
        setShowAddModal(false);
        setNewDoctor({ name: "", specialty: "", address: "", phone: "", notes: "" });
      }
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const deleteFavorite = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    try {
      await fetch(`/api/favorites?id=${id}`, { method: "DELETE" });
      setFavorites(favorites.filter(f => f.id !== id));
      toast.success("تم الحذف");
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const openMaps = (doctor: FavoriteDoctor) => {
    if (doctor.lat && doctor.lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${doctor.lat},${doctor.lng}`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(doctor.name + " " + doctor.address || "")}`, "_blank");
    }
  };

  const callDoctor = (phone: string) => {
    window.location.href = `tel:${phone}`;
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
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">الأطباء المفضلون</h1>
            <p className="text-muted-foreground">
              احفظ أطباءك المفضلين للوصول السريع
            </p>
          </motion.div>

          {/* Add Button */}
          <div className="mb-6">
            <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 ml-2" />
              إضافة طبيب للمفضلة
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : favorites.length === 0 ? (
            <Card className="p-8 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">لا يوجد أطباء مفضلون</h3>
              <p className="text-muted-foreground mb-4">
                أضف أطباءك المفضلين للوصول السريع إليهم
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة طبيب
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {favorites.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <h3 className="font-semibold">{doctor.name}</h3>
                            </div>
                            <Badge variant="secondary" className="mb-2">
                              {doctor.specialty}
                            </Badge>
                            
                            {doctor.address && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <MapPin className="w-4 h-4" />
                                <span>{doctor.address}</span>
                              </div>
                            )}
                            
                            {doctor.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span dir="ltr">{doctor.phone}</span>
                              </div>
                            )}

                            {doctor.notes && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                {doctor.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openMaps(doctor)}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            {doctor.phone && (
                              <Button
                                size="sm"
                                onClick={() => callDoctor(doctor.phone)}
                              >
                                <Phone className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => deleteFavorite(doctor.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
                <CardTitle>إضافة طبيب للمفضلة</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم الطبيب *</label>
                  <Input
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    placeholder="د. أحمد محمد"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">التخصص *</label>
                  <Input
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                    placeholder="طبيب عام"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">العنوان</label>
                  <Input
                    value={newDoctor.address}
                    onChange={(e) => setNewDoctor({ ...newDoctor, address: e.target.value })}
                    placeholder="شارع التحرير، وسط البلد"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم الهاتف</label>
                  <Input
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ملاحظات</label>
                  <Input
                    value={newDoctor.notes}
                    onChange={(e) => setNewDoctor({ ...newDoctor, notes: e.target.value })}
                    placeholder="مواعيد العمل، تفضيلات..."
                  />
                </div>

                <Button onClick={addFavorite} className="w-full">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة
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
