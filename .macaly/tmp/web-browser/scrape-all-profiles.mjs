export default async function ({ page }) {
  const profiles = [
    { name: "Mark Vandeneijnde", url: "https://beingatfullpotential.com/members/snm/profile/" },
    { name: "Ágnes Vad", url: "https://beingatfullpotential.com/members/agnesvad/profile/" },
    { name: "Andrew Thornton", url: "https://beingatfullpotential.com/members/andrewisaacthornton/profile/" },
    { name: "Ann Dinan", url: "https://beingatfullpotential.com/members/anndinan/profile/" },
    { name: "Annelieke Verkerk", url: "https://beingatfullpotential.com/members/anneliekeverkerk/profile/" },
    { name: "Arun Mani", url: "https://beingatfullpotential.com/members/arunm4/profile/" },
    { name: "Ashish Garg", url: "https://beingatfullpotential.com/members/ashishgarg/profile/" },
    { name: "Belinda Hayes", url: "https://beingatfullpotential.com/members/belinda/profile/" },
    { name: "Bram Liebrand", url: "https://beingatfullpotential.com/members/b-liebrandchello-nl/profile/" },
    { name: "Chad Verigin", url: "https://beingatfullpotential.com/members/chadv/profile/" },
  ]

  function extractField(text, fieldName) {
    const regex = new RegExp(fieldName + '\\s*\\n+([\\s\\S]*?)(?=\\n\\n|What |Who |My |Life |Geographic|Anything|In what|$)', 'i')
    const match = text.match(regex)
    return match ? match[1].trim().replace(/\n+/g, ' ').substring(0, 500) : ''
  }

  const results = []
  
  for (const p of profiles) {
    try {
      await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 20000 })
      await page.waitForTimeout(2500)
      
      const data = await page.evaluate(() => {
        // Extract all profile field rows
        const rows = document.querySelectorAll('.profile-field-view, .bp-widget-box, tr, .bp-field-wrap, .editfield')
        const fields = {}
        
        // Try table-based structure
        document.querySelectorAll('table tr, .profile-fields tr').forEach(row => {
          const cells = row.querySelectorAll('td, th')
          if (cells.length >= 2) {
            const key = cells[0].innerText.trim()
            const val = cells[1].innerText.trim()
            if (key && val) fields[key] = val
          }
        })
        
        // Try definition list structure
        document.querySelectorAll('dt, dd').forEach((el, i, arr) => {
          if (el.tagName === 'DT' && arr[i+1] && arr[i+1].tagName === 'DD') {
            fields[el.innerText.trim()] = arr[i+1].innerText.trim()
          }
        })
        
        // Raw text as fallback
        const rawText = document.body.innerText.substring(0, 5000)
        
        return { fields, rawText }
      })
      
      results.push({ name: p.name, url: p.url, ...data })
    } catch (e) {
      results.push({ name: p.name, url: p.url, error: e.message })
    }
  }
  
  return results
}
