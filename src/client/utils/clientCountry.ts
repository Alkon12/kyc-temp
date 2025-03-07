import requestIp from 'request-ip'
import geoip from 'fast-geoip'

const pickHeader =
  (name: string) =>
  ({ headers }: { headers: any }) =>
    headers[name]

const providers = [
  // Getting from Cloudflare
  // https://support.cloudflare.com/hc/en-us/articles/200168236-What-does-Cloudflare-IP-Geolocation-do-
  pickHeader('cf-ipcountry'),
  // Getting from Vercel
  // https://vercel.com/changelog/ip-geolocation-for-serverless-functions
  pickHeader('x-vercel-ip-country'),
  // Getting from Google App Engine
  // https://cloud.google.com/appengine/docs/standard/java11/reference/request-response-headers
  pickHeader('x-appengine-country'),
]

const fromProvider = (req: { headers: any }) => {
  let provider
  providers.find((fromProvider) => (provider = fromProvider(req)))
  return provider
}

const fromIpAddress = async (req: requestIp.Request) => {
  const ipAddress = requestIp.getClientIp(req)

  if (ipAddress) {
    const geo = await geoip.lookup(ipAddress)
    if (geo) return geo.country
  }
  return null
}

export const getClientCountry = async (req = { headers: {} }) => fromProvider(req) || (await fromIpAddress(req)) || null
