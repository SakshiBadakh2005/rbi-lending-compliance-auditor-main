import gplay from 'google-play-scraper'

/**
 * Extract Google Play package ID from a URL or raw ID string.
 * @param {string} urlStr
 * @returns {string|null}
 */
export function extractAppId(urlStr) {
  if (!urlStr) return null
  const match = urlStr.match(/(?:id=)([\w.]+)/) || urlStr.match(/^([\w.]+)$/)
  return match ? match[1] : null
}

/**
 * Map raw Google Play permission items into standard Android permission constants + raw strings.
 * @param {Array} perms - Output from gplay.permissions
 * @returns {string[]}
 */
export function normalizePermissions(perms = []) {
  const set = new Set()

  for (const p of perms) {
    const raw = (p.permission || '').trim()
    const type = (p.type || '').trim()
    const combined = `${raw} ${type}`.toLowerCase()

    if (combined.includes('contact')) set.add('READ_CONTACTS')
    if (combined.includes('call log')) set.add('READ_CALL_LOG')
    if (combined.includes('sms') || combined.includes('text message')) set.add('READ_SMS')
    if (combined.includes('storage') || combined.includes('media') || combined.includes('photo')) set.add('READ_EXTERNAL_STORAGE')
    if (combined.includes('phone status') || combined.includes('identity')) set.add('READ_PHONE_STATE')
    if (combined.includes('camera') || combined.includes('picture') || combined.includes('video')) set.add('CAMERA')
    if (combined.includes('audio') || combined.includes('microphone')) set.add('RECORD_AUDIO')
    if (combined.includes('location')) set.add('ACCESS_FINE_LOCATION')
    if (combined.includes('biometric') || combined.includes('fingerprint')) set.add('USE_BIOMETRIC')

    if (raw) set.add(raw)
  }

  return Array.from(set)
}

/**
 * Clean raw HTML content into plain text.
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html = '') {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Vite dev server middleware for /api/play-store?url=<URL>
 */
export async function playStoreMiddleware(req, res) {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const urlParam = reqUrl.searchParams.get('url')

  const warnings = []
  const appId = extractAppId(urlParam)

  if (!appId) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({
      success: false,
      appId: null,
      permissions: [],
      privacyPolicyUrl: null,
      privacyPolicyText: '',
      warnings: ['Invalid or missing Google Play Store URL / app ID.']
    }))
  }

  try {
    let appDetails = null
    let rawPermissions = []

    try {
      appDetails = await gplay.app({ appId, country: 'in' })
    } catch (err) {
      warnings.push(`App details lookup failed: ${err.message}`)
    }

    try {
      rawPermissions = await gplay.permissions({ appId, country: 'in' })
    } catch (err) {
      warnings.push(`Permissions lookup failed: ${err.message}`)
    }

    const permissions = normalizePermissions(rawPermissions)
    const privacyPolicyUrl = appDetails?.privacyPolicy ?? null
    let privacyPolicyText = ''

    if (privacyPolicyUrl) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const resp = await fetch(privacyPolicyUrl, {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        })
        clearTimeout(timeout)

        if (resp.ok) {
          const html = await resp.text()
          privacyPolicyText = stripHtml(html)
        } else {
          warnings.push(`Privacy policy HTTP fetch status: ${resp.status}`)
        }
      } catch (err) {
        warnings.push(`Privacy policy fetch error: ${err.message}`)
      }
    } else {
      warnings.push('Privacy policy URL not declared on Play Store page.')
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({
      success: true,
      appId,
      permissions,
      privacyPolicyUrl,
      privacyPolicyText,
      warnings
    }))
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({
      success: false,
      appId,
      permissions: [],
      privacyPolicyUrl: null,
      privacyPolicyText: '',
      warnings: [`Internal server error: ${err.message}`]
    }))
  }
}
