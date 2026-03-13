import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shifa-super-secret-key-2024-secure";

export async function GET(request: NextRequest) {
  try {
    const reviews = await db.review.findMany({
      where: { isAnonymous: false },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ message: "حدث خطأ" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "يرجى تسجيل الدخول للتقييم" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const body = await request.json();
    const { doctorName, specialty, rating, comment, isAnonymous } = body;

    if (!doctorName || !specialty || !rating) {
      return NextResponse.json({ message: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    const review = await db.review.create({
      data: {
        userId: decoded.id,
        doctorName,
        specialty,
        rating,
        comment,
        isAnonymous: isAnonymous || false,
      },
    });

    // Award 15 points for review
    await db.user.update({
      where: { id: decoded.id },
      data: { points: { increment: 15 } },
    });

    await db.pointsHistory.create({
      data: {
        userId: decoded.id,
        points: 15,
        reason: "review",
        description: "تقييم طبيب جديد",
      },
    });

    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ message: "حدث خطأ" }, { status: 500 });
  }
}
