# 🚀 Mini App Generator – Quick Commands

> Use these ready-to-copy commands to scaffold and run your mini apps.

---

## 🟢 Next.js (src/app) + Express (TS)

**Generate**
```bash
pnpm gen:mini 02 polls --full --layout=src --server=express
```

**Install**
```bash
pnpm install
```

**Run Web**
```bash
pnpm turbo run dev --filter ./apps/mini-02-polls/web
```

**Run Server**
```bash
pnpm turbo run dev --filter ./apps/mini-02-polls/server
```

---

## 🔵 Next.js (src/app) + FastAPI (Python)

**Generate**
```bash
pnpm gen:mini 03 search --full --layout=src --server=fastapi
```

**Install**
```bash
pnpm install
```

**Run Web**
```bash
pnpm turbo run dev --filter ./apps/mini-03-search/web
```

**Run Server**
```bash
pnpm turbo run dev --filter ./apps/mini-03-search/server
```

> ℹ️ First FastAPI run creates a local `.venv` and installs Python deps automatically.

---

## 🟣 Next.js only (Route Handlers; no server folder)

**Generate**
```bash
pnpm gen:mini 04 upload --full --layout=src --server=none
```

**Install**
```bash
pnpm install
```

**Run Web**
```bash
pnpm turbo run dev --filter ./apps/mini-04-upload/web
```
