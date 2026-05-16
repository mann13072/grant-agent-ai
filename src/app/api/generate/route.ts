import { NextRequest, NextResponse } from "next/server";
import { dummyNarrative } from "@/data/dummy-narrative";
import { calculateZIM } from "@/lib/engine/zim-calculator";

// In production this would call the Anthropic API.
// For the MVP demo, we stream the pre-written German narrative.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Always compute financials deterministically, never via LLM
    const financials = calculateZIM({
      companySize: body.companySize ?? "small",
      isEastGermany: body.isEastGermany ?? false,
      grantType: body.grantType === "ZIM_COOPERATION" ? "cooperation" : "individual",
      personnel: body.personnel ?? [],
      materialCostsPercent: body.materialCostsPercent ?? 50,
      subcontractingCosts: body.subcontractingCosts ?? 0,
    });

    // Stream the narrative (simulated SSE)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const chunks = dummyNarrative.split("\n");
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk + "\n" })}\n\n`));
          await new Promise((r) => setTimeout(r, 30));
        }
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, financials })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
