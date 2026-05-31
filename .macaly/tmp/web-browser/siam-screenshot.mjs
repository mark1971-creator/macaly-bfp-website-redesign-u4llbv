export default async function ({ page, appUrl, screenshot }) {
  await page.goto(new URL("/case-studies/siam-computing", appUrl).toString(), { waitUntil: "networkidle" })
  await page.waitForTimeout(2000)
  return {
    screenshot: await screenshot({ fullPage: true, filename: "siam2.jpg" }),
  }
}
