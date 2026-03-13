import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shifa-super-secret-key-2024-secure";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verify(token, JWT_SECRET) as { id: string; email: string };

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        image: true,
        phone: true,
        birthDate: true,
        gender: true,
        bloodType: true,
        points: true,
        level: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null });
  }
}
