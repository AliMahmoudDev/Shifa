import { NextRequest, NextResponse } from "next/server";
import { chatWithMedicalAssistant } from "@/lib/ai";
import { z } from "zod";

const messageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
  context: z
    .object({
      age: z.number().optional(),
      gender: z.string().optional(),
      medicalHistory: z.array(z.string()).optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = messageSchema.parse(body);

    const response = await chatWithMedicalAssistant(
      validatedData.messages,
      validatedData.context
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "البيانات غير صالحة" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "حدث خطأ أثناء معالجة الرسالة" },
      { status: 500 }
    );
  }
}
