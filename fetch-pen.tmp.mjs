import { chromium } from 'playwright'
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage()
await p.goto('https://codepen.io/smhmyhead/pen/pomPGXj', {
	waitUntil: 'domcontentloaded',
	timeout: 45000,
})
await p.waitForTimeout(4000)
const t = await p.title()
const txt = await p.evaluate(() => document.body.innerText.slice(0, 600))
console.log('TITLE:', t)
console.log('---')
console.log(txt)
await b.close()
