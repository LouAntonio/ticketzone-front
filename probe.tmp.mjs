import { chromium } from 'playwright'
const b = await chromium.launch({ channel: 'chrome' })
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, serviceWorkers: 'block' })
await ctx.route('**/*', (r) =>
	r.request().url().includes('/invitations/')
		? r.fulfill({
				status: 200,
				contentType: 'application/json',
				headers: { 'Access-Control-Allow-Origin': '*' },
				body: JSON.stringify({
					success: true,
					data: {
						event: {
							title: 'Casamento de Ana e Mbala',
							description: 'Convite',
							bannerUrl: null,
							startDate: '2026-06-14T19:00:00.000Z',
							endDate: '2026-06-15T04:00:00.000Z',
							location: 'Luanda',
							venue: 'Igreja de Sao Jose',
							address: 'Ilha do Kianga',
							province: 'Luanda',
							organizer: 'Ana e Mbala',
						},
						guest: { name: 'Ana e Mbala', partySize: 2 },
						ticket: {
							status: 'ACTIVE',
							entriesUsed: 0,
							entriesAllowed: 2,
							qrSecret: 'x',
							qrExpiresAt: new Date(Date.now() + 60000).toISOString(),
						},
					},
				}),
			})
		: r.continue(),
)
const p = await ctx.newPage()
await p.goto('http://localhost:5199/convite/demo', { waitUntil: 'networkidle' })
await p.waitForSelector('.inv-qr')
const r = await p.evaluate(() => {
	const sel = [
		'.inv-face--front',
		'.inv-face--back',
		'.inv-meta',
		'.inv-ticket',
		'.inv-foot',
		'.inv-qr',
	]
	const out = {}
	for (const s of sel) {
		const e = document.querySelector(s)
		if (e) {
			const b = e.getBoundingClientRect()
			out[s] = `top=${Math.round(b.top)} h=${Math.round(b.height)}`
		}
	}
	out._pad = getComputedStyle(document.querySelector('.inv-face--back')).padding
	out._mt = getComputedStyle(document.querySelector('.inv-ticket')).marginTop
	return out
})
console.log(JSON.stringify(r, null, 1))
await b.close()
