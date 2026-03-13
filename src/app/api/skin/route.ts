import { NextRequest, NextResponse } from "next/server";
import { analyzeSkinImage } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { message: "الصورة مطلوبة" },
        { status: 400 }
      );
    }

    const result = await analyzeSkinImage(image);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Skin analysis error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}
