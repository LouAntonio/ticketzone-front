/**
 * Captura os três estados do envelope. Fica FORA do repo.
 *
 * `serviceWorkers: 'block'` é indispensável: com `VITE_USE_MOCK=true` o MSW
 * arranca um worker que devolve 404 para `/invitations/*` antes de o
 * `ctx.route` ter oportunidade.
 *
 * Uso: node <este-ficheiro> <url-do-vite> <pasta-de-saída>
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.argv[2] ?? 'http://localhost:5199'
const OUT = process.argv[3] ?? 'shots'

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
const problems = []
page.on('pageerror', (e) => problems.push(String(e)))

await page.goto(`${BASE}/convite/demo`, { waitUntil: 'domcontentloaded' })
await page.waitForSelector('.letter', { timeout: 15_000 })
await page.waitForTimeout(1400)

// Estado 1: como a página abre. O envelope vem fechado, com o título na capa.
await page.screenshot({ path: `${OUT}/1-fechado.png` })

// Com o envelope fechado, nada da carta pode estar visível.
//
// Mede pelo `overflow` effective, não pela caixa: `getBoundingClientRect`
// devolve a geometria da carta mesmo quando o `overflow: hidden` do envelope a
// está a cortar, e dava sempre "NAO" num envelope perfeitamente fechado.
const closed = await page.evaluate(() => {
	const env = document.querySelector('.envelope')
	const letter = document.querySelector('.letter')
	if (!env || !letter) return { ok: false, why: 'faltam elementos' }
	const cs = getComputedStyle(env)
	const clipped = cs.overflowY === 'hidden' || cs.overflow === 'hidden'
	// O topo da carta tem de estar alinhado com o do envelope: é isso que a
	// põe dentro da área coberta pela capa.
	const e = env.getBoundingClientRect()
	const l = letter.getBoundingClientRect()
	return {
		ok: clipped && Math.abs(l.top - e.top) <= 2,
		clipped,
		deltaTopo: Math.round(l.top - e.top),
	}
})
console.log(
	`carta escondida quando fechada: ${closed.ok ? 'SIM' : 'NAO'} ${JSON.stringify(closed)}`,
)

// Estado 2: depois de um clique, a carta sobe e mostra o QR.
await page.click('.envelope-wrapper')
await page.waitForTimeout(1400)
await page.screenshot({ path: `${OUT}/2-aberto.png` })

// Estado 3: reabrir, para confirmar que o gesto é reversível.
await page.click('.envelope-wrapper')
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/3-reaberto.png` })

// O QR tem de caber inteiro no ecrã, senão o convidado tem de rolar para o
// usar à porta. Mede `.qr-frame`, não a carta: a carta inclui o nome acima.
const fits = await page.evaluate(() => {
	const qr = document.querySelector('.qr-frame')
	if (!qr) return { ok: false, why: 'sem .qr-frame' }
	const r = qr.getBoundingClientRect()
	return {
		ok: r.top >= 0 && r.bottom <= window.innerHeight && r.width >= 100,
		top: Math.round(r.top),
		bottom: Math.round(r.bottom),
		w: Math.round(r.width),
		vh: window.innerHeight,
	}
})

console.log(`QR no primeiro ecra: ${fits.ok ? 'SIM' : 'NAO'} ${JSON.stringify(fits)}`)
console.log(`erros: ${problems.length ? problems.join(' | ') : 'nenhum'}`)

await browser.close()
