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
await p.waitForSelector('.envelope')
const css = await p.evaluate(() => {
	const root = getComputedStyle(document.documentElement)
	return {
		envW: root.getPropertyValue('--env-w').trim(),
		envH: root.getPropertyValue('--env-h').trim(),
		letterH: root.getPropertyValue('--letter-h').trim(),
		pad: getComputedStyle(document.querySelector('.invitation')).paddingTop,
	}
})
console.log(JSON.stringify(css))
await p.click('.envelope-wrapper')
await p.waitForTimeout(1400)
const geo = await p.evaluate(() => {
	const l = document.querySelector('.letter').getBoundingClientRect()
	const first = document.querySelector('.letter strong').getBoundingClientRect()
	return {
		letterTop: Math.round(l.top),
		letterBottom: Math.round(l.bottom),
		nameTop: Math.round(first.top),
		scrollable:
			document.querySelector('.letter').scrollHeight >
			document.querySelector('.letter').clientHeight,
		scrollH: document.querySelector('.letter').scrollHeight,
		clientH: document.querySelector('.letter').clientHeight,
	}
})
console.log(JSON.stringify(geo))
await b.close()
