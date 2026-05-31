export default async function ({ page, screenshot }) {
  // Try to find the coaches page and individual profiles
  await page.goto("https://beingatfullpotential.com/about-whoweare/", { waitUntil: "domcontentloaded", timeout: 30000 })
  
  // Find links that look like coach profiles
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="coach"], a[href*="team"], a[href*="member"]'))
      .map(a => ({ href: a.href, text: a.textContent.trim() }))
      .filter(l => l.href.includes('beingatfullpotential.com'))
      .slice(0, 10)
  })
  
  // Also try getting all internal links to find coach profiles
  const allLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map(a => ({ href: a.href, text: a.textContent.trim() }))
      .filter(l => l.href.includes('beingatfullpotential.com') && !l.href.includes('#'))
      .slice(0, 30)
  })

  const sc = await screenshot({ filename: "about-page.jpg" })
  return { links, allLinks, sc, url: page.url() }
}
