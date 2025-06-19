# SCAMPER Notes App

SCAMPERメソッドを活用した創造的思考のためのメモアプリケーション

## 概要

SCAMPER Notes Appは、創造的思考法「SCAMPER」を統合したメモ管理アプリケーションです。アイデアを整理し、7つの異なる視点から発展させることができます。

### SCAMPERとは
- **S**ubstitute (置き換え)
- **C**ombine (組み合わせ)
- **A**dapt (適応)
- **M**odify (修正)
- **P**ut to other use (転用)
- **E**liminate (除去)
- **R**everse (逆転)

## 機能

- ✅ メモの作成・編集・削除
- ✅ SCAMPERメソッドによる創造的思考支援
- ✅ 進捗トラッキング機能
- ✅ モバイルファーストレスポンシブデザイン
- ✅ 日本語対応UI

## 技術スタック

### フロントエンド
- React 18 + TypeScript
- Vite (ビルドツール)
- Wouter (ルーティング)
- TanStack Query (状態管理)
- Shadcn/ui + Tailwind CSS (UI)

### バックエンド
- Node.js + Express.js + TypeScript
- Drizzle ORM
- PostgreSQL対応 (開発時はインメモリストレージ)

## セットアップ

### 前提条件
- Node.js 20以上
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/scamper-notes-app.git
cd scamper-notes-app

# 依存関係をインストール
npm install
```

### 開発環境での実行

```bash
# 開発サーバーを起動
npm run dev
```

アプリケーションは `http://localhost:5000` で起動します。

### 本番ビルド

```bash
# フロントエンドとバックエンドをビルド
npm run build

# 本番サーバーを起動
npm start
```

## プロジェクト構造

```
.
├── client/                 # フロントエンドコード
│   ├── src/
│   │   ├── components/     # UIコンポーネント
│   │   ├── pages/          # ページコンポーネント
│   │   ├── lib/            # ユーティリティ
│   │   └── hooks/          # カスタムフック
│   └── index.html
├── server/                 # バックエンドコード
│   ├── index.ts           # サーバーエントリーポイント
│   ├── routes.ts          # APIルート
│   └── storage.ts         # データストレージ
├── shared/                # 共有スキーマ
│   └── schema.ts
└── README.md
```

## API エンドポイント

### メモ管理
- `GET /api/notes` - 全メモ取得
- `GET /api/notes/:id` - 単一メモ取得
- `POST /api/notes` - メモ作成
- `PATCH /api/notes/:id` - メモ更新
- `DELETE /api/notes/:id` - メモ削除

### SCAMPER管理
- `GET /api/notes/:id/scamper` - SCAMPERデータ取得
- `POST /api/notes/:id/scamper` - SCAMPERデータ保存

## 環境変数

本番環境では以下の環境変数を設定してください：

```bash
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
```

## デプロイ

このアプリケーションはReplit、Vercel、Heroku等のプラットフォームにデプロイ可能です。

### Replitでのデプロイ
1. Replitにインポート
2. デプロイボタンをクリック
3. 自動的に`.replit.app`ドメインでアクセス可能

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

---

このアプリケーションは創造的思考を促進し、アイデアの発展を支援することを目的としています。