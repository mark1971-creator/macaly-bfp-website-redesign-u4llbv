export default async function ({ page, screenshot }) {
  const profiles = [
    { name: "Mark Vandeneijnde", url: "https://beingatfullpotential.com/members/snm/profile/" },
    { name: "Annelieke Verkerk", url: "https://beingatfullpotential.com/members/anneliekeverkerk/profile" },
    { name: "Shraddha Patel", url: "https://beingatfullpotential.com/members/shraddhapatel/" },
  ]
  
  const results = []
  
  for (const p of profiles) {
    await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 20000 })
    await page.waitForTimeout(1500)
    
    const content = await page.evaluate(() => {
      // Get all text content in main/article areas
      const body = document.body.innerText
      return body.substring(0, 3000)
    })
    
    const sc = await screenshot({ filename: `${p.name.split(' ')[0].toLowerCase()}.jpg` })
    results.push({ name: p.name, url: page.url(), content })
  }
  
  return results
}
