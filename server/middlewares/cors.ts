export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Expose-Headers": "*",
  })
})
