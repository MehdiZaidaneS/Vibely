const { GoogleGenAI } = require('@google/genai')

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// https://ai.google.dev/gemini-api/docs/models
// "models/gemini-2.5-flash", "models/gemini-2.0-flash","models/gemini-2.5-flash-lite","models/gemini-2.5-flash-image-preview", "models/gemini-1.5-flash"

// GoogleGenerativeAI setup
const MODEL_NAME = "models/gemini-2.0-flash";

const model = async (prompt) => {
  const contents = [{ role: "user", parts: [{ text: prompt }] }];

  try {
    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: { temperature: 0.1 },
    });

    if (process.env.DEBUG_GEMINI === "true") {
      console.log("🔍 FULL Gemini SDK response object:", JSON.stringify(response, null, 2));

      if (response?.text) {
        console.log("✅ Gemini .text property:", response.text);
      } else {
        console.warn("⚠ No .text property found on Gemini response");
      }
    }

    return response; // return the full object so service can do result.text
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    throw err;
  }
};

module.exports = model;