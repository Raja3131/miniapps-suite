import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pad2 = n => String(parseInt(n, 10)).padStart(2, "0")
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

function copyDir(src, dst, rep) {
  if (!fs.existsSync(src)) {
    throw new Error(`Template not found: ${src}`)
  }
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true })
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name)
    const d = path.join(
      dst,
      e.name
        .replace(/__APP_SLUG__/g, rep.APP_SLUG)
        .replace(/__APP_NUM__/g, rep.APP_NUM)
    )
    if (e.isDirectory()) copyDir(s, d, rep)
    else {
      let c = fs.readFileSync(s, "utf8")
      for (const [k, v] of Object.entries(rep)) c = c.replace(new RegExp(`__${k}__`, "g"), v)
      fs.mkdirSync(path.dirname(d), { recursive: true })
      fs.writeFileSync(d, c)
    }
  }
}

function parseFlags(args) {
  const flags = {}
  for (const a of args) {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/)
    if (m) flags[m[1]] = m[2] ?? true
  }
  return flags
}

const [, , numArg, nameArg, ...rest] = process.argv
if (!numArg || !nameArg) {
  console.error("Usage: pnpm gen:mini <num> <name> [--full] [--stack=next|next-api|vite] [--layout=src|root] [--server=express|fastapi|none]")
  process.exit(1)
}

const FLAGS = parseFlags(rest)
const APP_NUM  = pad2(numArg)
const APP_SLUG = slug(nameArg)
const full     = FLAGS.full === true || rest.includes("--full")

// Back-compat: if --stack used, infer defaults
const stackArg  = FLAGS.stack || "next"       // next | next-api | vite
const layoutArg = FLAGS.layout || "src"       // src | root
let   serverArg = FLAGS.server                // express | fastapi | none

if (!serverArg) {
  if (stackArg === "next-api") serverArg = "none"
  else if (stackArg === "vite") serverArg = "express"
  else serverArg = "express" // default for 'next'
}

const appRoot   = path.join(process.cwd(), "apps", `mini-${APP_NUM}-${APP_SLUG}`)
const webDir    = path.join(appRoot, "web")
const serverDir = path.join(appRoot, "server")

if (fs.existsSync(appRoot)) {
  console.error("App already exists:", appRoot)
  process.exit(1)
}

const tplRoot = path.join(__dirname, "templates")

// Decide web template
function pickWebTemplate() {
  if (stackArg === "vite") return "web-vite"
  if (layoutArg === "src" && fs.existsSync(path.join(tplRoot, "web-next-src"))) return "web-next-src"
  return "web-next" // fallback to classic app/ layout if src/ variant isn't present
}

// Decide server template (and tolerate either folder name you have)
function pickServerTemplate(choice) {
  if (choice === "none") return null
  if (choice === "fastapi") return "server-fastapi"
  // express:
  const expressTs = path.join(tplRoot, "server-express-ts")
  if (fs.existsSync(expressTs)) return "server-express-ts"
  return "server-express" // your existing folder name
}

const webTpl    = pickWebTemplate()
const serverTpl = pickServerTemplate(serverArg)

try {
  if (full) {
    copyDir(path.join(tplRoot, webTpl), webDir, { APP_NUM, APP_SLUG })
    if (serverTpl) copyDir(path.join(tplRoot, serverTpl), serverDir, { APP_NUM, APP_SLUG })
  } else {
    fs.mkdirSync(webDir, { recursive: true })
    if (serverTpl) fs.mkdirSync(serverDir, { recursive: true })
    fs.writeFileSync(path.join(webDir, "README.md"), `# mini-${APP_NUM}-${APP_SLUG} web\n`)
    if (serverTpl) fs.writeFileSync(path.join(serverDir, "README.md"), `# mini-${APP_NUM}-${APP_SLUG} server\n`)
  }
  console.log(`Created apps/mini-${APP_NUM}-${APP_SLUG} web=${webTpl} server=${serverTpl ?? "none"} ${full ? "(full)" : ""}`)
} catch (err) {
  console.error("Failed to generate:", err.message)
  process.exit(1)
}
