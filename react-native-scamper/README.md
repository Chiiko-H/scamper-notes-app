# SCAMPER Notes - React Native版

SCAMPERメソッドを活用した創造的思考のためのネイティブメモアプリケーション

## 概要

WebアプリケーションをベースにしたReact Native版のSCAMPER Notes Appです。iOS・Androidの両プラットフォームで利用可能です。

### 機能

- ✅ メモの作成・編集・削除
- ✅ SCAMPERメソッドによる創造的思考支援
- ✅ 進捗トラッキング機能
- ✅ ネイティブアプリの優れたユーザー体験
- ✅ オフライン対応（AsyncStorage使用）
- ✅ Material Design inspired UI

## 技術スタック

### React Native
- React 18 + TypeScript
- React Navigation 6 (画面遷移)
- React Native Paper (Material Design UI)
- AsyncStorage (ローカルデータ永続化)
- React Native Vector Icons (アイコン)

### データ管理
- AsyncStorage によるオフライン対応
- UUID による一意識別子生成
- 型安全なTypeScriptインターフェース

## セットアップ

### 前提条件
- Node.js 18以上
- React Native CLI
- Android Studio (Android開発)
- Xcode (iOS開発、macOSのみ)

### インストール

```bash
# プロジェクトディレクトリに移動
cd react-native-scamper

# 依存関係をインストール
npm install

# iOS dependencies (macOSのみ)
cd ios && pod install && cd ..
```

### 開発環境での実行

```bash
# Metro bundlerを起動
npm start

# Android エミュレーターで実行
npm run android

# iOS シミュレーターで実行 (macOSのみ)
npm run ios
```

## プロジェクト構造

```
react-native-scamper/
├── src/
│   ├── types/              # TypeScript型定義
│   ├── services/           # データ永続化サービス
│   ├── screens/            # 画面コンポーネント
│   │   ├── NoteListScreen.tsx
│   │   ├── NoteDetailScreen.tsx
│   │   └── ScamperEditorScreen.tsx
│   └── components/         # 共通UIコンポーネント
├── App.tsx                 # メインアプリケーション
├── index.js               # エントリーポイント
└── package.json
```

## 画面構成

### 1. メモ一覧画面 (NoteListScreen)
- 作成済みメモの一覧表示
- 作成日時とSCAMPER進捗の表示
- Pull-to-refresh対応
- 新規メモ作成ボタン

### 2. メモ詳細画面 (NoteDetailScreen)
- メモのタイトル・内容編集
- SCAMPER概要表示
- 保存・削除機能
- SCAMPER編集画面への遷移

### 3. SCAMPER編集画面 (ScamperEditorScreen)
- 7つの創造思考プロンプト入力
- リアルタイム進捗表示
- フィールド完了状況の視覚的表示

## データ永続化

### AsyncStorage使用
- オフライン対応
- アプリ再起動後もデータ保持
- 高速なローカルアクセス

### データ構造
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface ScamperData {
  id: string;
  noteId: string;
  substitute: string;
  combine: string;
  adapt: string;
  modify: string;
  putToOtherUse: string;
  eliminate: string;
  reverse: string;
}
```

## ビルド・リリース

### Android
```bash
# リリースビルド生成
cd android && ./gradlew assembleRelease

# APKファイルの場所
android/app/build/outputs/apk/release/app-release.apk
```

### iOS
```bash
# Xcodeでビルド
open ios/YourAppName.xcworkspace
```

## 機能比較（Web版との違い）

| 機能 | Web版 | React Native版 |
|------|-------|----------------|
| プラットフォーム | ブラウザ | iOS・Android |
| データ保存 | サーバー/ローカル | AsyncStorage |
| オフライン対応 | 限定的 | 完全対応 |
| ネイティブ感 | 制限あり | フルネイティブ |
| アプリストア配布 | 不可 | 可能 |

## 今後の拡張案

- クラウド同期機能
- プッシュ通知
- データエクスポート/インポート
- 音声入力対応
- ダークテーマ対応

## ライセンス

MIT License