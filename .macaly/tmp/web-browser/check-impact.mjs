export default async function ({ page, appUrl, screenshot }) {
  await page.goto(new URL("/impact", appUrl).toString(), { waitUntil: "networkidle" })
  await page.waitForTimeout(1000)
  return { screenshot: await screenshot({ fullPage: false, filename: "impact.jpg" }) }
}
