import requests
from bs4 import BeautifulSoup
import json
import time

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.9',
})
# Warm up
session.get('https://beingatfullpotential.com/', timeout=15)
time.sleep(1)

profiles = [
    {"name": "Mark Vandeneijnde", "url": "https://beingatfullpotential.com/members/snm/profile/"},
    {"name": "Ágnes Vad", "url": "https://beingatfullpotential.com/members/agnesvad/profile/"},
    {"name": "Andrew Thornton", "url": "https://beingatfullpotential.com/members/andrewisaacthornton/profile/"},
    {"name": "Ann Dinan", "url": "https://beingatfullpotential.com/members/anndinan/profile/"},
    {"name": "Annelieke Verkerk", "url": "https://beingatfullpotential.com/members/anneliekeverkerk/profile/"},
    {"name": "Amrita Singh", "url": "https://beingatfullpotential.com/members/amritasingh/profile/"},
    {"name": "Arun Mani", "url": "https://beingatfullpotential.com/members/arunm4/profile/"},
    {"name": "Ashish Garg", "url": "https://beingatfullpotential.com/members/ashishgarg/profile/"},
    {"name": "Belinda Hayes", "url": "https://beingatfullpotential.com/members/belinda/profile/"},
    {"name": "Bram Liebrand", "url": "https://beingatfullpotential.com/members/b-liebrandchello-nl/profile/"},
    {"name": "Chad Verigin", "url": "https://beingatfullpotential.com/members/chadv/profile/"},
    {"name": "Claudia Milardo", "url": "https://beingatfullpotential.com/members/claudia/profile/"},
    {"name": "Clay Blacker", "url": "https://beingatfullpotential.com/members/clayblacker/profile/"},
    {"name": "Daniel-Yehuda Frohwein", "url": "https://beingatfullpotential.com/members/danielfrohwein/profile/"},
    {"name": "Diyanat Ali", "url": "https://beingatfullpotential.com/members/diyanat/profile/"},
    {"name": "Esther Lewenstein", "url": "https://beingatfullpotential.com/members/estherlewenstein/profile/"},
    {"name": "Eveline van Dusseldorp", "url": "https://beingatfullpotential.com/members/evelinevandusseldorp/profile/"},
    {"name": "Fabio Salvadori", "url": "https://beingatfullpotential.com/members/nemokid/profile/"},
    {"name": "Fabiola Benavente", "url": "https://beingatfullpotential.com/members/fabiola/profile/"},
    {"name": "Faris Khalifeh", "url": "https://beingatfullpotential.com/members/fariskhalifeh/profile/"},
    {"name": "Gabriela Carrique", "url": "https://beingatfullpotential.com/members/gabrielacarrique/profile/"},
    {"name": "Hans Neff", "url": "https://beingatfullpotential.com/members/hansneff/profile/"},
    {"name": "Hanumant Talwar", "url": "https://beingatfullpotential.com/members/talwarh/profile/"},
    {"name": "Harmen van Dijk", "url": "https://beingatfullpotential.com/members/harmenvandijk/profile/"},
    {"name": "Harrison Lennox-Wright", "url": "https://beingatfullpotential.com/members/lennoxwright/profile/"},
    {"name": "Helena Roth", "url": "https://beingatfullpotential.com/members/helenaroth/profile/"},
    {"name": "Jahnavi Katti", "url": "https://beingatfullpotential.com/members/jahnavikatti/profile/"},
    {"name": "Jannie Peters", "url": "https://beingatfullpotential.com/members/janniepeters/profile/"},
    {"name": "Jeroen Loosli", "url": "https://beingatfullpotential.com/members/jeroenloosli/profile/"},
    {"name": "Jonathan Nungaray", "url": "https://beingatfullpotential.com/members/jonathannungaray/profile/"},
    {"name": "Juan Araque Melgar", "url": "https://beingatfullpotential.com/members/jaraque67/profile/"},
    {"name": "K S Saravanavasan", "url": "https://beingatfullpotential.com/members/kssaravanavasan/profile/"},
    {"name": "Kannan Swaminathan", "url": "https://beingatfullpotential.com/members/skcan18/profile/"},
    {"name": "Kiran Gulrajani", "url": "https://beingatfullpotential.com/members/kiran/profile/"},
    {"name": "Luca Salvini", "url": "https://beingatfullpotential.com/members/lucasalvini/profile/"},
    {"name": "Manuel Lopez", "url": "https://beingatfullpotential.com/members/manu/profile/"},
    {"name": "Maria Elena Rosado Patron", "url": "https://beingatfullpotential.com/members/malena/profile/"},
    {"name": "Marie Josee Smulders", "url": "https://beingatfullpotential.com/members/mariejosee/profile/"},
    {"name": "Mark Anthony DeSanti", "url": "https://beingatfullpotential.com/members/markdee/profile/"},
    {"name": "Max Riley", "url": "https://beingatfullpotential.com/members/drmaxr/profile/"},
    {"name": "Mayke Vullings", "url": "https://beingatfullpotential.com/members/maykev/profile/"},
    {"name": "Michael J. Dawkins", "url": "https://beingatfullpotential.com/members/michaelj-dawkins/profile/"},
    {"name": "Michiel Schuurman", "url": "https://beingatfullpotential.com/members/mcschuurman/profile/"},
    {"name": "Nadene Canning", "url": "https://beingatfullpotential.com/members/nadene/profile/"},
    {"name": "Nathalie Bayol", "url": "https://beingatfullpotential.com/members/nathalie/profile/"},
    {"name": "Nidhi Arora", "url": "https://beingatfullpotential.com/members/nidhiarora/profile/"},
    {"name": "Peter Leong", "url": "https://beingatfullpotential.com/members/peterleong/profile/"},
    {"name": "Priyanka Deshmukh", "url": "https://beingatfullpotential.com/members/priyankadeshmukh/profile/"},
    {"name": "Rob Govers", "url": "https://beingatfullpotential.com/members/robgovers/profile/"},
    {"name": "Rodrigo Martinez-Romero", "url": "https://beingatfullpotential.com/members/martinez/profile/"},
    {"name": "Sally Edwards", "url": "https://beingatfullpotential.com/members/sallyedwards/profile/"},
    {"name": "Shraddha Patel", "url": "https://beingatfullpotential.com/members/shraddhapatel/profile/"},
    {"name": "Smruti Patel", "url": "https://beingatfullpotential.com/members/smruti/profile/"},
    {"name": "Vanessa Jane Smith", "url": "https://beingatfullpotential.com/members/vanessa/profile/"},
    {"name": "Wiebe Zevenbergen", "url": "https://beingatfullpotential.com/members/wiebezevenbergen/profile/"},
    {"name": "Yakira Flores", "url": "https://beingatfullpotential.com/members/yakiflores/profile/"},
]

