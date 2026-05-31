export default async function ({ page, screenshot }) {
  await page.goto("https://beingatfullpotential.com/members/snm/profile/", { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForTimeout(3000)
  
  const content = await page.evaluate(() => document.body.innerText.substring(0, 4000))
  const sc = await screenshot({ filename: "mark-profile.jpg", fullPage: true })
  return { url: page.url(), content, sc }
}
