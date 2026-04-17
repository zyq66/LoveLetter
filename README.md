# LoveLetter 💌

[中文](README_CN.md) | **English**

> A private space built for two — capture every precious moment, and let love leave its trace every day.

---

## What is LoveLetter?

**LoveLetter** is a private mobile app built exclusively for couples. Unlike social platforms, it belongs only to the two of you. From your very first day together to every anniversary, from daily moods to a heartfelt message late at night — LoveLetter gives your relationship a place to breathe and be remembered.

---

## Why LoveLetter?

Most messaging apps are built for the world. LoveLetter is built for two.

There are no followers, no likes, no public feeds — just a quiet, intimate space where two people can be fully present with each other. Every photo, every note, every small moment is yours alone.

---

## Features

**💬 Private Messaging** — Real-time chat with mood tags, image sharing, emoji reactions, and an AI love-letter generator that writes what you can't find words for.

**📔 Memory Journal** — A timeline of shared moments, each with photos, captions, and mood stamps. Your story, told in your own words.

**📸 Shared Album** — A private photo album that syncs in real time. No cloud confusion, no mixed galleries.

**💝 Partner Profile** — Record your partner's birthday, blood type, MBTI, favorite foods, habits, hobbies, and more. A living portrait of the person you love.

**🗓 Anniversary Tracker** — Every day together is counted. Important dates surface before they slip by.

**🤖 AI Companion** —  Generates love letters, sparks conversation topics, reads the mood, and sends sweet wishes — so there's always something meaningful to say.

---

## Tech Stack


|           |                                              |
| --------- | -------------------------------------------- |
| Framework | React Native + Expo SDK 54 (TypeScript)      |
| Backend   | Tencent CloudBase — DB · Storage · Functions |
| AI        | DeepSeek API via serverless proxy            |
| Build     | EAS Build (Android APK)                      |


> All runtime traffic routes through Tencent Cloud domestic nodes — stable and fully accessible within mainland China.

---

## Getting Started

```bash
npm install
npm start        # Expo dev server
npm run build    # EAS Android APK
```

**Required config:**

- `src/config/cloudbase.ts` — TCB environment ID
- `src/services/storage.ts` — TCB storage domain
- `functions/ai-proxy/` — Deploy to TCB console; set `DEEPSEEK_API_KEY` env var and 20s timeout

---

## License

Private repository. All rights reserved.