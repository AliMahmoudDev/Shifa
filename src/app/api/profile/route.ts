import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shifa-super-secret-key-2024-secure";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const decoded = verify(token, JWT_SECRET) as { id: string; email: string };
    
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        gender: true,
        bloodType: true,
        image: true,
        points: true,
        level: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const decoded = verify(token, JWT_SECRET) as { id: string; email: string };
    const body = await request.json();

    const { name, phone, birthDate, gender, bloodType } = body;

    const user = await db.user.update({
      where: { id: decoded.id },
      data: {
        name,
        phone: phone || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender: gender || null,
        bloodType: bloodType || null,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء الحفظ" }, { status: 500 });
  }
}
