const path = require("path")

require("dotenv").config({
  silent: true,
  path: ".env"
})

const PORT = process.env.PORT || 8100
const HOST = process.env.HOST || "localhost"
const BASE_URL = process.env.API_URL || `http://${HOST}:${PORT}/`

module.exports = {
  auth: {
    redirect: {
      login: "/signin",
      logout: "/",
      callback: "/signin",
      home: "/"
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: "/api/auth/login", method: "post", propertyName: "token" },
          logout: { url: "/api/auth/logout", method: "post" },
          user: { url: "/api/auth/user", method: "get", propertyName: "user" }
        }
      }
    },
    token: {
      prefix: "_96token."
    },
    cookie: {
      prefix: "96auth."
    },
    localStorage: {
      prefix: "96auth."
    },
    resetOnError: true
  },
  axios: {
    proxy: true,
    baseURL: BASE_URL
  },
  proxy: {
    "/api": BASE_URL
  },
  build: {
    extractCSS: true,
    extend (config) {
      config.devtool = false
    }
  },
  buildDir: "dist/client",
  cache: true,
  css: [
    // { src: 'vuetify/dist/vuetify.min.css', lang: 'css' },
    { src: "~/assets/style/app.styl", lang: "styl" }
  ],
  env: {
    // for client side env
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || "",
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET || ""
  },
  head: {
    title: "96Travel",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "keywords", name: "keywords", content: "96travel, travel, hotel, booking, cheap, tour" }
    ],
    link: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Lato:300,400,500,700|Material+Icons" }

    ]
  },
  loading: "~/components/Loading.vue",
  // loading: {
  //   color: "#00FF00",
  //   height: "5px",
  //   // color: 'linear-gradient(45deg, rgba(255,0,0,1) 0%, rgba(255,255,0,1) 25%, rgba(5,193,255,1) 50%, rgba(255,255,0,1) 75%, rgba(255,0,0,1) 100%)',
  //   continuous: true
  //   // css: false
  // },
  manifest: {
    name: "96Travel",
    description: "Affordable and cheap hotels booking, up to 80% off ! Come Travel provides you with the BEST PRICE and BOOST your whole travel experience.",
    theme_color: "#188269"
  },
  modules: [
    "@nuxtjs/auth",
    "@nuxtjs/axios",
    "@nuxtjs/component-cache",
    "@nuxtjs/font-awesome",
    ["nuxt-i18n", {
      // Options
      vueI18nLoader: false,
      seo: false,
      locales: [
        { code: "en", iso: "en-US", name: "English" },
        { code: "zh", iso: "zh-CN", name: "中文" }
      ],
      defaultLocale: "en",
      // strategy: "prefix_and_default",
      routes: {
        // about: {
        //   zh: "/a-propos",
        //   en: "/about-us"
        // },
        // posts: {
        //   zh: "/articles"
        // }
      },
      vueI18n: {
        fallbackLocale: "en",
        messages: {
          en: {},
          zh: {}
        }
      }
    }]
  ],
  plugins: [
    "~/plugins/filter.js",
    "~/plugins/mixins.js",
    // { src: "~/plugins/vuelidate.js", ssr: true },
    "~/plugins/vuetify.js"
  ],
  render: {
    static: {
      maxAge: "1y",
      setHeaders (res, path) {
        if (path.includes("sw.js")) {
          res.setHeader("Cache-Control", "public, max-age=0")
        }
      }
    }
  },
  router: {
    middleware: ["auth", "locale-redirect"]
  },
  srcDir: path.resolve(__dirname, "src", "client")
}
