import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shifa-super-secret-key-2024-secure";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const body = await request.json();
    const { image } = body;

    // In production, you should upload to a cloud storage like S3 or Cloudinary
    // For now, we'll store the base64 image directly (not recommended for production)
    
    await db.user.update({
      where: { id: decoded.id },
      data: { image },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "حدث خطأ" }, { status: 500 });
  }
}
