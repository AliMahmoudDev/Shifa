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
    const notifications = await db.notification.findMany({
      where: { userId: decoded.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(notifications);
  } catch {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Mark single notification as read
      await db.notification.update({
        where: { id, userId: decoded.id },
        data: { read: true },
      });
    } else {
      // Mark all as read
      await db.notification.updateMany({
        where: { userId: decoded.id, read: false },
        data: { read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "حدث خطأ" }, { status: 500 });
  }
}

// Create notification helper
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: object
) {
  await db.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data: data ? JSON.stringify(data) : null,
    },
  });
}
