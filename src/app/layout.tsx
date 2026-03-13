import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/i18n/context";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "شفا - منصة التشخيص الطبي الذكي | Shifa - Smart Medical Diagnosis",
  description: "منصة طبية ذكية تساعدك في تشخيص الأعراض وتحديد التخصص المناسب باستخدام الذكاء الاصطناعي | Smart medical platform that helps you diagnose symptoms and identify the right specialty using AI",
  keywords: ["شفا", "تشخيص طبي", "ذكاء اصطناعي", "استشارة طبية", "أطباء", "صحة", "Shifa", "medical diagnosis", "AI", "health"],
  authors: [{ name: "Shifa Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "شفا - منصة التشخيص الطبي الذكي",
    description: "منصة طبية ذكية تساعدك في تشخيص الأعراض وتحديد التخصص المناسب",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          <LanguageProvider>
            {children}
            <Toaster position="top-center" richColors />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
