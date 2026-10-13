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
							description: 'C',
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
await p.goto('http://localhost:5199/convite/demo', { waitUntil: 'domcontentloaded' })
await p.waitForSelector('.envelope')
const r = await p.evaluate(() => {
	const env = document.querySelector('.envelope').getBoundingClientRect()
	const heart = document.querySelector('.heart').getBoundingClientRect()
	return {
		envCx: Math.round(env.left + env.width / 2),
		envW: Math.round(env.width),
		heartCx: Math.round(heart.left + heart.width / 2),
		heartW: Math.round(heart.width),
		delta: Math.round(heart.left + heart.width / 2 - (env.left + env.width / 2)),
	}
})
console.log(JSON.stringify(r))
await b.close()
