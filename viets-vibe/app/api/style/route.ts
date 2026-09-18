import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const modelName = "gemini-1.5-flash";
const styleSchema = {
  type: "object",
  properties: {
    "tên_trang_phục": { type: "string" },
    "nguồn_gốc": { type: "string" },
    "gợi_ý_phối": { type: "array", items: { type: "string" } },
    "cảnh_báo_văn_hóa": { type: "string" },
  },
  required: ["tên_trang_phục", "nguồn_gốc", "gợi_ý_phối", "cảnh_báo_văn_hóa"],
};

type StyleRequest = {
  occasion?: unknown;
  imageBase64?: unknown;
  mimeType?: unknown;
  imageDescription?: unknown;
};

type StyleSuggestion = {
  "tên_trang_phục": string;
  "nguồn_gốc": string;
  "gợi_ý_phối": string[];
  "cảnh_báo_văn_hóa": string;
};

function parseJsonResponse(text: string): StyleSuggestion {
  const cleanedText = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed: unknown = JSON.parse(cleanedText);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini returned an invalid object.");
  }

  const result = parsed as Record<string, unknown>;
  if (
    typeof result["tên_trang_phục"] !== "string" ||
    typeof result["nguồn_gốc"] !== "string" ||
    !Array.isArray(result["gợi_ý_phối"]) ||
    !result["gợi_ý_phối"].every((item) => typeof item === "string") ||
    typeof result["cảnh_báo_văn_hóa"] !== "string"
  ) {
    throw new Error("Gemini returned an incomplete style suggestion.");
  }

  return {
    "tên_trang_phục": result["tên_trang_phục"],
    "nguồn_gốc": result["nguồn_gốc"],
    "gợi_ý_phối": result["gợi_ý_phối"],
    "cảnh_báo_văn_hóa": result["cảnh_báo_văn_hóa"],
  };
}

export async function POST(request: Request) {
  try {
    let body: StyleRequest;
    try {
      body = (await request.json()) as StyleRequest;
    } catch {
      return NextResponse.json({ error: "Body request phải là JSON hợp lệ." }, { status: 400 });
    }

    const occasion = typeof body.occasion === "string" ? body.occasion.trim() : "";
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64.trim() : "";
    const mimeType = typeof body.mimeType === "string" ? body.mimeType : "image/jpeg";
    const imageDescription = typeof body.imageDescription === "string" ? body.imageDescription.trim() : "";

    if (!occasion) {
      return NextResponse.json({ error: "Vui lòng chọn một dịp phối đồ." }, { status: 400 });
    }

    if (!imageBase64 && !imageDescription) {
      return NextResponse.json({ error: "Vui lòng tải ảnh hoặc mô tả món đồ cần phối." }, { status: 400 });
    }

    if (imageBase64.length > 10_000_000) {
      return NextResponse.json({ error: "Ảnh quá lớn. Vui lòng chọn ảnh dưới 7 MB." }, { status: 413 });
    }

    if (imageBase64 && !mimeType.startsWith("image/")) {
      return NextResponse.json({ error: "Định dạng ảnh không được hỗ trợ." }, { status: 415 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Thiếu cấu hình GEMINI_API_KEY trên server." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Bạn là một stylist thời trang am hiểu Việt phục. Người dùng muốn phối một bộ đồ cho dịp ${occasion}. Hãy gợi ý cách phối trang phục truyền thống với phụ kiện hiện đại. Trả về đúng định dạng JSON gồm: { "tên_trang_phục": string, "nguồn_gốc": string, "gợi_ý_phối": string[], "cảnh_báo_văn_hóa": string }${imageDescription ? `\nMô tả món đồ: ${imageDescription}` : ""}`;
    const parts: Array<{
      text?: string;
      inlineData?: { mimeType: string; data: string };
    }> = [{ text: prompt }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType,
          data: imageBase64.replace(/^data:[^;]+;base64,/, ""),
        },
      });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: styleSchema,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    return NextResponse.json({ suggestion: parseJsonResponse(response.text) });
  } catch (error) {
    console.error("Style generation failed:", error);
    return NextResponse.json(
      { error: "Không thể tạo gợi ý lúc này. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
