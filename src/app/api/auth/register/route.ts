import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { sign } from "jsonwebtoken";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["male", "female", ""]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone || null,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
        gender: validatedData.gender || null,
      },
    });

    // Create token
    const token = sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "shifa-super-secret-key-2024-secure",
      { expiresIn: "30d" }
    );

    const response = NextResponse.json(
      { 
        message: "تم إنشاء الحساب بنجاح", 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    );

    // Set cookie - simplified for localhost
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    );
  }
}
