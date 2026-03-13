import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shifa-super-secret-key-2024-secure";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const favorites = await db.favoriteDoctor.findMany({
      where: { userId: decoded.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const body = await request.json();
    const { name, specialty, address, phone, notes, lat, lng } = body;

    const favorite = await db.favoriteDoctor.create({
      data: {
        userId: decoded.id,
        name,
        specialty,
        address,
        phone,
        notes,
        lat,
        lng,
      },
    });

    // Award 5 points for adding a favorite
    await db.user.update({
      where: { id: decoded.id },
      data: { points: { increment: 5 } },
    });

    await db.pointsHistory.create({
      data: {
        userId: decoded.id,
        points: 5,
        reason: "favorite",
        description: "إضافة طبيب للمفضلة",
      },
    });

    return NextResponse.json(favorite);
  } catch {
    return NextResponse.json({ message: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "معرف مطلوب" }, { status: 400 });
    }

    await db.favoriteDoctor.delete({
      where: { id, userId: decoded.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "حدث خطأ" }, { status: 500 });
  }
}
