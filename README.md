# Let's BINGO

## 解決したい課題

- 毎年やっているビンゴ大会が平凡
- コロナで飲み会が減ってビンゴ大会ができない

## 企画概要

忘年会などで行う大人数用用ビンゴアプリ。
プロジェクターで写すメイン画面と、参加者のスマホに表示するビンゴカード画面がある。
メイン画面で数字の抽選を行い、結果を自動でビンゴカードに反映する。

## コンセプト

新時代のビンゴ！
平凡なビンゴ大会をテクノロジーの力で新しく。
新鮮でより楽しいゲームに。

主な機能

- スマホで参加
- リモート対応
- グループモード
- ミニゲーム

コミュニケーションを促進
ドキドキをうむ駆け引き

## 新しいルール

IT の力でビンゴに新しい機能やルールを追加

- カードの数字を自由に変えられる
- ビンゴカードの自動反映
- リーチになっている人数がわかる
- グループ対戦
- ミニゲーム
- ダブルチャンス
- 複数のビンゴカード

## ペルソナ & ターゲット

- 企業の忘年会などで行われるビンゴ大会
- 個人のリモ飲み

## ユーザー種別

● 参加者(一般ユーザー)
一般ユーザー。自分のスマホにビンゴカード画面を表示してゲームに参加する。
アカウント作成不要で参加できる。

● 主催者(一般ユーザー)
ゲーム主催者。メイン画面を操作し、ゲームを進行する。
アカウントを作成して、ルームの作成・管理ができる。

● 管理者(運営ユーザー)
(未定)

## ビンゴの流れ

### 主催者

● ビンゴルームの作成

1. ルーム一覧ページに行く
2. ルーム作成ボタンをクリックして、作成画面へ遷移
3. 必要項目を入力して作成
4. 参加者を指定することで、参加メールが参加者に届く

● ビンゴ進行

1. 抽選画面を表示
2. 抽選画面に参加 QR コードを表示して参加を募る
3. 参加者が集まったら、ゲーム開始
4. 一回ずつ抽選を行う
5. ビンゴが出たら、景品を渡す

### 参加者

1. メイン画面な表示された QR コードをスマホで読み取り、サイトへアクセスする。
2. ビンゴカード画面が表示される、
3. 自分の名前とメッセージを入力してエントリーする。
4. ビンゴカード編集画面になり、カードを好きな数字に編集する。
5. 編集が終わったら、ビンゴカードを確定。
6. ビンゴが始まるまで待つ。
7. ビンゴが始まったら、ビンゴを楽しむ。

## 画面仕様　

### 画面一覧

- 抽選画面
- ビンゴカード画面
- ルーム一覧画面
- ルーム作成画面
- 新規登録画面
- ログイン画面

#### 抽選画面

主催者がビンゴを抽選するための画面。

基本機能

- 抽選機能
- 既出数字表示機能

操作機能

- UNDO/REDO
- 中断・保存
- 終了

各種集計機能

- 参加者数
- リーチ数
- ビンゴ数

各種一覧の表示

- 参加者一覧
- 景品一覧 (景品管理)
- 抽選履歴

- 参加 URL の QR コード表示
- 参加者がビンゴになったら通知

#### ビンゴカード画面

基本機能

- ビンゴカード表示機能
- ルーム詳細表示
- エントリー機能

- 抽選結果反映の自動・手動切り替え
- ビンゴカード編集機能(シャッフル/数字指定)
- カードカラーの変更(グループビンゴではチーム分けに使う)

各種一覧の表示

- 参加者一覧
- 景品一覧
- 抽選履歴

## TODO & やりたいこと

### ビンゴカード画面

- ビンゴ編集画面での数字入力のバリデーションを追加
- スマホでフルスクリーン表示(WPA)

### 抽選画面

- UNDO/REDO を実装
- リセットボタン実装

### ルーム一覧画面

- 作成したルーム一覧
- 参加履歴一覧
- 招待されたルーム一覧

- ルームの編集/削除

### ルーム作成画面

- 景品の追加
- 参加者事前登録 (参加メール送信)

### その他

- グループ対戦
- ミニゲーム
- ランディングページ
- 新規登録/ログイン/ログアウト
- セキュリティ設定
