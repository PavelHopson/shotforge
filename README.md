<div align="center">

# ⚡ Shotforge

### AI-фотостудия — профессиональные фотосессии за 3 минуты

[![Демо](https://img.shields.io/badge/ДЕМО-shotforge.pages.dev-7c3aed?style=for-the-badge&logo=cloudflarepages&logoColor=white)](https://shotforge.pages.dev)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev)
[![MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

**[→ Открыть демо](https://shotforge.pages.dev)**

</div>

---

## Что это

Shotforge — виртуальная AI-фотостудия с тремя режимами:

| Режим | Описание |
|-------|----------|
| **AI Фотограф** | Выбираешь стиль (21 пресет) → настраиваешь параметры → AI генерирует профессиональные снимки |
| **Face Fusion** | Загружаешь своё фото + одежду/стиль → AI совмещает в одно изображение |
| **Style Transfer** | Загружаешь референс → AI переносит стиль на твоё фото |

---

## Как пользоваться

### Шаг 1: Получить API ключ

Shotforge работает с **Google Gemini AI** (бесплатно). Для получения ключа:

1. Перейди на **[Google AI Studio](https://aistudio.google.com/apikey)**
2. Войди в Google аккаунт
3. Нажми **"Create API Key"**
4. Скопируй ключ (формат: `AIza...`)

> Бесплатный тариф: 15 запросов/минуту, 1500 запросов/день — этого более чем достаточно.

### Шаг 2: Вставить ключ в приложение

Открой Shotforge → нажми **⚙ Настройки** (шестерёнка в хедере) → вставь API ключ → сохрани.

### Шаг 3: Создать фотосессию

#### Режим "AI Фотограф"
1. Нажми **"Начать сессию"**
2. Загрузи своё селфи (или любое фото)
3. AI проанализирует лицо, тон кожи, стиль
4. Выбери пресет:

| Пресет | Стиль |
|--------|-------|
| Old Money | Тихая роскошь, лён, яхт-клуб |
| Vogue Editorial | Высокая мода, контраст, студия |
| Cyberpunk Tokyo | Неон, дождь, мокрый асфальт |
| LinkedIn Pro | Чистый фон, деловой стиль |
| Film Noir | Ч/б, драматические тени |
| Cinematic Adventure | Пейзажи, golden hour |
| Manga / Anime | Японский стиль, яркие глаза |
| Pixel Art Retro | 16-bit, ретро-игры |
| Product Photo | Белый фон, студийный свет |
| 3D Isometric | Миниатюра, tilt-shift |
| Ukiyo-e 浮世絵 | Японская гравюра, Хокусай |
| LEGO Miniature | Фигурка LEGO, макро |
| Comic Book | Комикс, жирные контуры |
| Watercolor | Акварель, мягкие края |
| Hyper-Real Selfie | Видимые поры, без ретуши |
| Macro Skin | Макро-съёмка кожи |
| Interstellar | IMAX 70mm, космические пейзажи |
| Blade Runner Noir | Неон-нуар, teal-orange |
| Studio Ghibli | Miyazaki, пастельные тона |
| Pixar / Disney 3D | Стилизованный 3D, яркие цвета |
| Indie Film Memory | Ностальгия, плёночное зерно |

5. Настрой параметры:
   - **Пол/возраст** — кого изображаем
   - **Эмоция** — серьёзный, улыбка, уверенный, задумчивый
   - **Освещение** — студийное, golden hour, неон, кинематографическое
   - **Камера** — 85mm портрет, 35mm editorial, макро, full body
   - **Одежда** — свободный текст (Business Casual, Evening Gown...)

6. Нажми **"Сгенерировать"** → получи 4 варианта фотографий

#### Режим "Face Fusion"
1. Загрузи своё лицо
2. Загрузи одежду, обувь, аксессуары (отдельные фото)
3. Выбери стиль/фон
4. AI совместит всё в одно фото

#### Режим "Style Transfer"
1. Загрузи своё фото
2. Загрузи референс стиля
3. AI перенесёт стиль на твоё изображение

---

## Настройка AI-провайдера

В **⚙ Настройки** можно выбрать провайдера:

| Провайдер | Как получить ключ | Стоимость |
|-----------|-------------------|-----------|
| **Google Gemini** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Бесплатно (15 req/min) |
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | От $5 кредитов |
| **OpenRouter** | [openrouter.ai/keys](https://openrouter.ai/keys) | Много бесплатных моделей |
| **Ollama (локально)** | [ollama.com](https://ollama.com) → `ollama pull llama3.2-vision` | Бесплатно, на вашем GPU |

### Для генерации изображений

Gemini 2.5 Flash умеет генерировать изображения напрямую. Для лучшего качества:

| Модель | Возможности |
|--------|------------|
| `gemini-2.5-flash` | Промпты + текст (быстрый) |
| `gemini-2.5-pro` | Промпты + текст (качественный) |
| `gemini-3-pro-image-preview` | **Генерация изображений** (рекомендуется) |

---

## Стек

| Технология | Роль |
|-----------|------|
| React 19 + TypeScript | UI компоненты |
| Vite 6 | Сборка |
| Tailwind CSS | Стили (dark theme) |
| Google Gemini AI | Креативный директор + генерация |
| Lucide React | Иконки |

---

## Быстрый старт

```bash
git clone https://github.com/PavelHopson/shotforge.git
cd shotforge
npm install

# Создать .env
echo "GEMINI_API_KEY=ваш_ключ" > .env

npm run dev
# → http://localhost:3000
```

### Сборка и деплой

```bash
npm run build
# → dist/

# Cloudflare Pages
npx wrangler pages deploy dist --project-name=shotforge
```

---

## Структура

```
shotforge/
├── App.tsx                  # Главный компонент (3 режима)
├── index.tsx                # Точка входа
├── types.ts                 # TypeScript типы
├── constants.ts             # 21 пресет стилей
├── components/
│   ├── Header.tsx           # Навигация с табами режимов
│   ├── Hero.tsx             # Главный экран
│   ├── ConfigPanel.tsx      # Панель настроек съёмки
│   ├── UploadSection.tsx    # Загрузка фото
│   ├── FaceFusionMode.tsx   # Face Fusion режим
│   ├── ResultsGallery.tsx   # Галерея результатов
│   ├── SettingsPanel.tsx    # Настройки AI-провайдера
│   └── Button.tsx           # UI-кнопка
├── services/
│   └── geminiService.ts     # AI-сервис (Gemini + Ollama + multi-provider)
└── vite.config.ts
```

---

## Лицензия

[MIT](LICENSE)

---

<div align="center">
<sub>Сделано с ⚡ в Eclipse Forge</sub>
</div>
