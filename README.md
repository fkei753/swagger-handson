# 🔄 Swagger Hands-on: 型安全なフルスタック開発

**Spring Boot (Java) + Next.js (TypeScript) + OpenAPI/Swagger**

Backend で定義した API から Swagger (OpenAPI) 仕様を自動生成し、その定義を使って Frontend の TypeScript クライアントコードを自動生成する、型安全なフルスタックアプリケーションのハンズオンです。

---

## 📖 目次

1. [全体アーキテクチャ](#-全体アーキテクチャ)
2. [前提条件](#-前提条件)
3. [クイックスタート](#-クイックスタート)
4. [ハンズオン手順](#-ハンズオン手順)
   - [Step 1: Backend の理解](#step-1-backend-の理解)
   - [Step 2: Swagger UI の確認](#step-2-swagger-ui-の確認)
   - [Step 3: OpenAPI 仕様の確認](#step-3-openapi-仕様の確認)
   - [Step 4: TypeScript クライアント生成](#step-4-typescript-クライアント生成)
   - [Step 5: Frontend から API を呼び出す](#step-5-frontend-から-api-を呼び出す)
   - [Step 6: 型安全の恩恵を体験](#step-6-型安全の恩恵を体験)
5. [プロジェクト構成](#-プロジェクト構成)
6. [技術スタック](#-技術スタック)
7. [演習課題](#-演習課題)

---

## 🏗 全体アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                      開発フロー                              │
│                                                             │
│  ① Java コードに OpenAPI アノテーション付与                    │
│     ↓                                                       │
│  ② Spring Boot 起動 → OpenAPI JSON 自動生成                  │
│     (http://localhost:8080/api-docs)                         │
│     ↓                                                       │
│  ③ openapi-typescript-codegen で TypeScript 型・Client 生成  │
│     ↓                                                       │
│  ④ Next.js Frontend で型安全に API 呼び出し                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐     OpenAPI JSON      ┌──────────────────┐
│  Spring Boot │ ──────────────────►  │  openapi-ts-     │
│  Backend     │  /api-docs            │  codegen         │
│  :8080       │                       │                  │
│              │◄──── REST API ─────── │  Next.js         │
│  Swagger UI  │                       │  Frontend :3000  │
│  /swagger-ui │                       │                  │
└──────────────┘                       └──────────────────┘
```

### 🔑 ポイント

- **Backend が Single Source of Truth（唯一の情報源）**
- Java のモデルクラス・コントローラーに付与したアノテーションから OpenAPI 仕様が**自動生成**される
- その仕様から TypeScript の型・API クライアントが**自動生成**される
- Backend の API を変更すると、Frontend 側のコードで**コンパイルエラー**として検出できる

---

## 📋 前提条件

| ツール     | バージョン  | 確認コマンド         |
|-----------|-----------|-------------------|
| Java (JDK) | 17 以上   | `java -version`   |
| Node.js    | 18 以上   | `node -v`         |
| npm        | 9 以上    | `npm -v`          |
| Git        | 任意      | `git --version`   |

---

## 🚀 クイックスタート

### 1. リポジトリをクローン

```bash
git clone https://github.com/<your-username>/swagger-handson.git
cd swagger-handson
```

### 2. Backend を起動

```bash
cd backend
./gradlew bootRun
```

起動すると以下にアクセスできます:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

### 3. Frontend の API クライアントを生成

```bash
cd frontend
npm install
npm run generate-api
```

### 4. Frontend を起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが表示されます。

---

## 📝 ハンズオン手順

### Step 1: Backend の理解

まず Backend のコードを見て、OpenAPI アノテーションがどのように使われているか確認しましょう。

#### モデルクラス（`backend/src/main/java/com/example/swagger/model/Task.java`）

```java
@Schema(description = "タスク情報")
public class Task {

    @Schema(description = "タスクID", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "タイトルは必須です")
    @Size(min = 1, max = 200)
    @Schema(description = "タスクのタイトル", example = "Swagger定義を作成する",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @NotNull(message = "ステータスは必須です")
    @Schema(description = "タスクの状態", example = "TODO",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private TaskStatus status;
    // ...
}
```

**主なアノテーション:**

| アノテーション | 役割 |
|-------------|------|
| `@Schema` | モデルフィールドの説明・例・必須/読み取り専用の指定 |
| `@NotBlank`, `@NotNull` | バリデーション（Swagger にも反映） |
| `@Size`, `@Email` | 制約条件の指定 |

#### コントローラー（`backend/src/main/java/com/example/swagger/controller/TaskController.java`）

```java
@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "タスク管理API")
public class TaskController {

    @GetMapping
    @Operation(summary = "タスク一覧取得",
               description = "タスクの一覧を取得します。ステータスや優先度でフィルタリング可能です。")
    @ApiResponse(responseCode = "200", description = "取得成功")
    public ResponseEntity<List<Task>> getAllTasks(
            @Parameter(description = "ステータスでフィルタ")
            @RequestParam(required = false) TaskStatus status) {
        // ...
    }
}
```

**主なアノテーション:**

| アノテーション | 役割 |
|-------------|------|
| `@Tag` | API グループ名の指定 |
| `@Operation` | エンドポイントの概要・説明 |
| `@ApiResponse` | レスポンスのステータスコードと説明 |
| `@Parameter` | パラメーターの説明 |

---

### Step 2: Swagger UI の確認

Backend を起動した状態で http://localhost:8080/swagger-ui.html にアクセスしてください。

![Swagger UI](https://swagger.io/swagger/media/assets/images/swagger_logo.svg)

Swagger UI では以下のことができます:

1. **API 一覧の閲覧** → Tags（Users, Tasks）ごとにグループ化
2. **各エンドポイントの詳細確認** → パラメーター、リクエストボディ、レスポンス
3. **Try it out** → ブラウザから直接 API を実行
4. **Schemas の確認** → モデルの定義（型、制約、説明）

**✅ やってみよう:**
- `GET /api/tasks` を「Try it out」で実行して、レスポンスを確認
- `POST /api/tasks` でバリデーションエラーを発生させてみる（タイトルを空にして送信）

---

### Step 3: OpenAPI 仕様の確認

http://localhost:8080/api-docs にアクセスすると、JSON 形式の OpenAPI 仕様が表示されます。

```bash
# ターミナルから確認
curl -s http://localhost:8080/api-docs | python3 -m json.tool
```

この JSON が以下の情報を含んでいます:
- API のメタ情報（タイトル、バージョン、サーバー情報）
- 各エンドポイントのパス・メソッド・パラメーター・リクエスト/レスポンスの型
- モデルの Schema 定義（フィールド名、型、制約、enum 値）

---

### Step 4: TypeScript クライアント生成

OpenAPI 仕様から TypeScript のクライアントコードを自動生成します。

```bash
cd frontend
npm run generate-api
```

このコマンドは以下を実行します:

```
openapi --input http://localhost:8080/api-docs --output src/generated/api --client fetch
```

生成されるファイル:

```
src/generated/api/
├── core/              # HTTP クライアントの基盤
│   ├── ApiError.ts
│   ├── ApiRequestOptions.ts
│   ├── ApiResult.ts
│   ├── CancelablePromise.ts
│   ├── OpenAPI.ts
│   └── request.ts
├── models/            # ← Backend のモデルがそのまま TypeScript の型に！
│   ├── ApiError.ts
│   ├── Task.ts        # Task 型 + TaskStatus/TaskPriority enum
│   └── User.ts        # User 型
├── services/          # ← Backend のコントローラーがそのまま API クライアントに！
│   ├── TasksService.ts
│   └── UsersService.ts
└── index.ts
```

#### 生成された型の例（`Task.ts`）

```typescript
export type Task = {
    readonly id?: number;           // READ_ONLY → readonly
    title: string;                  // REQUIRED → 必須プロパティ
    description?: string;           // オプション → ?
    status: Task.status;            // enum 型
    priority: Task.priority;        // enum 型
    assigneeId?: number;
    readonly createdAt?: string;    // READ_ONLY → readonly
    readonly updatedAt?: string;
};

export namespace Task {
    export enum status {
        TODO = 'TODO',
        IN_PROGRESS = 'IN_PROGRESS',
        IN_REVIEW = 'IN_REVIEW',
        DONE = 'DONE',
    }
    export enum priority {
        LOW = 'LOW',
        MEDIUM = 'MEDIUM',
        HIGH = 'HIGH',
        CRITICAL = 'CRITICAL',
    }
}
```

**🔑 Backend の Java コードが TypeScript の型として忠実に再現されている点に注目！**

---

### Step 5: Frontend から API を呼び出す

生成されたクライアントを使って、Frontend から型安全に API を呼び出します。

#### API ベース URL の設定

```typescript
import { OpenAPI } from "@/generated/api/core/OpenAPI";

OpenAPI.BASE = "http://localhost:8080";
```

#### タスク一覧の取得

```typescript
import { TasksService } from "@/generated/api/services/TasksService";
import type { Task } from "@/generated/api/models/Task";

// 型安全！戻り値は Task[] と推論される
const tasks: Task[] = await TasksService.getAllTasks();

// フィルタリングも型安全（引数の型が自動生成されている）
const todoTasks = await TasksService.getAllTasks("TODO");
```

#### タスクの作成

```typescript
// Task 型に従ったオブジェクトを渡す（型チェックが効く）
const newTask: Task = {
  title: "新しいタスク",
  status: Task.status.TODO,       // enum で安全に指定
  priority: Task.priority.HIGH,   // enum で安全に指定
  description: "説明文",
};

await TasksService.createTask(newTask);
```

---

### Step 6: 型安全の恩恵を体験

ここが最も重要なポイントです。Backend の API 定義が変更された場合に何が起こるかを体験しましょう。

#### 演習: Backend にフィールドを追加してみる

1. **Backend** の `Task.java` に新しいフィールドを追加:

```java
@Schema(description = "期限日", example = "2024-12-31")
private LocalDate dueDate;
```

2. Backend を再起動:

```bash
cd backend && ./gradlew bootRun
```

3. Frontend のクライアントを再生成:

```bash
cd frontend && npm run generate-api
```

4. 生成された `Task.ts` を確認すると、`dueDate` フィールドが追加されている！

5. Frontend で `dueDate` を型安全に参照可能に！
   - `task.dueDate` が TypeScript の補完で表示される
   - `task.duedat`（typo）はコンパイルエラーになる

---

## 📁 プロジェクト構成

```
swagger-handson/
├── README.md                      # このファイル（ハンズオン資料）
├── .gitignore
│
├── backend/                       # Spring Boot (Java)
│   ├── build.gradle               # Gradle ビルド設定
│   ├── settings.gradle
│   ├── gradlew / gradlew.bat      # Gradle Wrapper
│   └── src/main/java/com/example/swagger/
│       ├── SwaggerHandsonApplication.java  # メインクラス
│       ├── config/
│       │   ├── OpenApiConfig.java          # OpenAPI 設定
│       │   └── WebConfig.java              # CORS 設定
│       ├── controller/
│       │   ├── TaskController.java         # タスク API
│       │   └── UserController.java         # ユーザー API
│       └── model/
│           ├── Task.java                   # タスクモデル
│           ├── TaskStatus.java             # ステータス enum
│           ├── TaskPriority.java           # 優先度 enum
│           ├── User.java                   # ユーザーモデル
│           └── ApiError.java               # エラーレスポンス
│
├── frontend/                      # Next.js (TypeScript)
│   ├── package.json
│   ├── tsconfig.json
│   ├── openapi.json               # 取得した OpenAPI 仕様
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx            # メインページ
│       │   └── globals.css
│       ├── components/
│       │   ├── TaskList.tsx        # タスク一覧
│       │   ├── TaskForm.tsx        # タスク作成フォーム
│       │   └── UserList.tsx        # ユーザー一覧
│       └── generated/             # ← 自動生成されるコード
│           └── api/
│               ├── core/           # HTTP 基盤
│               ├── models/         # TypeScript 型定義
│               └── services/       # API クライアント
```

---

## 🛠 技術スタック

### Backend
| 技術 | バージョン | 用途 |
|------|----------|------|
| Java | 17+ | 言語 |
| Spring Boot | 3.4.x | Web フレームワーク |
| SpringDoc OpenAPI | 2.5.0 | OpenAPI 仕様自動生成 |
| Gradle | 8.7 | ビルドツール |

### Frontend
| 技術 | バージョン | 用途 |
|------|----------|------|
| Next.js | 16.x (App Router) | React フレームワーク |
| TypeScript | 5.x | 言語 |
| Tailwind CSS | 4.x | スタイリング |
| openapi-typescript-codegen | 0.30.x | TypeScript クライアント生成 |

---

## 🏋️ 演習課題

### 課題 1: 新しい API エンドポイントの追加

Backend に `GET /api/tasks/stats` を追加して、ステータスごとのタスク数を返す API を作成してください。

<details>
<summary>ヒント</summary>

1. レスポンス用の新しいモデルクラス `TaskStats.java` を作成
2. `TaskController` に新しいエンドポイントを追加
3. Frontend で `npm run generate-api` を実行
4. 生成された `TasksService` に新しいメソッドが追加されることを確認

</details>

### 課題 2: バリデーションの追加

Task モデルに `dueDate`（期限日）フィールドを追加し、以下を実装してください:
- `@FutureOrPresent` アノテーションで過去日を拒否
- Frontend で期限日を表示・入力できるようにする

### 課題 3: エラーハンドリングの強化

Backend に `@ControllerAdvice` を追加して、バリデーションエラーを統一的なフォーマットで返すようにしてください。

---

## 📚 参考リンク

- [SpringDoc OpenAPI 公式ドキュメント](https://springdoc.org/)
- [OpenAPI 3.0 仕様](https://swagger.io/specification/)
- [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)
- [Spring Boot 公式](https://spring.io/projects/spring-boot)
- [Next.js 公式](https://nextjs.org/)

---

## 📝 ライセンス

MIT License
