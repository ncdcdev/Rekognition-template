## 概要
Rekognitionお試し用コードテンプレート

## 起動方法
### 準備
`.env.local`をプロジェクトルートに作成して以下を記述
```
AWS_PROFILE={$プロファイル名}
```

### 実行
```
$ yarn
$ yarn dev
```

### 使用したAPI
- 顔検出
https://docs.aws.amazon.com/ja_jp/rekognition/latest/dg/API_DetectFaces.html

- ラベル検出
https://docs.aws.amazon.com/ja_jp/rekognition/latest/dg/labels-detect-labels-image.html

