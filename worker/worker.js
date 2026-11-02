// Cloudflare Worker: a tiny proxy between the Wardrobe AI site and the Gemini API.
// The API key lives in the Worker secret GEMINI_API_KEY, so it never appears in the site's code.
// Tried in order: if a model is retired (404), overloaded or too slow, the next one is used (v3).
const MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
const PER_TRY_MS = 20000;   // give up on a slow model after 20 s
const TOTAL_MS = 80000;     // stay under Cloudflare's ~100 s limit
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
    const started = Date.now();
    const call = async (model, fast) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), PER_TRY_MS);
      const generationConfig = { responseMimeType: "application/json", temperature: 0.7, maxOutputTokens: 2048 };
      if (fast) generationConfig.thinkingConfig = { thinkingBudget: 0 }; // no long "thinking": answer quickly
      try {
        return await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST", signal: ctrl.signal,
          headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
          body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig }),
        });
      } catch (e) {
        return new Response(null, { status: 504 }); // timed out or network error
      } finally { clearTimeout(timer); }
    };
    let r = new Response(null, { status: 503 });
    for (const model of MODELS) {
      if (Date.now() - started > TOTAL_MS - PER_TRY_MS) break;
      r = await call(model, true);
      if (r.status === 400) r = await call(model, false); // model doesn't accept the thinking setting
      if (r.ok || r.status === 401 || r.status === 403) break; // success, or a key problem no other model will fix
    }
    if (r.status === 429) return new Response(JSON.stringify({ error: "rate_limited" }), { status: 429, headers });
    if (!r.ok) return new Response(JSON.stringify({ error: "upstream", status: r.status }), { status: 502, headers });
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "{}";
    return new Response(text, { headers });
  },
};
