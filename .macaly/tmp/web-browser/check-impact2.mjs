export default async function ({ page, appUrl, screenshot }) {
  await page.goto(new URL("/impact", appUrl).toString(), { waitUntil: "networkidle" })
  await page.waitForTimeout(1000)
  const hero = await screenshot({ fullPage: false, filename: "impact-hero.jpg" })
  await page.evaluate(() => window.scrollBy(0, 700))
  await page.waitForTimeout(400)
  const pillars = await screenshot({ fullPage: false, filename: "impact-pillars.jpg" })
  return { hero, pillars }
}
