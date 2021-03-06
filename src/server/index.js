import { urlencoded, json } from "body-parser"
import cloudinary from "cloudinary"
import cookieParser from "cookie-parser"
// import cors from 'cors'
import express from "express"
import mongoose from "mongoose"
import { Nuxt, Builder } from "nuxt"

import config from "../../nuxt.config"
import apiRoutes from "./api"

const app = express()

// Global middleware
// only allow http://127.0.0.1:3000 and http://localhost:3000
// only allow process.env.API_URL, process.env.SERVER_API_URL, and process.env.PAGE_URL
// app.use(cors({
//   origin: process.env.NOW_URL // fix this.
// }))
app.use(urlencoded({ extended: false }))
app.use(json())
app.use(cookieParser())

// Import API Routes
app.use("/api", apiRoutes)

config.dev = !(process.env.NODE_ENV === "production")

// Init Nuxt.js
const nuxt = new Nuxt(config)
const PORT = process.env.PORT || 8100
const HOST = process.env.HOST || "localhost"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// setup the database connection
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
  .catch((err) => {
    console.warn("err at mongo connect", err.message)
  })

app.listen(PORT, HOST, err => {
  if (err) {
    console.log(err)
  }
  console.log(`Server listening on http://${HOST}:${PORT}`)
})

export default app
