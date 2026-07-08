# AI LP Generator

AIを活用してランディングページ（LP）を自動生成・編集できるWebアプリです。
業種・ターゲット・雰囲気を入力するだけで、コピーとヒーロー画像を数秒で生成し、そのまま編集・公開・ダウンロードまで行えます。

## Overview

- 生成したLPは編集・お気に入り登録・公開/非公開の切り替えが可能で、公開中のLPは固有URL（`/lp/[id]`）で共有できます
- クレジット制の従量課金＋Stripeによるサブスクリプション（Pro）課金に対応し、購入・使用履歴を通帳（取引履歴）形式で確認できます
- ダッシュボードでLP数・公開数・お気に入り数やAI利用状況をグラフで可視化します
- ダーク/ライトテーマ切り替えに対応しています

## Features

- 🤖 OpenAIによるLP構成・コピー自動生成
- 🖼️ Stability AIによるHero画像生成
- ✨ AIによるLP文章の改善
- ✏️ LP編集機能（ライブプレビュー付き）
- 📷 Hero画像変更
- ↕️ ドラッグ&ドロップによる特徴・FAQ・お客様の声の並び替え
- 🎨 テンプレート切り替え（Modern / Luxury / Minimal / Corporate）
- ⭐ お気に入り登録
- 🌐 公開/非公開の切り替えと公開URL共有
- 💳 クレジット制課金 + Stripeサブスクリプション（Pro）
- 📒 銀行の取引履歴風のクレジット利用履歴・月次統計
- 📊 ダッシュボード（LP数・公開数・お気に入り数・AI利用率の可視化）
- 📱 レスポンシブ対応 / 🌓 ダーク・ライトテーマ切り替え
- 🔗 OGP対応
- ⬇️ HTML / ZIP / 画像ダウンロード
- 🗑️ LP削除機能

## Tech Stack

**Frontend**
- Next.js 16 (App Router) / React 19 / TypeScript
- Tailwind CSS v4, shadcn/ui, Radix UI
- Framer Motion（アニメーション）, React Three Fiber / drei / postprocessing（3D演出）
- Recharts（ダッシュボードのグラフ）
- dnd-kit（ドラッグ&ドロップ並び替え）
- next-themes（ダーク/ライトテーマ）

**Backend / API**
- Next.js Route Handlers（`src/app/api/*`）
- Prisma ORM + PostgreSQL（Supabase）
- Supabase Storage（生成画像の保存）
- Zod（入力バリデーション）

**外部サービス**
- Clerk（認証・ユーザー管理）
- OpenAI API（LP構成・コピー生成、文章改善）
- Stability AI API（Hero画像生成）
- Stripe（サブスクリプション課金・Webhook）

## Architecture

```
Client (Next.js App Router / React Server & Client Components)
   │
   ├─ Clerk Middleware ── 認証セッションの検証
   │
   ▼
API Route Handlers (src/app/api/*)
   ├─ generate      … OpenAIでLP構成生成 → Stability AIでHero画像生成 → Supabase Storageへ保存
   │                   → Prismaへ保存 → クレジット消費（レート制限・失敗時は自動リファンド）
   ├─ edit / improve … 既存LPの編集・AIによる文章改善
   ├─ generation/[id]… お気に入り・公開/非公開の切り替え
   ├─ download / download-zip … HTML / ZIP 出力
   ├─ checkout       … Stripe Checkoutセッション作成
   └─ webhook        … Stripe Webhook（Pro加入・返金）→ クレジット履歴を記録
   │
   ▼
Prisma ORM ── PostgreSQL (Supabase)
```

- 認証必須のページは `src/app/(app)/*`、公開LPは `src/app/lp/[id]` に分離
- UIコンポーネントは機能単位（`components/home`, `components/dashboard`, `components/credits`, `components/pricing` など）でディレクトリ分割
- 生成系のロジックは `src/hooks`（`useGenerateLP`, `useCredits` など）にカプセル化し、UIから分離

## Database

Prisma管理下のPostgreSQL（Supabase）に4テーブル構成です。

| Model | 概要 | 主なフィールド |
| --- | --- | --- |
| `User` | Clerkユーザーに対応するアプリ内ユーザー | `clerkId`, `credits`, `isPro` |
| `Generation` | 生成されたLP1件分のデータ | `business`, `target`, `hero`, `features`, `faq`, `testimonials`, `template`, `isFavorite`, `isPublished` |
| `CreditHistory` | クレジットの増減履歴（購入・消費・返金など） | `amount`, `reason`, `createdAt` |
| `WebhookEvent` | Stripe Webhookの冪等性チェック用 | `stripeEventId` |

- `User 1 — N Generation`, `User 1 — N CreditHistory`（いずれも `onDelete: Cascade`）
- `Generation.isPublished` が `false` のLPは `/lp/[id]` からアクセス不可
- マイグレーションは `prisma/migrations` で管理

## Screenshots

（あとで画像を追加）

## Demo

デプロイURL：
https://ai-lp-generator-lemon.vercel.app/

## セットアップ

```bash
git clone ...
npm install
npm run dev
```

実行には `.env` に Clerk / OpenAI / Stability AI / Supabase / Stripe の各APIキーとDB接続情報（`DATABASE_URL`）を設定してください。

## Future

- テンプレートの追加
- PDF出力
- 多言語対応
