# Wardrobe AI

A digital wardrobe and personal AI stylist. Upload the clothes you own, choose your styles, and get outfits built from your own pieces. English and Russian interface.

Live site: https://vanyaforbes.github.io/wardrobe-ai

## Sections

- **Home**: today's recommendations, getting-started steps, quick access to the stylist.
- **Wardrobe**: empty by default. Add items by photo or manually (category, colour, brand, size, style, season, occasion, description); edit, delete, search, sort, filter by category (Tops, Bottoms, Outerwear, Shoes, Accessories, Bags).
- **Outfits**: a builder for combining your own items, generated ideas by occasion, season, style and weather, saved looks and favourites, and "what to buy next".
- **Styles**: 20 styles with EN/RU names, descriptions, colour moodboards, characteristics, typical pieces and example outfits. Search, groups, multi-select; the stylist uses the styles you pick.
- **Shop**: ZARA, Bershka and Kaspi Shop (Almaty). Search links open the retailers' official sites. Your own product catalog is filled manually or by JSON import; links are checked against official domains. No live prices or stock.
- **AI Stylist**: chat that combines your wardrobe, styles, occasion, weather and catalog products, and marks which pieces you own and which come from stores. Works on built-in rules until the AI proxy is connected.
- **Profile**: name, language, sizes, chosen styles, and an honest status of storage, AI and store integrations.

## Files

- `index.html`: page shell
- `assets/app.css`: design system (dark theme)
- `assets/i18n.js`: all interface texts, EN and RU
- `assets/catalog.js`: style library and retailer definitions
- `assets/app.js`: application logic
- `worker/worker.js`: optional Cloudflare Worker that proxies the AI (Gemini) so the API key never reaches the browser

## Run locally

Open `index.html` in a browser, or serve the folder (for example `python -m http.server`). Data is stored in the browser's localStorage.

## Deploy

Push to `main`; GitHub Pages publishes the root of the repository.

## Connect the AI

Deploy `worker/worker.js` to Cloudflare Workers with the secret `GEMINI_API_KEY`, then set `AI_URL` at the top of `assets/app.js` to the worker URL.
