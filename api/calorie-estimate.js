export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "AI calorie estimator is not configured yet. Add OPENAI_API_KEY in Vercel environment variables." });
  }

  const meal = String(req.body?.meal || "").trim().slice(0, 1000);
  if (!meal) return res.status(400).json({ error: "Missing meal text" });

  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CALORIE_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You estimate meal calories roughly for a friendly fitness challenge app. Return only JSON with keys: name (short meal label), calories (integer), note (one short caveat or macro/portion note). Be realistic, concise, and avoid medical advice."
          },
          {
            role: "user",
            content: `Estimate rough calories for this meal and amount: ${meal}`
          }
        ]
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error("OpenAI calorie estimate failed", data);
      return res.status(502).json({ error: "AI estimate failed" });
    }

    let parsed = {};
    try {
      parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    } catch {
      parsed = {};
    }

    const calories = Math.max(0, Math.round(Number(parsed.calories) || 0));
    if (!calories) return res.status(502).json({ error: "AI returned an invalid estimate" });

    return res.status(200).json({
      name: String(parsed.name || "Meal estimate").slice(0, 80),
      calories,
      note: String(parsed.note || "Rough estimate; portions and brands can change the number.").slice(0, 180)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "AI estimate failed" });
  }
}
