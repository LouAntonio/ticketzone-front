/**
 * Captura a página de convite sem backend. Fica FORA do repo de propósito:
 * a versão anterior estava versionada e era lixo.
 *
 * `serviceWorkers: 'block'` é indispensável. Com `VITE_USE_MOCK=true` o MSW
 * arranca um service worker que intercepta `/invitations/*` (via
 * `onUnhandledRequest: 'bypass'`) e devolve 404 antes de qualquer
 * `ctx.route` ter oportunidade. Sem isto a página nunca chega a renderizar.
 *
 * Uso:  node <este-ficheiro> <url-do-vite> <pasta-de-saída>
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.argv[2] ?? 'http://localhost:5199'
const OUT = process.argv[3] ?? 'shots'

/** Payload com a mesma forma do `getInvitation` do backend. */
const INVITATION = {
	event: {
		title: 'Casamento de Ana e Mbala',
		description: 'Convite',
		bannerUrl: null,
		startDate: '2026-06-14T19:00:00.000Z',
		endDate: '2026-06-15T04:00:00.000Z',
		location: 'Luanda',
		venue: 'Igreja de São José',
		address: 'Ilha do Kianga',
		province: 'Luanda',
		organizer: 'Ana e Mbala',
	},
	guest: { name: 'Ana e Mbala', partySize: 2 },
	ticket: {
		status: 'ACTIVE',
		entriesUsed: 0,
		entriesAllowed: 2,
		qrSecret: '9f2c1d84-7a3e-4b16-9c0d-e5a71f3b8d42',
		qrExpiresAt: new Date(Date.now() + 60_000).toISOString(),
	},
}

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const ctx = await browser.newContext({
	viewport: { width: 420, height: 880 },
	deviceScaleFactor: 2,
	serviceWorkers: 'block',
})

await ctx.route('**/*', (route) => {
	if (route.request().url().includes('/invitations/')) {
		return route.fulfill({
			status: 200,
			contentType: 'application/json',
			headers: { 'Access-Control-Allow-Origin': '*' },
			body: JSON.stringify({ success: true, data: INVITATION }),
		})
	}
	return route.continue()
})

const page = await ctx.newPage()

// Sem erros de consola: um aviso de React que ninguém lê é um bug à espera.
const problems = []
page.on('console', (m) => {
	if (m.type() === 'error') problems.push(m.text())
})
page.on('pageerror', (e) => problems.push(String(e)))

await page.goto(`${BASE}/convite/demo`, { waitUntil: 'networkidle' })
await page.waitForSelector('.inv-ticket', { timeout: 15_000 })
await page.waitForTimeout(700)

// Posição do QR NO PRIMEIRO ECRÃ, antes de qualquer scroll. Medir depois de
// `scrollTo` dava sempre um resultado que não é o que o convidado vê ao abrir.
const firstScreen = await page.evaluate(() => {
	const qr = document.querySelector('.inv-qr')
	if (!qr) return { ok: false, why: 'sem .inv-qr' }
	const r = qr.getBoundingClientRect()
	return {
		ok: r.top >= 0 && r.bottom <= window.innerHeight,
		top: Math.round(r.top),
		bottom: Math.round(r.bottom),
		vh: window.innerHeight,
	}
})
console.log(`\nQR no primeiro ecra: ${firstScreen.ok ? 'SIM' : 'NAO'}`, JSON.stringify(firstScreen))

const height = await page.evaluate(() => document.documentElement.scrollHeight)
const stops = [
	{ name: '1-acto1', y: 0 },
	{ name: '2-a-meia-abertura', y: Math.round(height * 0.42) },
	{ name: '3-cartao-aberta', y: height },
]

for (const s of stops) {
	await page.evaluate((y) => window.scrollTo(0, y), s.y)
	await page.waitForTimeout(500)
	await page.screenshot({ path: `${OUT}/${s.name}.png` })
	console.log(`  ${s.name}  scrollY=${s.y}`)
}

console.log(`altura da página: ${height}px`)
console.log(`erros de consola: ${problems.length ? problems.join(' | ') : 'nenhum'}`)

await browser.close()
