<div align="center">

# Shotforge

### AI-фотограф — профессиональные фотосессии за 3 минуты за $9

<p align="center">
  <b>Мы не генерируем «аватарки». Мы создаём редакционную фотографию.</b><br>
  <b>Gemini AI</b> выступает креативным директором, <b>Flux.1 Pro</b> — фотографом.
</p>

![React 19](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Vite 6](https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google-gemini&logoColor=white)
![Flux.1 Pro](https://img.shields.io/badge/Flux.1_Pro-purple?style=flat-square)

</div>

---

## About

Shotforge — виртуальная фотостудия. Вы выбираете стиль, настраиваете параметры съёмки (освещение, камера, одежда, эмоция), а Gemini AI генерирует профессиональный промпт для фотосессии.

Проект симулирует реальную физику фотографии:
- **Освещение:** Softbox, Rim light, Golden Hour, Studio
- **Оптика:** 85mm f/1.2 (портрет), 35mm (editorial), 50mm (street)
- **Стили:** Old Money, Vogue Editorial, Cyberpunk Tokyo, Film Noir, LinkedIn Pro

> **Примечание:** В текущей демо-версии генерация изображений симулируется через [picsum.photos](https://picsum.photos). Для полноценной генерации необходима интеграция с Flux.1 Pro / Replicate API.

---

## Tech Stack

- **Frontend:** React 19, TypeScript
- **Build:** Vite 6
- **AI:** Google Gemini AI (`@google/genai`)
- **UI:** Lucide React (иконки)
- **Генерация изображений:** Flux.1 Pro (запланировано), picsum.photos (демо)

---

## Project Structure

```
shotforge/
├── App.tsx                  # Главный компонент приложения
├── index.tsx                # Точка входа
├── index.html               # HTML-шаблон
├── types.ts                 # TypeScript типы и enum'ы
├── constants.ts             # Пресеты и начальная конфигурация
├── components/
│   ├── Header.tsx           # Шапка
│   ├── Hero.tsx             # Главный экран
│   ├── ConfigPanel.tsx      # Панель настроек съёмки
│   ├── UploadSection.tsx    # Загрузка фото
│   ├── ResultsGallery.tsx   # Галерея результатов
│   └── Button.tsx           # UI-кнопка
├── services/
│   └── geminiService.ts     # Интеграция с Gemini AI
├── vite.config.ts           # Конфигурация Vite
├── tsconfig.json            # Конфигурация TypeScript
└── package.json
```

---

## Quick Start

```bash
# Клонировать репозиторий
git clone https://github.com/PavelHopson/shotforge.git
cd shotforge

# Установить зависимости
npm install

# Создать .env с ключом Gemini API
cp .env.example .env
# Вписать свой GEMINI_API_KEY

# Запустить dev-сервер
npm run dev
```

Открыть `http://localhost:5173`

---

## Features

| Фича | Описание |
| :--- | :--- |
| **AI Creative Director** | Gemini AI анализирует запрос и генерирует детальный промпт с параметрами освещения, текстуры, позы |
| **6 пресетов стилей** | Old Money, Vogue Editorial, Cyberpunk Tokyo, LinkedIn Pro, Film Noir, Cinematic Adventure |
| **Тонкая настройка** | Пол, возраст, эмоция, освещение, камера, одежда — полный контроль над результатом |
| **Pro-режим** | Расширенные стили для подписчиков |

---

## Roadmap

- [x] Web-интерфейс с пресетами и конфигуратором
- [x] Интеграция Gemini AI для генерации промптов
- [ ] Реальная генерация через Flux.1 Pro / Replicate API
- [ ] Загрузка собственных фото (face swap)
- [ ] Оплата и Pro-подписка

---

## Author

**Pavel Hopson** — [GitHub](https://github.com/PavelHopson)

---

## License

MIT License. См. [LICENSE](LICENSE).