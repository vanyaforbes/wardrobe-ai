/* Wardrobe AI: interface texts in English and Russian.
   Every visible string lives here. WA.t(key, vars) looks a key up in the
   current language, falls back to English, and fills {placeholders}. */
window.WA = window.WA || {};

WA.I18N = {
  en: {
    /* navigation */
    "nav.home": "Home", "nav.wardrobe": "Wardrobe", "nav.outfits": "Outfits", "nav.styles": "Styles",
    "nav.shop": "Shop", "nav.stylist": "AI Stylist", "nav.profile": "Profile",
    "status.synced": "Synced", "status.local": "Saved on this device", "status.loading": "Loading…",

    /* toasts and errors */
    "toast.storageFull": "Storage is full. Remove a few photos and try again.",
    "toast.saveFailed": "Couldn't save. Please try again.",
    "toast.lookSaved": "Look saved", "toast.lookRemoved": "Look removed",
    "toast.removeFailed": "Couldn't remove. Please try again.",
    "toast.deleted": "{name} deleted", "toast.added": "Added to your wardrobe", "toast.saved": "Changes saved",
    "toast.productRemoved": "Product removed", "toast.productSaved": "Product saved",
    "err.delete": "Couldn't delete. Please try again.", "err.save": "Couldn't save. Please try again.",
    "err.quota": "Storage is full. Remove a few photos and try again.",
    "ai.unavailable": "The AI stylist isn't connected yet, so this answer uses the built-in rules.",
    "ai.rateLimited": "The AI is busy right now. Here is an answer from the built-in rules.",
    "ai.failed": "The AI didn't answer. Here is an answer from the built-in rules.",

    /* categories */
    "cat.tops": "Tops", "cat.bottoms": "Bottoms", "cat.jackets": "Outerwear", "cat.shoes": "Shoes",
    "cat.accessories": "Accessories", "cat.bags": "Bags",
    "noun.tops": "top", "noun.bottoms": "trousers", "noun.jackets": "jacket", "noun.shoes": "shoes",
    "noun.accessories": "accessory", "noun.bags": "bag", "noun.dress": "dress",

    /* colours */
    "color.black": "black", "color.white": "white", "color.grey": "grey", "color.beige": "beige",
    "color.brown": "brown", "color.navy": "navy", "color.denim": "denim", "color.khaki": "khaki",
    "color.blue": "blue", "color.lightblue": "light blue", "color.green": "green", "color.red": "red",
    "color.burgundy": "burgundy", "color.pink": "pink", "color.yellow": "yellow", "color.orange": "orange",
    "color.purple": "purple",
    "harmony.tonal": "a tonal pairing", "harmony.analogous": "neighbouring shades",
    "harmony.triadic": "a balanced triad", "harmony.complementary": "a complementary pair",

    /* why a look works */
    "why.neutral": "A neutral base ({colors}) that is easy to wear together.",
    "why.oneAccent": "One accent colour, {color}, on a neutral base keeps it calm.",
    "why.harmony": "{a} and {b} work together as {kind}.",
    "why.bold": "{a} with {b} is a bold contrast.",
    "why.oneStyle": "Every piece fits the {style} style.",
    "why.mix": "It mixes {styles}, balanced by formality.",
    "why.clash": "Some pieces differ in formality. Swap one if it feels off.",
    "why.layer.cold": "A warm outer layer for cold weather.",
    "why.layer.cool": "A light outer layer for cool weather.",
    "why.offSeason": "{item} is not quite right for this season.",
    "why.season": "The pieces suit the season: {season}.",

    "season.all": "all seasons", "season.winter": "winter", "season.spring": "spring", "season.summer": "summer", "season.autumn": "autumn",
    "occ.everyday": "everyday", "occ.study": "university", "occ.work": "work", "occ.date": "date", "occ.party": "party", "occ.sport": "sport",
    "weather.cold": "Cold", "weather.cool": "Cool", "weather.warm": "Warm", "weather.hot": "Hot",

    "need.top": "a top", "need.bottom": "a bottom", "need.shoes": "shoes",
    "gen.missing": "To build a look, add {list}.",
    "gen.noItems": "Add a few items to your wardrobe first.",

    /* looks */
    "look.main": "Main look", "look.alt": "Alternative", "look.bold": "Bolder option", "look.option": "Option",
    "look.label": "Look", "look.untitled": "Untitled look", "look.mine": "My look", "look.withStore": "With store pieces",
    "look.match": "{n}% match", "look.matchHint": "How well colours, formality and the occasion fit together",
    "look.owned": "{n} owned", "look.fromStores": "{n} from stores", "look.why": "Why it works",

    /* what to buy */
    "buy.knit": "knit sweater", "buy.shirt": "shirt", "buy.tee": "t-shirt", "buy.trousers": "trousers", "buy.jeans": "jeans",
    "buy.coat": "coat", "buy.jacket": "jacket", "buy.boots": "boots", "buy.sneakers": "sneakers",
    "buy.missing": "Missing piece", "buy.complete": "Next piece to add", "buy.title": "What to buy next",
    "buy.text": "Picked to fit your {style} looks and the colours you already own.",
    "buy.fromCatalog": "From your store catalog",
    "buy.disclaimer": "Store links open a search on the retailer's own site. Prices, sizes and stock are checked there, not in this app.",

    /* photos */
    "photo.notImage": "That file isn't an image.", "photo.tooBig": "The image is too large. Please pick one under 15 MB.",
    "photo.cantOpen": "Couldn't open this image. Try another one.", "photo.processing": "Preparing photo…",
    "photo.choose": "Add a photo", "photo.hint": "Optional. JPG or PNG, a plain background works best.",
    "photo.ready": "Photo ready",

    /* accessibility labels */
    "aria.open": "Open {name}", "aria.edit": "Edit {name}", "aria.delete": "Delete {name}",
    "aria.fav": "Favourite", "aria.lookDetails": "Look details",

    /* buttons */
    "btn.edit": "Edit", "btn.delete": "Delete", "btn.details": "Details", "btn.remove": "Remove",
    "btn.saveLook": "Save look", "btn.saved": "Saved", "btn.addItem": "Add item", "btn.buildLook": "Build a look",
    "btn.exploreStyles": "Explore styles", "btn.allLooks": "All looks", "btn.addFirst": "Add your first item",
    "btn.addManual": "Add manually", "btn.viewAll": "View all", "btn.toWardrobe": "Go to wardrobe",
    "btn.clear": "Clear", "btn.styleMe": "Style me", "btn.reset": "Reset", "btn.close": "Close", "btn.keep": "Keep",
    "btn.replacePhoto": "Replace photo", "btn.removePhoto": "Remove photo", "btn.saving": "Saving…",
    "btn.addToWardrobe": "Add to wardrobe", "btn.saveChanges": "Save changes",
    "btn.fav": "Add to favourites", "btn.unfav": "Remove from favourites", "btn.send": "Send",

    /* shop */
    "badge.shop": "Store",
    "shop.eyebrow": "Shops in Almaty",
    "shop.lede": "Search ZARA, Bershka and Kaspi on their official sites, and keep the pieces you like in your own catalog.",
    "shop.search": "What are you looking for?", "shop.defaultQuery": "jacket",
    "shop.linksOnly": "Official site", "shop.visit": "Open store",
    "shop.catalog": "My store catalog",
    "shop.catalogNote": "Products here are added by you from official store pages. Prices are what you saw on the date shown, not live data.",
    "shop.manual": "Manual import", "shop.checked": "price seen {date}", "shop.priceOnSite": "Price on the store's site",
    "shop.sizesNoted": "Sizes noted: {sizes}", "shop.open": "Open on {store}",
    "shop.emptyTitle": "Your store catalog is empty.",
    "shop.emptyText": "Found something on ZARA, Bershka or Kaspi? Paste its link here to compare it with your wardrobe.",
    "shop.addProduct": "Add product", "shop.editProduct": "Edit product", "shop.import": "Import JSON",
    "shop.noMatchTitle": "Nothing matches", "shop.noMatch": "Try other filters or clear them.",
    "shop.favOnly": "Favourites only",
    "shop.importTitle": "Import products",
    "shop.importText": "Paste a JSON list of products, for example exported by an admin. Each needs name, retailer (zara, bershka or kaspi) and an official url. Price and sizes are optional.",
    "shop.importRun": "Import",
    "shop.addText": "Copy the details from the official product page. Nothing here is checked live, so keep the link to see the current price and sizes.",
    "shop.photo": "Product photo", "shop.photoHint": "Optional. Use a photo you took or are allowed to use.",
    "shop.url": "Link to the product page", "shop.priceKzt": "Price, ₸", "shop.sizes": "Sizes (comma separated)",
    "shop.addToCatalog": "Save to catalog", "shop.confirmDelete": "Remove this product from your catalog?",
    "shop.errName": "Add the product name.", "shop.errStore": "Choose a store.",
    "shop.errUrl": "Add a link that starts with https://", "shop.errHost": "The link must be on {hosts}.",
    "shop.errJson": "This isn't a valid JSON list.", "shop.imported": "Imported {ok}, skipped {bad}.",

    /* home */
    "greet.morning": "Good morning", "greet.afternoon": "Good afternoon", "greet.evening": "Good evening",
    "home.titleHas": "Here is your wardrobe today.", "home.titleEmpty": "Let's build your wardrobe.",
    "home.ledeHas": "Pick a look for today, try a new style, or ask the stylist.",
    "home.ledeEmpty": "Add the clothes you own, choose your styles, and the stylist will put outfits together from them.",
    "home.getStarted": "Get started",
    "home.step1": "Add your first item", "home.step1t": "A photo or a quick manual entry.",
    "home.step2": "Choose your styles", "home.step2t": "Pick from 20 styles so advice fits your taste.",
    "home.step3": "Ask the stylist", "home.step3t": "Get outfits made from your own clothes.",
    "home.recommended": "Recommended for today",
    "home.ctaTitle": "Not sure what to wear?",
    "home.ctaText": "Tell the stylist where you're going and what the weather is like. It uses your clothes and your styles.",
    "home.ctaPlaceholder": "What should I wear today?",
    "home.yourStyles": "Your styles", "home.recent": "Recently added",
    "home.shopTitle": "Shops in Almaty",
    "home.shopText": "Search ZARA, Bershka and Kaspi on their official sites and save pieces to compare with your wardrobe.",
    "stat.items": "Items", "stat.looks": "Looks", "stat.styles": "Styles", "stat.products": "Saved products",

    /* wardrobe */
    "ward.eyebrow": "Your wardrobe",
    "ward.emptyTitle": "Your wardrobe is waiting.",
    "ward.emptyText": "Start building your digital wardrobe by uploading your first item.",
    "ward.all": "All", "ward.catEmpty": "No {cat} yet", "ward.catEmptyText": "Add something to this category.",
    "ward.noMatch": "Try another word or clear the search.", "ward.noMatchTitle": "Nothing found",
    "ward.categories": "Categories", "ward.count": "Items: {n}", "ward.search": "Search your wardrobe", "ward.sort": "Sort",
    "sort.new": "Newest", "sort.old": "Oldest", "sort.name": "Name", "sort.color": "Colour", "sort.brand": "Brand",

    /* outfits */
    "out.eyebrow": "Outfits", "out.lede": "Combine your own pieces, let the stylist suggest looks, and keep the ones you love.",
    "out.tabBuild": "Builder", "out.tabIdeas": "Ideas", "out.tabSaved": "Saved", "out.tabFav": "Favourites",
    "out.emptyTitle": "Outfits start with your wardrobe.",
    "out.emptyText": "Add a top, a bottom and shoes, then come back to build looks.",
    "out.favEmpty": "No favourites yet", "out.favEmptyText": "Tap the heart on a look to keep it here.",
    "out.savedEmpty": "No saved looks yet", "out.savedEmptyText": "Build a look or ask for ideas, then save it.",
    "out.preview": "Preview", "out.pickHint": "Pick a piece for each slot. Empty slots are fine.",
    "out.autofill": "Complete for me", "out.builtAround": "Built around",
    "out.styledForYou": "Styled for you", "out.whatToBuy": "What to buy next",
    "slot.top": "Top", "slot.bottom": "Bottom", "slot.outer": "Outerwear", "slot.shoes": "Shoes",
    "slot.acc": "Accessory", "slot.bag": "Bag", "slot.shop": "From your store catalog", "slot.none": "Nothing here yet",

    /* fields */
    "f.occasion": "Occasion", "f.style": "Style", "f.anyStyle": "Any style", "f.lookName": "Look name",
    "f.lookNamePh": "For example, Monday lectures", "f.season": "Season", "f.weather": "Weather",
    "f.store": "Store", "f.all": "All", "f.category": "Category", "f.price": "Price, ₸", "f.from": "from", "f.to": "to",
    "f.size": "Size", "f.color": "Colour", "f.name": "Name", "f.brand": "Brand", "f.description": "Description",
    "f.descPh": "Fabric, fit, anything worth remembering",

    /* styles */
    "styles.eyebrow": "Style discovery", "styles.title": "Find your style",
    "styles.lede": "Choose the styles that feel like you. The stylist uses them when it builds outfits and searches stores.",
    "styles.search": "Search styles", "styles.select": "Add to my styles", "styles.unselect": "Remove from my styles",
    "styles.selected": "Selected", "styles.selectedN": "Selected: {n}",
    "styles.noneTitle": "No styles found", "styles.none": "Try another word.",
    "styles.noneMine": "You haven't chosen any styles yet.",
    "styles.traits": "Characteristics", "styles.cats": "Typical pieces", "styles.examples": "Example outfits",
    "styles.build": "Build a look in this style",
    "sgroup.all": "All", "sgroup.everyday": "Everyday", "sgroup.smart": "Smart", "sgroup.relaxed": "Relaxed",
    "sgroup.expressive": "Expressive", "sgroup.mine": "My styles",

    /* stylist */
    "stylist.eyebrow": "AI Stylist", "stylist.name": "Wardrobe Stylist",
    "stylist.viaClaude": "AI connected", "stylist.viaProxy": "AI connected", "stylist.viaRules": "Built-in rules, AI not connected yet",
    "stylist.hello": "Hi{name}. Tell me where you're going and I'll put an outfit together from your clothes.",
    "stylist.noItems": "Your wardrobe is empty, so I can only suggest what to look for in stores.",
    "stylist.wardrobe": "Ask about an item", "stylist.thinking": "Thinking…",
    "stylist.inStores": "Search in stores",
    "stylist.linksNote": "These links open a search on the store's site. I can't see live stock or prices.",
    "stylist.placeholder": "Ask the stylist…",
    "prompt.today": "What should I wear today?", "prompt.smart": "Create a smart casual outfit.",
    "prompt.match": "Find something that matches my black jeans.", "prompt.uni": "Suggest an outfit for university.",
    "prompt.similar": "Find similar clothes from Bershka or Zara.", "prompt.withItem": "What goes with my {item}?",
    "promptk.today": "Today", "promptk.smart": "Smart casual", "promptk.match": "Match", "promptk.uni": "University", "promptk.similar": "Shops",
    "rules.storesFor": "Here are searches for pieces like your {item} on the official store sites.",
    "rules.stores": "Here are searches for {item} on the official store sites.",
    "rules.missing": "{msg}",
    "rules.empty": "Your wardrobe is still empty, so I can't build a look from your clothes yet. For {occ} ({weather}) I'd start with a basic piece like the one below. Add a few of your own items and I'll put outfits together from them.",
    "rules.around": "Looks built around your {item} for {occ}, {weather}.",
    "rules.for": "Looks for {occ}, {weather}.",
    "rules.aroundStyle": "Looks in the {style} style built around your {item} for {occ}, {weather}.",
    "rules.forStyle": "Looks in the {style} style for {occ}, {weather}.",

    /* selfie colours */
    "me.title": "Colours that suit you", "me.text": "Upload a selfie in daylight and the AI will suggest your best colours. The photo is not saved.",
    "me.another": "Try another photo", "me.choose": "Upload a selfie", "me.busy": "Looking at your colours…",
    "me.undertone": "Undertone", "me.contrast": "Contrast",
    "me.u.warm": "warm", "me.u.cool": "cool", "me.u.neutral": "neutral",
    "me.c.low": "low", "me.c.medium": "medium", "me.c.high": "high",
    "me.needsAI": "This needs the AI stylist, which isn't connected yet.",
    "me.needsItems": "Add a few items so I can match your colours to your clothes.",
    "me.noPerson": "I couldn't find a face in this photo. Try a clear selfie.",
    "me.failed": "Couldn't read this photo. Please try again.",

    /* profile */
    "prof.eyebrow": "Profile", "prof.name": "Your name", "prof.namePh": "How should the stylist call you?",
    "prof.language": "Language", "prof.sizeTop": "Top size", "prof.sizeBottom": "Bottom size", "prof.sizeShoes": "Shoe size",
    "prof.sizesNote": "Used to filter your store catalog. Always check the store's size chart.",
    "prof.noStyles": "No styles chosen yet.", "prof.status": "How the app works now",
    "prof.storage": "Storage", "prof.storageDb": "Saved to your account", "prof.storageLocal": "Saved in this browser only",
    "prof.ai": "AI stylist", "prof.aiClaude": "Connected", "prof.aiProxy": "Connected through the server",
    "prof.aiRules": "Not connected yet. Built-in rules are used.",
    "prof.stores": "Stores", "prof.storesText": "Links to official sites plus your own catalog. No live prices or stock.",
    "prof.auth": "Account", "prof.authText": "No sign-in yet. Your wardrobe is saved on this device. Messages to the AI stylist, and photos you send for analysis, go to Google Gemini.",

    /* items */
    "item.new": "New item", "item.edit": "Edit item", "item.recognising": "Recognising the item…",
    "item.aiFill": "Fill in from photo", "item.buildWith": "Build a look with it", "item.delete": "Delete item",
    "item.confirmDelete": "Delete {name} from your wardrobe?",
    "item.aiDone": "Details filled in. Check them before saving.", "item.aiFailed": "Couldn't recognise it. Fill in the details yourself.",
  },

  ru: {
    "nav.home": "Главная", "nav.wardrobe": "Гардероб", "nav.outfits": "Образы", "nav.styles": "Стили",
    "nav.shop": "Магазины", "nav.stylist": "AI-стилист", "nav.profile": "Профиль",
    "status.synced": "Синхронизировано", "status.local": "Сохранено на этом устройстве", "status.loading": "Загрузка…",

    "toast.storageFull": "Хранилище заполнено. Удалите несколько фото и попробуйте снова.",
    "toast.saveFailed": "Не удалось сохранить. Попробуйте ещё раз.",
    "toast.lookSaved": "Образ сохранён", "toast.lookRemoved": "Образ удалён",
    "toast.removeFailed": "Не удалось удалить. Попробуйте ещё раз.",
    "toast.deleted": "{name}: удалено", "toast.added": "Добавлено в гардероб", "toast.saved": "Изменения сохранены",
    "toast.productRemoved": "Товар удалён", "toast.productSaved": "Товар сохранён",
    "err.delete": "Не удалось удалить. Попробуйте ещё раз.", "err.save": "Не удалось сохранить. Попробуйте ещё раз.",
    "err.quota": "Хранилище заполнено. Удалите несколько фото и попробуйте снова.",
    "ai.unavailable": "AI-стилист ещё не подключён, поэтому ответ собран по встроенным правилам.",
    "ai.rateLimited": "AI сейчас перегружен. Вот ответ по встроенным правилам.",
    "ai.failed": "AI не ответил. Вот ответ по встроенным правилам.",

    "cat.tops": "Верх", "cat.bottoms": "Низ", "cat.jackets": "Верхняя одежда", "cat.shoes": "Обувь",
    "cat.accessories": "Аксессуары", "cat.bags": "Сумки",
    "noun.tops": "верх", "noun.bottoms": "брюки", "noun.jackets": "куртка", "noun.shoes": "обувь",
    "noun.accessories": "аксессуар", "noun.bags": "сумка", "noun.dress": "платье",

    "color.black": "чёрный", "color.white": "белый", "color.grey": "серый", "color.beige": "бежевый",
    "color.brown": "коричневый", "color.navy": "тёмно-синий", "color.denim": "джинсовый", "color.khaki": "хаки",
    "color.blue": "синий", "color.lightblue": "голубой", "color.green": "зелёный", "color.red": "красный",
    "color.burgundy": "бордовый", "color.pink": "розовый", "color.yellow": "жёлтый", "color.orange": "оранжевый",
    "color.purple": "фиолетовый",
    "harmony.tonal": "тон в тон", "harmony.analogous": "соседние оттенки",
    "harmony.triadic": "сбалансированная триада", "harmony.complementary": "контрастная пара",

    "why.neutral": "Нейтральная база ({colors}), которую легко сочетать.",
    "why.oneAccent": "Один акцентный цвет ({color}) на нейтральной базе смотрится спокойно.",
    "why.harmony": "{a} и {b} сочетаются: {kind}.",
    "why.bold": "{a} и {b} дают смелый контраст.",
    "why.oneStyle": "Все вещи в стиле «{style}».",
    "why.mix": "Сочетание стилей: {styles}, сбалансировано по строгости.",
    "why.clash": "Вещи разной степени строгости. Замените одну, если что-то смущает.",
    "why.layer.cold": "Тёплый верхний слой для холодной погоды.",
    "why.layer.cool": "Лёгкий верхний слой для прохладной погоды.",
    "why.offSeason": "{item} не совсем подходит для этого сезона.",
    "why.season": "Вещи подходят для сезона: {season}.",

    "season.all": "все сезоны", "season.winter": "зима", "season.spring": "весна", "season.summer": "лето", "season.autumn": "осень",
    "occ.everyday": "на каждый день", "occ.study": "учёба", "occ.work": "работа", "occ.date": "свидание", "occ.party": "вечеринка", "occ.sport": "спорт",
    "weather.cold": "Холодно", "weather.cool": "Прохладно", "weather.warm": "Тепло", "weather.hot": "Жарко",

    "need.top": "верх", "need.bottom": "низ", "need.shoes": "обувь",
    "gen.missing": "Чтобы собрать образ, добавьте: {list}.",
    "gen.noItems": "Сначала добавьте несколько вещей в гардероб.",

    "look.main": "Основной образ", "look.alt": "Альтернатива", "look.bold": "Смелый вариант", "look.option": "Вариант",
    "look.label": "Образ", "look.untitled": "Образ без названия", "look.mine": "Мой образ", "look.withStore": "С вещами из магазинов",
    "look.match": "Совпадение {n}%", "look.matchHint": "Насколько сочетаются цвета, строгость и повод",
    "look.owned": "Своих: {n}", "look.fromStores": "Из магазинов: {n}", "look.why": "Почему это работает",

    "buy.knit": "джемпер", "buy.shirt": "рубашка", "buy.tee": "футболка", "buy.trousers": "брюки", "buy.jeans": "джинсы",
    "buy.coat": "пальто", "buy.jacket": "куртка", "buy.boots": "ботинки", "buy.sneakers": "кроссовки",
    "buy.missing": "Не хватает", "buy.complete": "Что добавить дальше", "buy.title": "Что докупить",
    "buy.text": "Подобрано под ваши образы в стиле «{style}» и цвета, которые у вас уже есть.",
    "buy.fromCatalog": "Из вашего каталога магазинов",
    "buy.disclaimer": "Ссылки открывают поиск на официальном сайте магазина. Цены, размеры и наличие смотрите там, приложение их не проверяет.",

    "photo.notImage": "Это не изображение.", "photo.tooBig": "Файл слишком большой. Выберите фото до 15 МБ.",
    "photo.cantOpen": "Не удалось открыть фото. Попробуйте другое.", "photo.processing": "Обрабатываем фото…",
    "photo.choose": "Добавить фото", "photo.hint": "Необязательно. JPG или PNG, лучше на однотонном фоне.",
    "photo.ready": "Фото готово",

    "aria.open": "Открыть: {name}", "aria.edit": "Изменить: {name}", "aria.delete": "Удалить: {name}",
    "aria.fav": "Избранное", "aria.lookDetails": "Подробнее об образе",

    "btn.edit": "Изменить", "btn.delete": "Удалить", "btn.details": "Подробнее", "btn.remove": "Убрать",
    "btn.saveLook": "Сохранить образ", "btn.saved": "Сохранено", "btn.addItem": "Добавить вещь", "btn.buildLook": "Собрать образ",
    "btn.exploreStyles": "Смотреть стили", "btn.allLooks": "Все образы", "btn.addFirst": "Добавить первую вещь",
    "btn.addManual": "Добавить вручную", "btn.viewAll": "Смотреть все", "btn.toWardrobe": "Перейти в гардероб",
    "btn.clear": "Очистить", "btn.styleMe": "Подобрать образ", "btn.reset": "Сбросить", "btn.close": "Закрыть", "btn.keep": "Оставить",
    "btn.replacePhoto": "Заменить фото", "btn.removePhoto": "Убрать фото", "btn.saving": "Сохраняем…",
    "btn.addToWardrobe": "Добавить в гардероб", "btn.saveChanges": "Сохранить изменения",
    "btn.fav": "В избранное", "btn.unfav": "Убрать из избранного", "btn.send": "Отправить",

    "badge.shop": "Магазин",
    "shop.eyebrow": "Магазины Алматы",
    "shop.lede": "Ищите вещи ZARA, Bershka и Kaspi на их официальных сайтах и сохраняйте понравившееся в свой каталог.",
    "shop.search": "Что вы ищете?", "shop.defaultQuery": "куртка",
    "shop.linksOnly": "Официальный сайт", "shop.visit": "Открыть магазин",
    "shop.catalog": "Мой каталог магазинов",
    "shop.catalogNote": "Товары сюда добавляете вы сами со страниц официальных магазинов. Цена указана на дату просмотра, это не данные в реальном времени.",
    "shop.manual": "Добавлено вручную", "shop.checked": "цена от {date}", "shop.priceOnSite": "Цена на сайте магазина",
    "shop.sizesNoted": "Размеры: {sizes}", "shop.open": "Открыть в {store}",
    "shop.emptyTitle": "Каталог магазинов пока пуст.",
    "shop.emptyText": "Нашли что-то в ZARA, Bershka или Kaspi? Вставьте ссылку, чтобы сравнить вещь с вашим гардеробом.",
    "shop.addProduct": "Добавить товар", "shop.editProduct": "Изменить товар", "shop.import": "Импорт JSON",
    "shop.noMatchTitle": "Ничего не найдено", "shop.noMatch": "Измените фильтры или сбросьте их.",
    "shop.favOnly": "Только избранное",
    "shop.importTitle": "Импорт товаров",
    "shop.importText": "Вставьте JSON-список товаров, например выгрузку администратора. У каждого нужны name, retailer (zara, bershka или kaspi) и официальная ссылка url. Цена и размеры необязательны.",
    "shop.importRun": "Импортировать",
    "shop.addText": "Перенесите данные с официальной страницы товара. Здесь ничего не проверяется в реальном времени, поэтому сохраните ссылку, чтобы видеть актуальную цену и размеры.",
    "shop.photo": "Фото товара", "shop.photoHint": "Необязательно. Используйте своё фото или фото, которое разрешено использовать.",
    "shop.url": "Ссылка на страницу товара", "shop.priceKzt": "Цена, ₸", "shop.sizes": "Размеры (через запятую)",
    "shop.addToCatalog": "Сохранить в каталог", "shop.confirmDelete": "Удалить этот товар из каталога?",
    "shop.errName": "Укажите название товара.", "shop.errStore": "Выберите магазин.",
    "shop.errUrl": "Добавьте ссылку, которая начинается с https://", "shop.errHost": "Ссылка должна вести на {hosts}.",
    "shop.errJson": "Это не похоже на JSON-список.", "shop.imported": "Импортировано: {ok}, пропущено: {bad}.",

    "greet.morning": "Доброе утро", "greet.afternoon": "Добрый день", "greet.evening": "Добрый вечер",
    "home.titleHas": "Ваш гардероб на сегодня.", "home.titleEmpty": "Давайте соберём ваш гардероб.",
    "home.ledeHas": "Выберите образ на сегодня, попробуйте новый стиль или спросите стилиста.",
    "home.ledeEmpty": "Добавьте свою одежду, выберите стили, и стилист будет собирать образы из ваших вещей.",
    "home.getStarted": "С чего начать",
    "home.step1": "Добавьте первую вещь", "home.step1t": "По фото или вручную, это быстро.",
    "home.step2": "Выберите стили", "home.step2t": "20 стилей, чтобы советы подходили вам.",
    "home.step3": "Спросите стилиста", "home.step3t": "Образы из вашей собственной одежды.",
    "home.recommended": "Рекомендуем на сегодня",
    "home.ctaTitle": "Не знаете, что надеть?",
    "home.ctaText": "Расскажите стилисту, куда вы идёте и какая погода. Он учтёт ваши вещи и стили.",
    "home.ctaPlaceholder": "Что мне надеть сегодня?",
    "home.yourStyles": "Ваши стили", "home.recent": "Недавно добавленные",
    "home.shopTitle": "Магазины Алматы",
    "home.shopText": "Ищите вещи ZARA, Bershka и Kaspi на официальных сайтах и сохраняйте их, чтобы сравнить с гардеробом.",
    "stat.items": "Вещи", "stat.looks": "Образы", "stat.styles": "Стили", "stat.products": "Товары",

    "ward.eyebrow": "Ваш гардероб",
    "ward.emptyTitle": "Ваш гардероб пока пуст.",
    "ward.emptyText": "Загрузите первую вещь, чтобы создать свой цифровой гардероб.",
    "ward.all": "Все", "ward.catEmpty": "Раздел «{cat}» пока пуст", "ward.catEmptyText": "Добавьте вещь в эту категорию.",
    "ward.noMatch": "Попробуйте другое слово или очистите поиск.", "ward.noMatchTitle": "Ничего не найдено",
    "ward.categories": "Категории", "ward.count": "Вещей: {n}", "ward.search": "Поиск по гардеробу", "ward.sort": "Сортировка",
    "sort.new": "Сначала новые", "sort.old": "Сначала старые", "sort.name": "По названию", "sort.color": "По цвету", "sort.brand": "По бренду",

    "out.eyebrow": "Образы", "out.lede": "Сочетайте свои вещи, получайте идеи от стилиста и сохраняйте любимые образы.",
    "out.tabBuild": "Конструктор", "out.tabIdeas": "Идеи", "out.tabSaved": "Сохранённые", "out.tabFav": "Избранное",
    "out.emptyTitle": "Образы начинаются с гардероба.",
    "out.emptyText": "Добавьте верх, низ и обувь, а потом возвращайтесь собирать образы.",
    "out.favEmpty": "В избранном пока пусто", "out.favEmptyText": "Нажмите на сердечко у образа, чтобы он появился здесь.",
    "out.savedEmpty": "Сохранённых образов пока нет", "out.savedEmptyText": "Соберите образ или попросите идеи и сохраните его.",
    "out.preview": "Предпросмотр", "out.pickHint": "Выберите вещь для каждого слота. Пустые слоты тоже можно оставить.",
    "out.autofill": "Дополнить за меня", "out.builtAround": "Образ вокруг вещи:",
    "out.styledForYou": "Подобрано для вас", "out.whatToBuy": "Что докупить",
    "slot.top": "Верх", "slot.bottom": "Низ", "slot.outer": "Верхняя одежда", "slot.shoes": "Обувь",
    "slot.acc": "Аксессуар", "slot.bag": "Сумка", "slot.shop": "Из каталога магазинов", "slot.none": "Здесь пока ничего нет",

    "f.occasion": "Повод", "f.style": "Стиль", "f.anyStyle": "Любой стиль", "f.lookName": "Название образа",
    "f.lookNamePh": "Например, пары в понедельник", "f.season": "Сезон", "f.weather": "Погода",
    "f.store": "Магазин", "f.all": "Все", "f.category": "Категория", "f.price": "Цена, ₸", "f.from": "от", "f.to": "до",
    "f.size": "Размер", "f.color": "Цвет", "f.name": "Название", "f.brand": "Бренд", "f.description": "Описание",
    "f.descPh": "Ткань, посадка, всё, что стоит запомнить",

    "styles.eyebrow": "Подбор стиля", "styles.title": "Найдите свой стиль",
    "styles.lede": "Выберите стили, которые вам близки. Стилист учитывает их, когда собирает образы и ищет вещи в магазинах.",
    "styles.search": "Поиск стилей", "styles.select": "Добавить в мои стили", "styles.unselect": "Убрать из моих стилей",
    "styles.selected": "Выбран", "styles.selectedN": "Выбрано: {n}",
    "styles.noneTitle": "Стили не найдены", "styles.none": "Попробуйте другое слово.",
    "styles.noneMine": "Вы ещё не выбрали ни одного стиля.",
    "styles.traits": "Характерные черты", "styles.cats": "Типичные вещи", "styles.examples": "Примеры образов",
    "styles.build": "Собрать образ в этом стиле",
    "sgroup.all": "Все", "sgroup.everyday": "На каждый день", "sgroup.smart": "Деловые", "sgroup.relaxed": "Свободные",
    "sgroup.expressive": "Яркие", "sgroup.mine": "Мои стили",

    "stylist.eyebrow": "AI-стилист", "stylist.name": "Стилист Wardrobe",
    "stylist.viaClaude": "AI подключён", "stylist.viaProxy": "AI подключён", "stylist.viaRules": "Встроенные правила, AI пока не подключён",
    "stylist.hello": "Привет{name}. Расскажите, куда вы идёте, и я соберу образ из ваших вещей.",
    "stylist.noItems": "Гардероб пока пуст, поэтому я могу только подсказать, что поискать в магазинах.",
    "stylist.wardrobe": "Спросить о вещи", "stylist.thinking": "Думаю…",
    "stylist.inStores": "Поиск в магазинах",
    "stylist.linksNote": "Ссылки открывают поиск на сайте магазина. Наличие и цены в реальном времени я не вижу.",
    "stylist.placeholder": "Спросите стилиста…",
    "prompt.today": "Что мне надеть сегодня?", "prompt.smart": "Собери образ в стиле смарт-кэжуал.",
    "prompt.match": "Подбери что-нибудь к моим чёрным джинсам.", "prompt.uni": "Предложи образ для университета.",
    "prompt.similar": "Найди похожие вещи в Bershka или Zara.", "prompt.withItem": "С чем носить мою вещь: {item}?",
    "promptk.today": "Сегодня", "promptk.smart": "Смарт-кэжуал", "promptk.match": "Сочетание", "promptk.uni": "Университет", "promptk.similar": "Магазины",
    "rules.storesFor": "Вот поиск похожих вещей на {item} на официальных сайтах магазинов.",
    "rules.stores": "Вот поиск по запросу «{item}» на официальных сайтах магазинов.",
    "rules.missing": "{msg}",
    "rules.empty": "Гардероб пока пуст, поэтому собрать образ из ваших вещей я ещё не могу. Для повода «{occ}» ({weather}) я бы начал с базовой вещи, поиск ниже. Добавьте несколько своих вещей, и я буду собирать образы из них.",
    "rules.around": "Образы с вашей вещью ({item}): {occ}, {weather}.",
    "rules.for": "Образы: {occ}, {weather}.",
    "rules.aroundStyle": "Образы в стиле «{style}» с вашей вещью ({item}): {occ}, {weather}.",
    "rules.forStyle": "Образы в стиле «{style}»: {occ}, {weather}.",

    "me.title": "Цвета, которые вам идут", "me.text": "Загрузите селфи при дневном свете, и AI подскажет ваши лучшие цвета. Фото не сохраняется.",
    "me.another": "Другое фото", "me.choose": "Загрузить селфи", "me.busy": "Анализируем цвета…",
    "me.undertone": "Подтон", "me.contrast": "Контраст",
    "me.u.warm": "тёплый", "me.u.cool": "холодный", "me.u.neutral": "нейтральный",
    "me.c.low": "низкий", "me.c.medium": "средний", "me.c.high": "высокий",
    "me.needsAI": "Для этого нужен AI-стилист, а он пока не подключён.",
    "me.needsItems": "Добавьте несколько вещей, чтобы я сравнил ваши цвета с одеждой.",
    "me.noPerson": "Не удалось найти лицо на фото. Попробуйте чёткое селфи.",
    "me.failed": "Не удалось обработать фото. Попробуйте ещё раз.",

    "prof.eyebrow": "Профиль", "prof.name": "Ваше имя", "prof.namePh": "Как стилисту к вам обращаться?",
    "prof.language": "Язык", "prof.sizeTop": "Размер верха", "prof.sizeBottom": "Размер низа", "prof.sizeShoes": "Размер обуви",
    "prof.sizesNote": "Нужен для фильтра каталога магазинов. Всегда сверяйтесь с таблицей размеров магазина.",
    "prof.noStyles": "Стили пока не выбраны.", "prof.status": "Как сейчас работает приложение",
    "prof.storage": "Хранение", "prof.storageDb": "Сохраняется в вашем аккаунте", "prof.storageLocal": "Сохраняется только в этом браузере",
    "prof.ai": "AI-стилист", "prof.aiClaude": "Подключён", "prof.aiProxy": "Подключён через сервер",
    "prof.aiRules": "Пока не подключён. Работают встроенные правила.",
    "prof.stores": "Магазины", "prof.storesText": "Ссылки на официальные сайты и ваш собственный каталог. Цен и наличия в реальном времени нет.",
    "prof.auth": "Аккаунт", "prof.authText": "Входа пока нет. Гардероб хранится на этом устройстве. Сообщения AI-стилисту и фото, которые вы отправляете на анализ, уходят в Google Gemini.",

    "item.new": "Новая вещь", "item.edit": "Изменить вещь", "item.recognising": "Распознаём вещь…",
    "item.aiFill": "Заполнить по фото", "item.buildWith": "Собрать образ с ней", "item.delete": "Удалить вещь",
    "item.confirmDelete": "Удалить «{name}» из гардероба?",
    "item.aiDone": "Поля заполнены. Проверьте их перед сохранением.", "item.aiFailed": "Не удалось распознать. Заполните поля сами.",
  },
};

(function () {
  const KEY = "wardrobe-ai-lang";
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
  WA.lang = saved === "ru" || saved === "en" ? saved : "en";
  WA.missing = new Set();

  WA.t = function (key, vars) {
    let s = WA.I18N[WA.lang][key];
    if (s == null) {
      if (!WA.missing.has(WA.lang + ":" + key)) { WA.missing.add(WA.lang + ":" + key); console.warn("[i18n] missing", WA.lang, key); }
      s = WA.I18N.en[key];
      if (s == null) return key;
    }
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? String(vars[k]) : m));
    return s;
  };

  WA.setLang = function (l) {
    if (l !== "en" && l !== "ru") return;
    WA.lang = l;
    document.documentElement.lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) { /* storage blocked */ }
  };
  document.documentElement.lang = WA.lang;
})();
