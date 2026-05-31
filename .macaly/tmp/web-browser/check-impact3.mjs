export default async function ({ page, appUrl, screenshot }) {
  await page.goto(new URL("/impact", appUrl).toString(), { waitUntil: "networkidle" })
  // scroll to Who We Serve / Education card
  await page.evaluate(() => window.scrollBy(0, 650))
  await page.waitForTimeout(600)
  const pillars = await screenshot({ fullPage: false, filename: "impact-edu.jpg" })
  // scroll to Trusted By
  await page.evaluate(() => window.scrollBy(0, 700))
  await page.waitForTimeout(800)
  const trusted = await screenshot({ fullPage: false, filename: "impact-trusted.jpg" })
  return { pillars, trusted }
}
