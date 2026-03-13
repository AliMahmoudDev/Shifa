import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shifa-super-secret-key-2024-secure";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "يرجى تسجيل الدخول" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const body = await request.json();
    const { diagnosisId } = body;

    // Generate unique share code
    const shareCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Set expiry to 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const sharedResult = await db.sharedResult.create({
      data: {
        userId: decoded.id,
        diagnosisId,
        shareCode,
        expiresAt,
      },
    });

    // Award 5 points for sharing
    await db.user.update({
      where: { id: decoded.id },
      data: { points: { increment: 5 } },
    });

    await db.pointsHistory.create({
      data: {
        userId: decoded.id,
        points: 5,
        reason: "share",
        description: "مشاركة نتيجة تشخيص",
      },
    });

    return NextResponse.json({ 
      shareCode,
      shareUrl: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/share/${shareCode}`,
    });
  } catch {
    return NextResponse.json({ message: "حدث خطأ" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ message: "كود المشاركة مطلوب" }, { status: 400 });
    }

    const sharedResult = await db.sharedResult.findUnique({
      where: { shareCode: code },
      include: {
        diagnosis: true,
        user: {
          select: { name: true },
        },
      },
    });

    if (!sharedResult) {
      return NextResponse.json({ message: "كود المشاركة غير صالح" }, { status: 404 });
    }

    // Check if expired
    if (sharedResult.expiresAt && sharedResult.expiresAt < new Date()) {
      return NextResponse.json({ message: "انتهت صلاحية الرابط" }, { status: 410 });
    }

    // Increment views
    await db.sharedResult.update({
      where: { id: sharedResult.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(sharedResult);
  } catch {
    return NextResponse.json({ message: "حدث خطأ" }, { status: 500 });
  }
}
