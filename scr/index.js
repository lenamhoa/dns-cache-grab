export default {
  async fetch(request, env) {
    const target = request.url.split("?target=")[1]
    const cacheKey = "IP_" + target

    let cachedIP = await env.KV.get(cacheKey)

    if (!cachedIP) {
      let dnsRes = await fetch(`https://dns.google/resolve?name=${target}&type=A`)
      let json = await dnsRes.json()
      cachedIP = json.Answer[0].data

      await env.KV.put(cacheKey, cachedIP, { expirationTtl: 1800 }) // TTL 30 phút
    }

    return new Response(cachedIP)
  }
}