// Cloudflare Worker: a tiny proxy between the Wardrobe AI site and the Gemini API.
// The API key lives in the Worker secret GEMINI_API_KEY, so it never appears in the site's code.
// Tried in order: if Google retires a model (404), the next one is used.
const MODELS = ["gemini-flash-latest", "gemini-3-flash", "gemini-2.5-flash", "gemini-flash-lite-latest"];
const ALLOWED = ["https://vanyaforbes.github.io"];

function cors(origin) {
  const ok = ALLOWED.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
  return {
    "Access-Control-Allow-Origin": ok ? origin : ALLOWED[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const headers = { ...cors(origin), "Content-Type": "application/json" };
    if (request.method === "OPTIONS") return new Response(null, { headers });
    if (request.method !== "POST") return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers });

    let body;
    try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
    const prompt = String(body.prompt || "").slice(0, 30000);
    const images = Array.isArray(body.images) ? body.images.slice(0, 1) : [];
    if (!prompt) return new Response(JSON.stringify({ error: "empty prompt" }), { status: 400, headers });

    const parts = [{ text: prompt }];
    for (const img of images) {
      if (img && typeof img.data === "string" && img.data.length < 1_500_000) parts.push({ inline_data: { mime_type: img.mime || "image/jpeg", data: img.data } });
    }
    let r;
    for (const model of MODELS) {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { responseMimeType: "application/json", temperature: 0.7 } }),
      });
      if (r.status !== 404) break;
    }
    if (r.status === 429) return new Response(JSON.stringify({ error: "rate_limited" }), { status: 429, headers });
    if (!r.ok) return new Response(JSON.stringify({ error: "upstream", status: r.status }), { status: 502, headers });
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "{}";
    return new Response(text, { headers });
  },
};
