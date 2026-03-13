"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Search, 
  Navigation, 
  Loader2,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";

export default function DoctorsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [customSearch, setCustomSearch] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
          // Try to get location name (optional)
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 60000 }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`
      );
      const data = await response.json();
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.state || "";
        const country = data.address.country || "";
        setLocationName(`${city}${city && country ? ", " : ""}${country}`);
      }
    } catch (error) {
      console.log("Could not get location name");
    }
  };

  const openGoogleMaps = (query: string) => {
    let url: string;
    const searchQuery = `${query} قريب مني`;
    
    if (userLocation) {
      url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@${userLocation.lat},${userLocation.lng},14z`;
    } else {
      url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    }
    
    window.open(url, "_blank");
  };

  const handleSearch = () => {
    const query = selectedSpecialty || customSearch || "طبيب";
    openGoogleMaps(query);
  };

  const specialties = [
    { name: "طبيب عام", icon: "🩺", color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-200" },
    { name: "طبيب أسنان", icon: "🦷", color: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-200" },
    { name: "طبيب جلدية", icon: "🧴", color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-200" },
    { name: "طبيب عيون", icon: "👁️", color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-200" },
    { name: "طبيب أطفال", icon: "👶", color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-200" },
    { name: "طبيب نساء وتوليد", icon: "🤰", color: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-200" },
    { name: "طبيب قلب", icon: "❤️", color: "bg-red-500/10 hover:bg-red-500/20 border-red-200" },
    { name: "طبيب عظام", icon: "🦴", color: "bg-gray-500/10 hover:bg-gray-500/20 border-gray-200" },
    { name: "طبيب نفسي", icon: "🧠", color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-200" },
    { name: "طبيب باطنة", icon: "🏥", color: "bg-teal-500/10 hover:bg-teal-500/20 border-teal-200" },
  ];

  const quickSearches = [
    { name: "صيدلية", icon: "💊" },
    { name: "مستشفى", icon: "🏨" },
    { name: "معمل تحاليل", icon: "🔬" },
    { name: "مركز أشعة", icon: "📡" },
    { name: "طوارئ", icon: "🚑" },
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
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">البحث عن أطباء</h1>
            <p className="text-muted-foreground">
              اختر التخصص وابحث عن أطباء حقيقيين قريبين منك
            </p>
          </motion.div>

          {/* Location Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`mb-6 ${userLocation ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : ''}`}>
              <CardContent className="pt-6">
                {isLocating ? (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span>جاري تحديد موقعك...</span>
                  </div>
                ) : userLocation ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">تم الوصول لموقعك بنجاح</span>
                    </div>
                    {locationName && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Navigation className="w-4 h-4" />
                        <span>{locationName}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="flex items-center gap-2 text-orange-600">
                      <MapPin className="w-5 h-5" />
                      <span>لم يتم تحديد الموقع</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      فعّل الموقع من إعدادات الجهاز للحصول على نتائج أدق
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="ابحث عن تخصص معين... (مثال: طبيب قلب)"
                      value={customSearch}
                      onChange={(e) => {
                        setCustomSearch(e.target.value);
                        setSelectedSpecialty("");
                      }}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full h-11 pr-10 pl-4 rounded-lg border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <Button onClick={handleSearch} size="lg" className="gap-2 h-11">
                    <ExternalLink className="w-4 h-4" />
                    بحث في Google Maps
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Specialties Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🏥</span>
              اختر التخصص
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
              {specialties.map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  className={`h-auto py-4 flex flex-col gap-2 ${selectedSpecialty === item.name ? 'ring-2 ring-primary border-primary' : ''} ${item.color}`}
                  onClick={() => {
                    setSelectedSpecialty(item.name);
                    setCustomSearch("");
                    openGoogleMaps(item.name);
                  }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs">{item.name}</span>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Quick Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>⚡</span>
              بحث سريع
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {quickSearches.map((item) => (
                <Button
                  key={item.name}
                  variant="secondary"
                  className="gap-2"
                  onClick={() => openGoogleMaps(item.name)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-center">كيف يعمل البحث؟</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-medium">1</div>
                    <div>
                      <p className="font-medium text-foreground">اختر التخصص</p>
                      <p>أو اكتب في خانة البحث</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-medium">2</div>
                    <div>
                      <p className="font-medium text-foreground">اضغط بحث</p>
                      <p>يفتح Google Maps</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-medium">3</div>
                    <div>
                      <p className="font-medium text-foreground">نتائج حقيقية</p>
                      <p>أطباء قريبين منك</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            🔒 موقعك يُستخدم محلياً فقط ولا يتم إرساله لأي جهة
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
