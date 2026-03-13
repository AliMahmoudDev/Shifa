import { NextRequest, NextResponse } from "next/server";
import { analyzeSymptoms } from "@/lib/ai";
import { z } from "zod";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shifa-super-secret-key-2024-secure";

const symptomsSchema = z.object({
  age: z.number().min(1).max(120),
  gender: z.enum(["male", "female"]),
  symptoms: z.array(z.string()).min(1),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = symptomsSchema.parse(body);

    // Get user from token if exists
    const token = request.cookies.get("auth-token")?.value;
    let userId = null;

    if (token) {
      try {
        const decoded = verify(token, JWT_SECRET) as { id: string };
        userId = decoded.id;
      } catch {
        // Token invalid, continue without saving
      }
    }

    // Analyze symptoms with AI
    const result = await analyzeSymptoms(validatedData);

    // Save diagnosis and award points if user is logged in
    if (userId) {
      try {
        const diagnosis = await db.diagnosis.create({
          data: {
            userId,
            symptoms: JSON.stringify(validatedData.symptoms),
            analysis: JSON.stringify(result),
            recommendation: result.recommendations?.[0] || null,
            specialty: result.recommendedSpecialty || null,
            severity: result.urgency || null,
          },
        });

        // Award 10 points for diagnosis
        await db.user.update({
          where: { id: userId },
          data: {
            points: { increment: 10 },
          },
        });

        // Add to points history
        await db.pointsHistory.create({
          data: {
            userId,
            points: 10,
            reason: "diagnosis",
            description: "تحليل أعراض جديد",
          },
        });

        // Return result with diagnosis ID
        return NextResponse.json({
          ...result,
          diagnosisId: diagnosis.id,
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Still return result even if saving fails
        return NextResponse.json(result);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Symptoms analysis error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "البيانات غير صالحة", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "حدث خطأ أثناء تحليل الأعراض. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

// Get diagnosis history
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const decoded = verify(token, JWT_SECRET) as { id: string };
    const userId = decoded.id;

    const diagnoses = await db.diagnosis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(diagnoses);
  } catch {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }
}
