export default async function ({ page, screenshot }) {
  await page.goto("https://beingatfullpotential.com/our-team/", { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForTimeout(2000)
  
  // Get all links on this page
  const allLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map(a => ({ href: a.href, text: a.textContent.trim() }))
      .filter(l => l.href.includes('beingatfullpotential.com') && !l.href.includes('#') && l.href !== 'https://beingatfullpotential.com/')
      .filter((l, i, arr) => arr.findIndex(x => x.href === l.href) === i)
  })

  const sc = await screenshot({ filename: "team-page.jpg" })
  return { allLinks, url: page.url() }
}
