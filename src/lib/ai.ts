// AI Service - Google Gemini API (FREE!)
// Working on Vercel with correct model name

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
// Using gemini-1.5-pro-latest - Stable and available
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  parts: GeminiPart[];
  role?: string;
}

interface GeminiRequest {
  contents: GeminiContent[];
  systemInstruction?: {
    parts: { text: string }[];
  };
  generationConfig?: {
    temperature: number;
    maxOutputTokens: number;
  };
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const request: GeminiRequest = {
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096
    }
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data: GeminiResponse = await response.json();
  
  if (!response.ok || data.error) {
    const errorMsg = data.error?.message || `HTTP ${response.status}`;
    console.error("Gemini API error:", errorMsg);
    throw new Error(`Gemini API error: ${errorMsg}`);
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function chatGemini(messages: Array<{ role: string; content: string }>): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const contents: GeminiContent[] = messages.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));

  const request: GeminiRequest = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096
    }
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data: GeminiResponse = await response.json();
  
  if (!response.ok || data.error) {
    const errorMsg = data.error?.message || `HTTP ${response.status}`;
    console.error("Gemini API error:", errorMsg);
    throw new Error(`Gemini API error: ${errorMsg}`);
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function safeJsonParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch (e) {
    const jsonMatch = str.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        return null;
      }
    }
    return null;
  }
}

function normalizeSymptomsResponse(data: any): any {
  return {
    possibleConditions: (data.possibleConditions || []).map((c: any) => ({
      name: c.name || "غير محدد",
      probability: c.probability || "غير محدد",
      description: c.description || "",
      causes: Array.isArray(c.causes) ? c.causes : [],
      riskFactors: Array.isArray(c.riskFactors) ? c.riskFactors : []
    })),
    recommendedSpecialty: data.recommendedSpecialty || "طبيب عام",
    urgency: data.urgency || "متوسطة",
    diagnosticMethods: (data.diagnosticMethods || []).map((d: any) => ({
      name: typeof d === 'string' ? d : (d.name || ""),
      purpose: typeof d === 'string' ? "" : (d.purpose || ""),
      whatToExpect: typeof d === 'string' ? "" : (d.whatToExpect || "")
    })),
    treatments: {
      medications: (data.treatments?.medications || []).map((med: any) => ({
        name: typeof med === 'string' ? med : (med.name || "دواء"),
        type: typeof med === 'string' ? "دواء" : (med.type || "دواء"),
        howItWorks: typeof med === 'string' ? "" : (med.howItWorks || ""),
        importantNotes: typeof med === 'string' ? "يجب استشارة الطبيب" : (med.importantNotes || "يجب استشارة الطبيب")
      })),
      homeRemedies: (data.treatments?.homeRemedies || []).map((remedy: any) => ({
        remedy: typeof remedy === 'string' ? remedy : (remedy.remedy || remedy.name || "علاج منزلي"),
        howToUse: typeof remedy === 'string' ? "" : (remedy.howToUse || ""),
        effectiveness: typeof remedy === 'string' ? "" : (remedy.effectiveness || "")
      })),
      lifestyleChanges: Array.isArray(data.treatments?.lifestyleChanges) ? data.treatments.lifestyleChanges : []
    },
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
    warningSigns: Array.isArray(data.warningSigns) ? data.warningSigns : [],
    preventionTips: Array.isArray(data.preventionTips) ? data.preventionTips : [],
    disclaimer: data.disclaimer || "هذا التشخيص مبدئي وللإرشاد فقط. يجب استشارة طبيب مختص للتشخيص الدقيق."
  };
}

export async function analyzeSymptoms(params: {
  age: number;
  gender: string;
  symptoms: string[];
  description?: string;
}) {
  const symptomsText = params.symptoms.join(", ");

  const systemPrompt = `أنت طبيب خبير. أجب بـ JSON فقط بالعربية بدون نص إضافي.
{
  "possibleConditions": [{"name": "اسم", "probability": "40%", "description": "وصف", "causes": [], "riskFactors": []}],
  "recommendedSpecialty": "التخصص",
  "urgency": "منخفضة/متوسطة/عالية",
  "diagnosticMethods": [{"name": "فحص", "purpose": "غرض", "whatToExpect": "توقع"}],
  "treatments": {"medications": [], "homeRemedies": [], "lifestyleChanges": []},
  "recommendations": [],
  "warningSigns": [],
  "preventionTips": [],
  "disclaimer": "للإرشاد فقط"
}`;

  const userPrompt = `مريض: ${params.age} سنة، ${params.gender}
الأعراض: ${symptomsText}
${params.description || ""}`;

  try {
    const content = await callGemini(systemPrompt, userPrompt);
    const result = safeJsonParse(content);
    
    if (!result) {
      return normalizeSymptomsResponse({
        possibleConditions: [{ name: "يتطلب فحص طبي", probability: "غير محدد", description: "يرجى استشارة طبيب" }],
        recommendedSpecialty: "طبيب عام"
      });
    }
    
    return normalizeSymptomsResponse(result);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function analyzeSkinImage(imageBase64: string) {
  try {
    const content = await callGemini("أنت طبيب جلدية. أجب بـ JSON.", "وصف حالة جلدية.");
    const result = safeJsonParse(content);
    return result || { possibleConditions: [], disclaimer: "للإرشاد فقط" };
  } catch (error) {
    throw error;
  }
}

export async function chatWithMedicalAssistant(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  userContext?: { age?: number; gender?: string }
) {
  const systemPrompt = `أنت طبيب اسمه "شفا". أجب بالعربية. في النهاية قل: "⚠️ للتوعية فقط."`;
  
  try {
    const allMessages = [
      { role: "user", content: systemPrompt },
      ...messages
    ];
    return await chatGemini(allMessages);
  } catch (error) {
    throw error;
  }
}
