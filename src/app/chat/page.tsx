"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Sparkles,
  RotateCcw
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  "ما هي أعراض الإنفلونزا؟",
  "كيف أتعامل مع الصداع؟",
  "ما هي الأطعمة المفيدة للمناعة؟",
  "متى يجب زيارة الطبيب؟",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `أهلاً بك! 👋

أنا شفا، مساعدك الطبي الذكي. أقدر أساعدك في:
• الإجابة على أسئلتك الطبية العامة
• معلومات عن الأدوية واستخداماتها
• نصائح صحية وإرشادات
• توجيهك للتخصص المناسب

⚠️ تذكر: أنا للإرشاد فقط، وليس بديلاً عن استشارة الطبيب المختص.

كيف أقدر أساعدك اليوم؟`,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage]
            .filter((m) => m.id !== "welcome")
            .map((m) => ({
              role: m.role,
              content: m.content,
            })),
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(error.message || "حدث خطأ أثناء إرسال الرسالة");
      // Remove user message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `أهلاً بك! 👋

أنا شفا، مساعدك الطبي الذكي. كيف أقدر أساعدك اليوم؟

⚠️ تذكر: أنا للإرشاد فقط، وليس بديلاً عن استشارة الطبيب المختص.`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-muted/10">
      <Header />

      <main className="flex-1 pt-20 pb-4">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="flex flex-col border-border/50 dark:border-border/30 min-h-[calc(100vh-120px)]">
            <CardHeader className="border-b border-border/50 dark:border-border/30 bg-card/50 dark:bg-card/30 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">المساعد الطبي الذكي</CardTitle>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                      اسأل أي سؤال طبي واحصل على إجابة فورية
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetChat}
                  title="محادثة جديدة"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col p-0 flex-1 min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0" ref={scrollRef}>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          "flex gap-3",
                          message.role === "user" ? "flex-row-reverse" : ""
                        )}
                      >
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback
                            className={cn(
                              message.role === "assistant"
                                ? "bg-primary/90 text-primary-foreground"
                                : "bg-muted dark:bg-muted/80"
                            )}
                          >
                            {message.role === "assistant" ? (
                              <Sparkles className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4 text-foreground dark:text-foreground/90" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap",
                            message.role === "assistant"
                              ? "bg-muted/80 dark:bg-muted/40 text-foreground dark:text-foreground/90 rounded-tr-sm"
                              : "bg-primary text-primary-foreground rounded-tl-sm"
                          )}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Sparkles className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl rounded-tr-sm px-4 py-3">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Quick Questions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-4 bg-muted/20 dark:bg-muted/5 shrink-0">
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground/70 mb-2">
                    أسئلة شائعة:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage(question)}
                        className="rounded-full dark:border-border/50 dark:hover:bg-muted/30"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-border/50 dark:border-border/30 p-4 bg-card/30 dark:bg-card/20 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    ref={inputRef}
                    placeholder="اكتب سؤالك هنا..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1 dark:bg-input/30 dark:border-border/50"
                  />
                  <Button type="submit" disabled={!input.trim() || isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
