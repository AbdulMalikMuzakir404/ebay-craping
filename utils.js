require("dotenv").config();
const axios = require("axios");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function cleanDescriptionWithAI(
  rawText,
  aiProvider = "huggingface",
  model = null
) {
  if (!rawText || rawText === "-") return "-";

  const prompt = `Bersihkan dan ringkas deskripsi produk berikut agar mudah dibaca:\n\n"${rawText}"`;

  try {
    if (aiProvider === "deepseek") {
      console.log("🔵 AI: DeepSeek digunakan");
      const res = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          model: model || "deepseek-chat",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data.choices[0].message.content.trim();
    }

    if (aiProvider === "openai") {
      console.log("🟢 AI: OpenAI digunakan");
      const res = await openai.chat.completions.create({
        model: model || "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      return res.choices[0].message.content.trim();
    }

    if (aiProvider === "huggingface") {
      console.log("🟡 AI: HuggingFace digunakan");
      const hfResponse = await axios.post(
        `https://api-inference.huggingface.co/models/${
          model || "facebook/bart-large-cnn"
        }`,
        { inputs: rawText },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
        }
      );
      const summary = hfResponse.data?.[0]?.summary_text;
      return summary ? summary.trim() : rawText;
    }

    console.error("❌ AI provider tidak dikenali.");
    process.exit(1);
  } catch (err) {
    console.error(`❌ ${aiProvider} error:`, err.message);
    return rawText;
  }
}

module.exports = { cleanDescriptionWithAI };
