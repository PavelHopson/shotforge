
<div align="center">

  <img src="https://via.placeholder.com/120/6366f1/ffffff?text=S" alt="Shotforge Logo" width="120" height="120" style="border-radius: 24px; margin-bottom: 20px;">

  # Shotforge.ai

  ### The Virtual Photo Studio. Professional photoshoot in 3 minutes for $9.

  <p align="center">
    <b>We don't generate "avatars". We engineer editorial photography.</b><br>
    Powered by <b>Gemini 3 Pro</b> (Director) & <b>Flux.1 Pro</b> (Renderer).
  </p>

  <p align="center">
    <a href="https://shotforge.ai">
      <img src="https://img.shields.io/badge/LIVE_DEMO-LAUNCH_STUDIO_→-6366f1?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Live Demo">
    </a>
    <a href="https://twitter.com/pavelhopson">
      <img src="https://img.shields.io/badge/Follow_Update-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter">
    </a>
  </p>

  ![Next.js 15](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
  ![Flux.1 Pro](https://img.shields.io/badge/AI-Flux.1_Pro-purple?style=flat-square)
  ![Gemini 3 Pro](https://img.shields.io/badge/Director-Gemini_3_Pro-blue?style=flat-square)

</div>

---

## 📸 The Problem
**Professional photography is broken.**
- 💸 **Expensive:** $2,000+ for a decent studio session.
- ⏳ **Slow:** Weeks of scheduling, shooting, and retouching.
- 😖 **Awkward:** Not everyone feels comfortable in front of a lens.

Existing AI tools (Lensa, Remini) are toys. They create cartoons or overly smoothed "plastic" faces.

## 🚀 The Solution: Shotforge
Shotforge is a **Virtual Photo Studio**. You act as the client, **Gemini 3 Pro** acts as your Creative Director, and **Flux.1 Pro** is the Photographer.

We simulate real-world physics:
*   **Lighting:** Softbox, Rim light, Golden Hour.
*   **Optics:** 85mm f/1.2 bokeh, 35mm editorial.
*   **Styling:** Old Money, Cyberpunk, Vogue Editorial.

<div align="center">
  <img src="https://via.placeholder.com/1200x600/09090b/6366f1?text=Hero+Collage:+Before+(Selfie)+vs+After+(Vogue+Cover)" alt="Shotforge Demo" style="border-radius: 10px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
</div>

---

## ✨ Key Features

| Feature | Description | Tech Stack |
| :--- | :--- | :--- |
| **AI Creative Director** | Gemini 3 Pro analyzes your request and writes complex, 300-token prompts focusing on lighting and texture. | `Google GenAI SDK` |
| **Hyper-Realistic Render** | Uses Flux.1 Pro (SOTA 2025) for skin texture that passes the Turing test. No "AI plastic look". | `Flux.1 / Replicate` |
| **Virtual Wardrobe** | Change from a Business Suit to Cyberpunk Techwear in 1 click while keeping your face identity. | `IP-Adapter` |
| **Studio Lighting** | Control the light source. Switch from "Corporate Headshot" flat light to "Film Noir" shadows. | `Prompt Engineering` |
| **Ephemeral Privacy** | Your uploaded selfies are processed in RAM and deleted from R2 storage after 24 hours. | `Cloudflare R2` |

---

## 🥊 Competitor Analysis

| Feature | 🟢 **Shotforge** | 🔴 Lensa / Avatar Apps | 🟠 Real Photographer |
| :--- | :--- | :--- | :--- |
| **Cost** | **$9 - $29** | $5 - $10 | $500 - $3,000 |
| **Time** | **3 Minutes** | 20 Minutes | 2 Weeks |
| **Realism** | **Photorealistic (Flux.1)** | Cartoon / Filters | 100% Real |
| **Control** | **Full (Light, Pose, Age)** | Random | Full |
| **Use Case** | **LinkedIn, Portfolio, Tinder** | Social Media Fun | Weddings, Events |

---

## 🛠 Tech Stack (2025 Production Ready)

This is not a pet project. This is built to scale to 1M+ users.

*   **Frontend:** Next.js 15 (App Router), React 19, TypeScript.
*   **Styling:** Tailwind CSS v4, shadcn/ui, Framer Motion (for that premium feel).
*   **AI Orchestration:** Google Gemini 3 Pro (via `@google/genai`).
*   **Image Generation:** Flux.1 Pro via Replicate/Fal.ai API.
*   **Infrastructure:** Vercel Edge Functions.

---

## ⚡ Quick Start

Want to run the studio locally?

1.  **Clone the repo**
    ```bash
    git clone https://github.com/pavelhopson/shotforge.git
    cd shotforge
    ```

2.  **Install dependencies** (We use pnpm, it's 2025)
    ```bash
    pnpm install
    ```

3.  **Set up Environment**
    Create a `.env.local` file:
    ```bash
    API_KEY=your_google_gemini_api_key
    ```

4.  **Launch**
    ```bash
    pnpm dev
    ```
    Open `http://localhost:3000` and start shooting.

---

## 🗺 Roadmap

- [x] **Phase 1: MVP** (Web Interface, Gemini Director, Basic Flux Integration)
- [ ] **Phase 2: Pro Mode** (Custom LoRA training, Manual Prompt Tweaking)
- [ ] **Phase 3: Video** (Generate 15s "Behind the scenes" videos via Runway Gen-3)
- [ ] **Phase 4: API** (White-label solution for other startups)

---

## 🤝 Contributing

We are building the future of photography.
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Pavel Hopson**
*   Tech Lead & Solution Architect
*   [Twitter / X](https://twitter.com/pavelhopson)
*   [LinkedIn](https://linkedin.com/in/pavelhopson)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<!-- 
🐰 EASTER EGG FOUND! 
You read the code? I like you.
Use code "GITHUB_DEV_2025" at checkout for 5 free 4K renders.
Hush hush. 🤫
-->
