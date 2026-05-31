export default async function ({ page, appUrl, screenshot }) {
  await page.goto(new URL("/thoughtleadership", appUrl).toString(), { waitUntil: "networkidle" })
  await page.waitForTimeout(1500)
  return {
    screenshot: await screenshot({ fullPage: false, filename: "tl-page.jpg" }),
  }
}
