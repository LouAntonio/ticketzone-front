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
							title: 'T',
							description: 'C',
							bannerUrl: null,
							startDate: '2026-06-14T19:00:00.000Z',
							endDate: '2026-06-15T04:00:00.000Z',
							location: 'L',
							venue: 'V',
							address: 'A',
							province: 'Luanda',
							organizer: 'O',
						},
						guest: { name: 'G', partySize: 2 },
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
await p.goto('http://localhost:5199/convite/demo', { waitUntil: 'domcontentloaded' })
await p.waitForSelector('.letter')
const r = await p.evaluate(() => {
	const l = document.querySelector('.letter')
	const cs = getComputedStyle(l)
	return {
		transform: cs.transform,
		bottom: cs.bottom,
		height: cs.height,
		offsetH: l.offsetHeight,
		scrollH: l.scrollHeight,
		clientH: l.clientHeight,
	}
})
console.log(JSON.stringify(r))
await b.close()