def parse_profile(html):
    soup = BeautifulSoup(html, 'lxml')
    bp = soup.find(id='buddypress')
    fields = {}
    if not bp:
        return fields
    # Fields are in table.profile-fields inside div.bp-widget
    table = bp.find('table', class_='profile-fields')
    if not table:
        return fields
    for row in table.find_all('tr'):
        label_td = row.find('td', class_='label')
        data_td = row.find('td', class_='data')
        if label_td and data_td:
            key = label_td.get_text(strip=True)
            val = data_td.get_text(separator='\n', strip=True)
            if key and val:
                fields[key] = val
    return fields

results = []
for i, p in enumerate(profiles):
    try:
        r = session.get(p['url'], timeout=15, allow_redirects=True)
        if r.status_code == 429:
            print(f"⚠ Rate limited on {p['name']}, waiting 15s...")
            time.sleep(15)
            r = session.get(p['url'], timeout=15)
        
        if r.status_code == 200:
            fields = parse_profile(r.text)
            results.append({"name": p['name'], "profileUrl": p['url'], "fields": fields})
            print(f"✓ {p['name']} ({len(fields)} fields)")
        else:
            results.append({"name": p['name'], "profileUrl": p['url'], "fields": {}, "error": f"HTTP {r.status_code}"})
            print(f"✗ {p['name']}: HTTP {r.status_code}")
    except Exception as e:
        results.append({"name": p['name'], "profileUrl": p['url'], "fields": {}, "error": str(e)})
        print(f"✗ {p['name']}: {e}")
    
    time.sleep(1.2)  # polite delay

with open('/tmp/coach_profiles.json', 'w') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

success_count = len([r for r in results if r['fields']])
print(f"\n✅ Done! {success_count}/{len(profiles)} profiles scraped successfully")
