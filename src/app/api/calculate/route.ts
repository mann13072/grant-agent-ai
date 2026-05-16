import { NextRequest, NextResponse } from "next/server";
import { calculateZIM } from "@/lib/engine/zim-calculator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = calculateZIM(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Calculation failed", details: String(error) },
      { status: 400 }
    );
  }
}
