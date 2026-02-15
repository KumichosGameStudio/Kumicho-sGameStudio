# Novel Voice Hub (MVP)

小説家志望と声優/ナレーター志望をつなぐ Web サービスの MVP です。  
Next.js + Supabase(Auth/DB/Storage) で実装しています。

## 機能
- Google ログイン（Supabase Auth）
- ロール選択（小説家 / 声優・ナレーター）
- 小説投稿
- 既存小説に紐づく音声投稿（文字起こし必須）
- トップの日次ランダムピックアップ（daily_picks テーブル）
- ジャンル一覧、検索、プロフィール

## 技術スタック
- Next.js 14 (App Router / TypeScript)
- Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- Vercel デプロイ想定

## ディレクトリ
- `src/app`: ページルーティング
- `src/lib`: Supabase クライアント、データ取得
- `supabase/schema.sql`: DBスキーマ + RLS + Storage policy

## MVPとしての仮定
- 音声 URL は **public bucket** で公開 URL を使用（実装簡略化・再生の安定性優先）。
- `daily_picks` は JST 日付ごとに初回アクセス時生成。
- 検索の作者名一致はMVP簡略化のため現状はタイトル/概要中心（拡張可能）。

## 1) 環境変数
`.env.local` を作成:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 2) Supabase セットアップ
1. Supabase プロジェクト作成
2. SQL Editor で `supabase/schema.sql` を実行
3. Auth > Providers で Google を有効化
4. Google OAuth 側にリダイレクトURLを設定
   - `http://localhost:3000/auth/callback`
   - `https://YOUR_VERCEL_DOMAIN/auth/callback`
5. Supabase Auth URL設定
   - Site URL: `http://localhost:3000` (本番はVercel URL)
   - Redirect URLs: 上記 callback URL

## 3) ローカル起動
```bash
npm install
npm run dev
```

ブラウザ: `http://localhost:3000`

## 4) Vercel デプロイ
1. GitHub に push
2. Vercel で Import Project
3. 環境変数 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) を設定
4. Deploy
5. Supabase/Google OAuth の callback URL に本番ドメインを追加

## 5) 主要ルート
- `/` トップ（日次ランダム）
- `/genres` ジャンル別一覧
- `/search` 検索
- `/novels/[id]` 小説詳細
- `/audios/[id]` 音声詳細
- `/u/[handle]` プロフィール
- `/submit/novel` 小説投稿
- `/submit/audio` 音声投稿
- `/onboarding` 初回ロール登録

## 補足
- RLSは最低限の制御を実装済み。
- 投稿系は必ずログインが必要。
- 音声投稿は narrator ロールのみ。
