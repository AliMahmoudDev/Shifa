import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateAge(birthDate: Date | string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "عالية":
    case "high":
      return "text-red-500 bg-red-50";
    case "متوسطة":
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "منخفضة":
    case "low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function getSeverityBorder(severity: string): string {
  switch (severity.toLowerCase()) {
    case "عالية":
    case "high":
      return "border-red-200";
    case "متوسطة":
    case "medium":
      return "border-yellow-200";
    case "منخفضة":
    case "low":
      return "border-green-200";
    default:
      return "border-gray-200";
  }
}

// قائمة الأعراض الشائعة
export const commonSymptoms = [
  { id: "headache", name: "صداع", category: "الرأس" },
  { id: "fever", name: "حمى / ارتفاع درجة الحرارة", category: "عام" },
  { id: "cough", name: "سعال", category: "الجهاز التنفسي" },
  { id: "sore_throat", name: "ألم في الحلق", category: "الجهاز التنفسي" },
  { id: "runny_nose", name: "سيلان الأنف", category: "الجهاز التنفسي" },
  { id: "fatigue", name: "إرهاق وتعب", category: "عام" },
  { id: "nausea", name: "غثيان", category: "الجهاز الهضمي" },
  { id: "vomiting", name: "قيء", category: "الجهاز الهضمي" },
  { id: "diarrhea", name: "إسهال", category: "الجهاز الهضمي" },
  { id: "abdominal_pain", name: "ألم في البطن", category: "الجهاز الهضمي" },
  { id: "chest_pain", name: "ألم في الصدر", category: "القلب والصدر" },
  { id: "shortness_breath", name: "ضيق في التنفس", category: "الجهاز التنفسي" },
  { id: "dizziness", name: "دوخة", category: "عام" },
  { id: "joint_pain", name: "ألم في المفاصل", category: "العظام والمفاصل" },
  { id: "muscle_pain", name: "ألم في العضلات", category: "عام" },
  { id: "skin_rash", name: "طفح جلدي", category: "الجلدية" },
  { id: "itching", name: "حكة", category: "الجلدية" },
  { id: "eye_pain", name: "ألم في العين", category: "العيون" },
  { id: "ear_pain", name: "ألم في الأذن", category: "الأذن" },
  { id: "tooth_pain", name: "ألم في الأسنان", category: "الأسنان" },
  { id: "back_pain", name: "ألم في الظهر", category: "العظام والمفاصل" },
  { id: "neck_pain", name: "ألم في الرقبة", category: "العظام والمفاصل" },
  { id: "insomnia", name: "أرق / صعوبة النوم", category: "عام" },
  { id: "anxiety", name: "قلق", category: "النفسية" },
  { id: "depression", name: "اكتئاب", category: "النفسية" },
  { id: "weight_loss", name: "فقدان الوزن غير المبرر", category: "عام" },
  { id: "weight_gain", name: "زيادة الوزن غير المبررة", category: "عام" },
  { id: "loss_appetite", name: "فقدان الشهية", category: "الجهاز الهضمي" },
  { id: "constipation", name: "إمساك", category: "الجهاز الهضمي" },
  { id: "heartburn", name: "حرقة المعدة", category: "الجهاز الهضمي" },
];

// التخصصات الطبية
export const medicalSpecialties = [
  { id: "general", name: "طبيب عام" },
  { id: "internal", name: "طب داخلية" },
  { id: "pediatrics", name: "أطفال" },
  { id: "dermatology", name: "جلدية" },
  { id: "orthopedics", name: "عظام" },
  { id: "cardiology", name: "قلب وأوعية دموية" },
  { id: "neurology", name: "أعصاب" },
  { id: "psychiatry", name: "نفسية وعصبية" },
  { id: "ent", name: "أنف وأذن وحنجرة" },
  { id: "ophthalmology", name: "عيون" },
  { id: "dentistry", name: "أسنان" },
  { id: "gynecology", name: "نساء وتوليد" },
  { id: "urology", name: "مسالك بولية" },
  { id: "gastroenterology", name: "جهاز هضمي" },
  { id: "pulmonology", name: "صدر وجهاز تنفسي" },
  { id: "endocrinology", name: "غدد صماء وسكري" },
  { id: "rheumatology", name: "روماتيزم" },
  { id: "oncology", name: "أورام" },
  { id: "surgery", name: "جراحة عامة" },
  { id: "emergency", name: "طوارئ" },
];
