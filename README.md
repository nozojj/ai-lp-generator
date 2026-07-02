# AI LP Generator

AIを活用してランディングページ（LP）を自動生成・編集できるWebアプリです。

## Demo

🌐 https://ai-lp-generator-lemon.vercel.app/

## スクリーンショット

（あとで画像を追加）

## Features

- 🤖 OpenAIによるLP自動生成
- 🖼️ Stability AIによるHero画像生成
- ✨ AIによるLP文章改善
- ✏️ LP編集
- 📜 LP履歴管理
- 👀 LPプレビュー
- 📦 ZIPダウンロード
- 📊 Dashboard
- ⚙️ Settings
- 💳 Pricingページ
- 🌙 ダークモード対応
- 🎨 テンプレート切り替え
- 📱 レスポンシブ対応
- 🔗 OGP対応
- 🗑️ LP削除

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma ORM
- PostgreSQL (Supabase)
- Clerk Authentication
- OpenAI API
- Stability AI API
- shadcn/ui
- dnd-kit
- Lucide React

## Development Status

🚧 Work in Progress

### Completed

- Dashboard
- History
- LP Preview
- LP Edit
- Settings
- Pricing
- Theme Toggle
- ZIP Download
- Responsive Design

### Planned

- Stripe Subscription
- Pro Plan
- Analytics
- More Templates
- PDF Export
  
## セットアップ

```bash
git clone https://github.com/nozojj/ai-lp-generator.git
cd ai-lp-generator
npm install
npm run dev
```

## Environment Variables

Create `.env.local`

```env
DATABASE_URL=
OPENAI_API_KEY=
STABILITY_API_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
OWNER_CLERK_ID=
```

