import express from "express"
import cors from "cors"
import helmet from "helmet"

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => res.json({ ok: true }))

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`API listening on :${port}`))
