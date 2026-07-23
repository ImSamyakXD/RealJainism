<div align="center">

<img src="public/assets/images/app_logo.png" alt="RealJainism logo" width="120" />

# 🕉️ RealJainism

### Your Complete Jain Spiritual Companion

**Daily Panchang · Devotional Wallpapers · Ringtones · Community**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)
[![License](https://img.shields.io/badge/License-Private-lightgrey?style=flat-square)]()

[Live Site](#) · [Report a Bug](https://t.me/real_jainism) · [Join Community](https://t.me/real_jainism)

</div>

<br />

---

## ✨ About

**RealJainism** is a modern web platform built to serve the Jain community with daily
spiritual essentials in one clean, fast, mobile-first experience. It brings together the
**daily Panchang** (lunar calendar with tithi and kalyanak data), a curated library of
**devotional wallpapers and ringtones**, and direct links into the community's **Telegram
channel and bot** — all wrapped in a warm, gold-accented design language that reflects the
serenity of Jain temple aesthetics.

The goal is simple: give practitioners a single, reliable place to check today's tithi,
download something beautiful for their phone, and stay connected with the community —
without clutter, without noise.

<br />

## 🪔 Features

### 📿 Daily Panchang
A structured lunar calendar view showing:
- **Tithi** for the day, including correct handling of **double-tithi (kshaya/vridhi) days**
- **Panch Kalyanak** events across all **24 Tirthankars**
- Sunrise / sunset and other daily almanac details
- Support for both **Gujarati Amanta** and **Purnimanta** month-naming conventions

### 🖼️ Wallpapers
A growing gallery of high-resolution devotional wallpapers — temple art, mandalas, and
sacred symbols — served and optimized through **Cloudinary**, with one-tap download for
mobile.

### 🎵 Ringtones
A curated collection of stavans, mantras, and aarti dhuns (including the Navkar Mantra)
with **in-browser playback** and direct MP3 downloads, also served via Cloudinary.

### 🤝 Community
Direct integration with the RealJainism **Telegram Channel** and **Telegram Bot**, plus an
on-site contact form for feedback, content takedown requests, or content submissions.

<br />

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + `tailwindcss-animate` |
| **Icons** | [Heroicons](https://heroicons.com/) / [Lucide](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Media CDN** | [Cloudinary](https://cloudinary.com/) (Admin API, server-side) |
| **Deployment** | [Netlify](https://www.netlify.com/) (`@netlify/plugin-nextjs`) |
| **Linting/Formatting** | ESLint + Prettier |

<br />

## 📁 Project Structure

```
Realjainism/
├── public/
│   └── assets/images/          # Static brand assets (logo, favicon)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── wallpapers/     # GET — Cloudinary wallpapers by tag
│   │   │   └── ringtones/      # GET — Cloudinary ringtones by tag
│   │   ├── components/         # Homepage sections (Hero, Features, Community, Contact)
│   │   ├── panchang/           # Daily Panchang page + client component
│   │   ├── wallpapers/         # Wallpapers & Ringtones page + client component
│   │   ├── layout.tsx          # Root layout, fonts, metadata
│   │   ├── page.tsx            # Homepage
│   │   ├── not-found.tsx       # Custom 404
│   │   ├── robots.ts           # robots.txt generation
│   │   └── sitemap.ts          # sitemap.xml generation
│   ├── components/
│   │   ├── Header.tsx / Footer.tsx
│   │   └── ui/                 # AppIcon, AppImage, AppLogo — shared primitives
│   ├── lib/
│   │   └── cloudinary.ts       # Server-only Cloudinary Admin API config
│   └── styles/                 # Global + Tailwind CSS
├── .env.local.example          # Environment variable template
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

<br />

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.18+ (LTS recommended)
- **npm** (bundled with Node)
- A **Cloudinary** account with wallpapers tagged `wallpaper` and ringtones tagged `ringtone`

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd Realjainism

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
```

Then open `.env.local` and fill in your Cloudinary credentials (found on your
[Cloudinary dashboard](https://console.cloudinary.com/console)):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ **Never commit `.env.local`.** It contains your Cloudinary API secret and is already
> excluded via `.gitignore`.

### Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:4028**.

<br />

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server (port `4028`) |
| `npm run build` | Create an optimized production build |
| `npm run start` | Alias for `npm run dev` (starts the dev server, not a production server) |
| `npm run serve` | Serve the production build (`next start`) |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format the codebase with Prettier |
| `npm run type-check` | Run TypeScript in `--noEmit` mode |

<br />

## ☁️ Cloudinary Setup

Wallpapers and ringtones are **not stored in this repo** — they're fetched live from
Cloudinary via two server-side API routes, so the credentials never reach the browser.

| Route | Resource type | Required tag | Returns |
|---|---|---|---|
| `/api/wallpapers` | `image` | `wallpaper` | Image URL, dimensions, format, display name |
| `/api/ringtones` | `video` *(Cloudinary stores audio under `video`)* | `ringtone` | Audio URL, duration, category, display name |

**To add new media:**
1. Upload the file to your Cloudinary media library.
2. Add the tag `wallpaper` or `ringtone`.
3. *(Optional)* Add **context metadata** for nicer display:
   - `display_name` — shown as the title instead of the raw filename
   - `category` — shown as a label on ringtones (e.g. `Stavan`, `Mantra`, `Aarti`)

New uploads appear automatically — no code changes or redeploys required. Responses are
cached for one hour (`revalidate = 3600`) to keep load times fast.

<br />

## 🎨 Design Philosophy

RealJainism's visual identity draws from Jain temple architecture and manuscript
art — warm gold gradients, generous whitespace, and rounded, tactile UI elements. Typography
is set in **Plus Jakarta Sans** for a friendly yet modern feel that stays legible across
Hindi/Gujarati and English content (`lang="hi"` root, with English UI copy). Every
interactive element targets a **44px minimum tap area** for comfortable use on mobile,
which is where the majority of the community accesses the site.

<br />

## 🤝 Contributing & Content

RealJainism aggregates devotional media (images and audio) from various free and open
sources. Ownership or copyright of individual assets is **not claimed** by RealJainism. If
you believe any content infringes your rights or should be removed, please reach out via
the [Contact section](#) on the site, or message us directly:

- 📢 **Telegram Channel:** [t.me/real_jainism](https://t.me/real_jainism)
- 🤖 **Telegram Bot:** [t.me/real_jainism_bot](https://t.me/real_jainism_bot)

<br />

## 🗺️ Roadmap

- [ ] Expand the ringtone library with more Stavans, Stutis, and Aarti Dhuns
- [ ] Push notifications for daily tithi and kalyanak reminders
- [ ] Multi-language support (Hindi / Gujarati UI toggle)
- [ ] User-submitted wallpaper uploads with moderation queue
- [ ] Offline-first PWA support for the Panchang page

<br />

## 📄 License

This project is private and proprietary to RealJainism. All rights reserved unless
otherwise noted.

<br />

---

<div align="center">

Made with 🙏 for the Jain community

</div>
