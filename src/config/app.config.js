import ENV from "./env.js"
export const CONFIG = {
  baseURL: ENV === ENV.PROD ? "https://api.site.com" : "http://localhost:3000"
}