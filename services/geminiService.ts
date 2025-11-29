import { GoogleGenAI, Type } from "@google/genai";
import { CategoryOptions } from "../types";

// Helper to sanitize JSON string if Markdown code blocks are present
const cleanJsonString = (str: string) => {
  return str.replace(/```json\n?|\n?```/g, '').trim();
};

export const suggestAttributes = async (
  productName: string, 
  options: CategoryOptions
): Promise<Partial<any>> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing for Gemini");
    return {};
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    分析產品名稱："${productName}"。
    根據以下提供的選項，建議此產品最可能的分類屬性。
    
    可用選項：
    - 品牌 (Brands): ${options.brands.join(', ')}
    - 能力 (Capacities): ${options.capacities.join(', ')}
    - 種類 (Types): ${options.types.join(', ')}
    - 管徑 (Diameters): ${options.diameters.join(', ')}
    - 環境 (Environments): ${options.environments.join(', ')}
    - 尺寸 (Sizes): ${options.sizes.join(', ')}

    請回傳一個 JSON 物件，包含以下鍵值：brand, capacity, type, diameter, environment, size。
    如果產品名稱暗示的值不在列表中，請選擇最接近的選項或留空 (null)。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brand: { type: Type.STRING },
            capacity: { type: Type.STRING },
            type: { type: Type.STRING },
            diameter: { type: Type.STRING },
            environment: { type: Type.STRING },
            size: { type: Type.STRING },
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(cleanJsonString(text));
    }
  } catch (error) {
    console.error("Gemini suggestion failed:", error);
  }
  return {};
};