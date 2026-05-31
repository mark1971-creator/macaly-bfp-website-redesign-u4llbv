"""
Fetches article content from beingatfullpotential.com WordPress site.
Uses lxml with XPath (no cssselect dependency).
"""
import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from lxml import html as lxml_html

# ── All article entries ────────────────────────────────────────────────────────
ARTICLES = [
    {"slug": "humanitys-inner-development", "url": "https://beingatfullpotential.com/humanitys-inner-development/"},
    {"slug": "inner-development-goals-to-measure-or-not-2026", "url": "https://beingatfullpotential.com/inner-development-goals-to-measure-or-not-to-measure/"},
    {"slug": "action-logics-across-generations", "url": "https://beingatfullpotential.com/exploring-action-logics-across-generations-insights-from-the-idg-assessment-data/"},
    {"slug": "idg-b-corp-synergy", "url": "https://beingatfullpotential.com/idg-b-corp-synergy/"},
    {"slug": "redefining-validation", "url": "https://beingatfullpotential.com/redefining-validation-from-psychometrics-to-soul-recognition/"},
    {"slug": "8-characteristics-soulful-organization", "url": "https://beingatfullpotential.com/8-characteristics-of-a-soulful-organization/"},
    {"slug": "berlin-marathon", "url": "https://beingatfullpotential.com/berlin-marathon/"},
    {"slug": "measure-inner-development-goals", "url": "https://beingatfullpotential.com/measure-inner-development-goals/"},
    {"slug": "gap-in-employee-well-being", "url": "https://beingatfullpotential.com/gap-in-employee-well-being/"},
    {"slug": "retrospective-conversations-that-matter", "url": "https://beingatfullpotential.com/retrospective-conversations-that-matter/"},
    {"slug": "evidence-based-strategies", "url": "https://beingatfullpotential.com/evidence-based-strategies/"},
    {"slug": "being-human-at-work", "url": "https://beingatfullpotential.com/being-human-at-work-harnessing-the-power-of-emotions-to-drive-employee-engagement/"},
    {"slug": "roi-of-boosting-employee-engagement", "url": "https://beingatfullpotential.com/the-roi-of-boosting-employee-engagement/"},
    {"slug": "countering-the-threat-of-ai", "url": "https://beingatfullpotential.com/ai-and-being-fully-human/"},
    {"slug": "improving-employee-experience", "url": "https://beingatfullpotential.com/rethinking-employee-experience/"},
    {"slug": "learning-to-listen", "url": "https://beingatfullpotential.com/listening-decentralized-governance/"},
    {"slug": "decentralization-blockchain-human-potential", "url": "https://beingatfullpotential.com/decentralization-human-potential-realization/"},
    {"slug": "6-organizational-performance-metrics", "url": "https://beingatfullpotential.com/6-organizational-performance-metrics/"},
    {"slug": "human-potential-model-validation", "url": "https://beingatfullpotential.com/human-potential-model-validation/"},
    {"slug": "leadership-methods-future-proof", "url": "https://beingatfullpotential.com/leadership-methods-to-future-proof-your-company/"},
    {"slug": "23-ways-to-express-human-potential", "url": "https://beingatfullpotential.com/human-potential-house/"},
    {"slug": "reflections-on-2021", "url": "https://beingatfullpotential.com/reflections-on-2021/"},
    {"slug": "embedding-culture-in-ma", "url": "https://beingatfullpotential.com/embedding-culture-in-ma/"},
    {"slug": "organizational-change-management", "url": "https://beingatfullpotential.com/organizational-change-management/"},
    {"slug": "4-types-of-organizational-change", "url": "https://beingatfullpotential.com/4-types-of-organizational-change/"},
    {"slug": "diversity-equity-inclusion", "url": "https://beingatfullpotential.com/diversity-equity-and-inclusion/"},
    {"slug": "disruptive-innovation", "url": "https://beingatfullpotential.com/disruptive-innovation/"},
    {"slug": "world-is-vuca", "url": "https://beingatfullpotential.com/the-world-is-vuca-do-we-compete-with-it-or-collaborate-with-it/"},
    {"slug": "transformational-leaders-2020", "url": "https://beingatfullpotential.com/transformational-leaders-in-transformational-times-webinar-series-a-harvest-of-deeper-insights/"},
    {"slug": "omega-hms-restructuring-article", "url": "https://beingatfullpotential.com/human-potential-based-restructuring-at-omega-healthcare-management-services-india/"},
    {"slug": "to-re-enter-workforce", "url": "https://beingatfullpotential.com/to-re-enter-or-not-to-re-enter-the-workforce/"},
    {"slug": "business-case-for-being", "url": "https://beingatfullpotential.com/the-business-case-for-being/"},
    {"slug": "impact-at-individual-level-marta", "url": "https://beingatfullpotential.com/human-potential-realization-an-inspiring-story-by-marta-seweryn/"},
    {"slug": "human-potential-methodology-org-transformation", "url": "https://beingatfullpotential.com/human-potential-methodology-for-organizational-transformation/"},
    {"slug": "human-potential-400m-opportunity", "url": "https://beingatfullpotential.com/human-potential-realization-in-organizations-a-400m-opportunity-if-only-we-can-align-what-we-know-with-what-we-do/"},
    {"slug": "human-potential-realization-starts-at-home-2", "url": "https://beingatfullpotential.com/human-potential-realization-starts-at-home-part-2/"},
    {"slug": "human-potential-realization-starts-at-home-1", "url": "https://beingatfullpotential.com/human-potential-realization-starts-at-home/"},
    {"slug": "impact-at-team-level-cto", "url": "https://beingatfullpotential.com/the-day-our-cto-faded-away/"},
    {"slug": "leadership-development-366-billion", "url": "https://beingatfullpotential.com/leadership-development-is-a-366-billion-industry-heres-why-most-programs-dont-work-by-chris-westfall/"},
    {"slug": "back-to-home-base", "url": "https://beingatfullpotential.com/back-to-home-base/"},
    {"slug": "evolving-leadership-consciousness", "url": "https://beingatfullpotential.com/evolving-and-elevating-leadership-consciousness/"},
    {"slug": "employability-future-of-work", "url": "https://beingatfullpotential.com/employabilityandfow/"},
    {"slug": "synchronizing-inner-outer-worlds", "url": "https://beingatfullpotential.com/synchronizing-inner-and-outer-worlds-unleashes-potential/"},
    {"slug": "od-work-in-breakdown", "url": "https://beingatfullpotential.com/od-work-in-breakdown/"},
    {"slug": "accessing-higher-states-of-awareness", "url": "https://beingatfullpotential.com/accessing-higher-states-of-awareness/"},
    {"slug": "conscious-culture-presentation", "url": "https://beingatfullpotential.com/conscious-culture-presentation/"},
    {"slug": "ai-artificial-intelligence-awareness", "url": "https://beingatfullpotential.com/ai-artificial-intelligence-or-awareness-intelligence/"},
    {"slug": "creating-conscious-culture-3", "url": "https://beingatfullpotential.com/creating-conscious-culture-part-3/"},
    {"slug": "creating-conscious-culture-2", "url": "https://beingatfullpotential.com/creating-conscious-culture-part-2/"},
    {"slug": "creating-conscious-culture-1", "url": "https://beingatfullpotential.com/creating-conscious-culture-part-1/"},
    {"slug": "human-potential-realization-igniting-happiness", "url": "https://beingatfullpotential.com/human-potential-realization-igniting-employee-happiness-and-unlocking-business-performance/"},
    {"slug": "shifting-innovation-inside-out", "url": "https://beingatfullpotential.com/shifting-innovation-from-outside-in-to-inside-out-a-coaching-perspective-by-fabio-salvadori/"},
    {"slug": "creating-transformational-spaces", "url": "https://beingatfullpotential.com/creating-transformational-spaces-within-the-business-context-5-lessons/"},
    {"slug": "gift-of-self-compassion", "url": "https://beingatfullpotential.com/the-gift-of-self-compassion-by-mirjana-power/"},
    {"slug": "5-keys-to-google-team", "url": "https://beingatfullpotential.com/5-keys-to-a-successful-google-team/"},
    {"slug": "daring-greatly-in-the-classroom", "url": "https://beingatfullpotential.com/daring-greatly-in-the-classroom/"},
    {"slug": "un-sustainability-of-sustainability-departments", "url": "https://beingatfullpotential.com/the-un-sustainability-of-sustainability-departments-an-invitation-to-redefine-the-role-of-change-agents-and-game-changers-within-organizations-2/"},
    {"slug": "lessons-in-thrive-ability", "url": "https://beingatfullpotential.com/lessons-in-thrive-ability-from-the-french-countryside-2/"},
    {"slug": "from-sustainability-to-thrive-ability-3", "url": "https://beingatfullpotential.com/from-sustainability-to-thrive-ability-part-3-how-to-build-a-thrive-able-organization/"},
]

CASE_STUDIES = [
    {"slug": "siam-computing", "url": "https://beingatfullpotential.com/siam-idg-case-study/"},
    {"slug": "omega-hms", "url": "https://beingatfullpotential.com/human-potential-based-restructuring-at-omega-healthcare-management-services-india/"},
    {"slug": "thorntons-budgens", "url": "https://beingatfullpotential.com/a-compelling-business-case-for-human-potential-realisation/"},
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; BFP-site/1.0)",
    "Accept": "text/html,application/xhtml+xml",
}

SKIP_CLASSES = {'sharedaddy','jp-','wpcnt','social','related','comments','subscribe',
                'newsletter','sidebar','widget','breadcrumb','navigation','nav-',
                'post-navigation','footer','header','menu','advertisement','ad-'}

def has_skip_class(el):
    cls = el.get('class', '') or ''
    return any(s in cls for s in SKIP_CLASSES)

def fetch_url(url, timeout=25):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"  ERROR {url}: {e}", file=sys.stderr)
        return None

def xpath_first(tree, *xpaths):
    for xp in xpaths:
        try:
            els = tree.xpath(xp)
            if els:
                return els[0]
        except Exception:
            pass
    return None

def el_text(el):
    return (el.text_content() or '').strip() if el is not None else ''

def extract_content_el(tree):
    for xp in [
        '//*[contains(@class,"entry-content")]',
        '//*[contains(@class,"post-content")]',
        '//*[contains(@class,"article-content")]',
        '//article',
        '//main',
    ]:
        els = tree.xpath(xp)
        if els:
            return els[0]
    return None

CONTENT_IMG_SKIP = {'wp-post-image', 'avatar', 'emoji', 'logo', 'site-logo'}

def get_img_src(img_el):
    """Get real src from an img element, handling lazy-load attributes."""
    return (img_el.get('src', '') or img_el.get('data-src', '') or
            img_el.get('data-lazy-src', '') or img_el.get('data-lazy', ''))

def is_content_image(img_el):
    """Return True only for images that are actual content (not icons/avatars/logos)."""
    src = get_img_src(img_el)
    if not src:
        return False
    # Must be a real upload (not an emoji, gravatar, etc.)
    if 'wp-content/uploads' not in src:
        return False
    cls = img_el.get('class', '') or ''
    if any(s in cls for s in CONTENT_IMG_SKIP):
        return False
    # Skip tiny icons (width/height attributes hint at size)
    w = img_el.get('width', '')
    h = img_el.get('height', '')
    try:
        if w and int(w) < 80:
            return False
        if h and int(h) < 80:
            return False
    except ValueError:
        pass
    return True

def img_block_from_el(img_el, caption=''):
    """Build an image block dict, stripping WordPress size suffixes for full-size URL."""
    src = get_img_src(img_el)
    # Strip WordPress thumbnail suffix like -300x200.jpg → .jpg
    src_full = re.sub(r'-\d+x\d+(\.[a-zA-Z]+)$', r'\1', src)
    return {'type': 'image', 'src': src_full, 'alt': img_el.get('alt', ''), 'caption': caption}

# Divi module container classes — recurse through these regardless of depth
DIVI_CONTAINERS = {'et_pb_section', 'et_pb_row', 'et_pb_row_inner', 'et_pb_column',
                   'et_pb_column_inner', 'et_pb_module', 'et_pb_module_inner',
                   'et_pb_image_wrap', 'et_pb_text_inner', 'et_pb_blurb_content',
                   'et_pb_with_border'}

def is_divi_container(el):
    cls = el.get('class', '') or ''
    return any(c in cls for c in DIVI_CONTAINERS)

def node_to_block(el):
    """Convert an lxml element to a block dict. Returns None if not interesting."""
    if not isinstance(el.tag, str):
        return None  # processing instructions, comments
    tag = el.tag.lower()
    if has_skip_class(el):
        return None
    text = el_text(el)

    if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
        if not text:
            return None
        return {'type': 'heading', 'level': int(tag[1]), 'text': text}

    elif tag == 'p':
        # Image-only <p> (no visible text) — return None so walker recurses
        # into the <p> children and picks up <img> elements directly
        if len(text) < 3:
            return None
        return {'type': 'paragraph', 'text': text}

    elif tag in ('ul', 'ol'):
        items = [el_text(li) for li in el.xpath('.//li') if el_text(li)]
        if items:
            return {'type': tag, 'items': items}

    elif tag == 'blockquote':
        if not text:
            return None
        return {'type': 'blockquote', 'text': text}

    elif tag == 'figure':
        img = xpath_first(el, './/img')
        if img is not None and is_content_image(img):
            cap_el = xpath_first(el, './/figcaption')
            return img_block_from_el(img, el_text(cap_el))

    elif tag == 'img':
        if is_content_image(el):
            return img_block_from_el(el)

    return None


def extract_blocks(content_el):
    """Walk DOM and collect content blocks. Handles Divi deep nesting."""
    blocks = []
    seen_texts = set()
    seen_srcs = set()

    def walk(el, depth=0):
        # Allow much deeper traversal — Divi nests 6-8 levels deep
        if depth > 15:
            return
        if not isinstance(el.tag, str):
            return
        tag = el.tag.lower()
        if has_skip_class(el):
            return

        block = node_to_block(el)
        if block:
            # Deduplicate by text or image src
            if block['type'] == 'image':
                key = block.get('src', '')
                if key and key not in seen_srcs:
                    seen_srcs.add(key)
                    blocks.append(block)
            else:
                key = block.get('text', '') or str(block.get('items', ''))
                if key and key not in seen_texts:
                    seen_texts.add(key)
                    blocks.append(block)
        else:
            # Recurse into structural containers + Divi modules.
            # Also recurse into <p> so we pick up images inside image-only paragraphs
            # (common WordPress pattern: <p><img .../></p>).
            if tag in ('div', 'section', 'article', 'main', 'aside', 'p') or is_divi_container(el):
                for child in el:
                    walk(child, depth + 1)

    for child in content_el:
        walk(child)

    return blocks


def parse_page(html_str, url):
    tree = lxml_html.fromstring(html_str)
    tree.make_links_absolute(url)

    # Title
    title = ''
    for xp in [
        '//*[contains(@class,"entry-title")]/text()',
        '//h1[@class="post-title"]/text()',
        '//article//h1/text()',
        '//h1/text()',
    ]:
        vals = tree.xpath(xp)
        if vals:
            title = vals[0].strip()
            break
    if not title:
        metas = tree.xpath('//meta[@property="og:title"]/@content')
        title = metas[0].strip() if metas else ''

    # Date
    date = ''
    for xp in ['//time[contains(@class,"entry-date")]/@datetime',
               '//time[contains(@class,"published")]/@datetime',
               '//meta[@property="article:published_time"]/@content']:
        vals = tree.xpath(xp)
        if vals:
            date = vals[0].strip()[:10]
            break

    # Author
    author = 'Mark Vandeneijnde'
    for xp in ['//*[contains(@class,"author")]//a/text()',
               '//*[contains(@class,"entry-author")]/text()',
               '//a[@rel="author"]/text()']:
        vals = tree.xpath(xp)
        if vals and vals[0].strip():
            author = vals[0].strip()
            break

    # Featured image (og:image most reliable)
    image = ''
    metas = tree.xpath('//meta[@property="og:image"]/@content')
    if metas:
        image = metas[0].strip()
    else:
        imgs = tree.xpath('//*[contains(@class,"wp-post-image")]/@src')
        image = imgs[0].strip() if imgs else ''

    # Body
    content_el = extract_content_el(tree)
    blocks = extract_blocks(content_el) if content_el is not None else []

    return {'title': title, 'date': date, 'author': author, 'image': image, 'blocks': blocks}


def process_item(item, item_type):
    slug = item['slug']
    url = item['url']
    print(f"  {item_type}: {slug}")
    html = fetch_url(url)
    if not html:
        return slug, None
    data = parse_page(html, url)
    data.update({'slug': slug, 'sourceUrl': url, 'type': item_type})
    nb = len(data['blocks'])
    imgs = sum(1 for b in data['blocks'] if b['type'] == 'image')
    print(f"    ✓ {nb} blocks ({imgs} images) — \"{data['title'][:50]}\"")
    return slug, data


def main():
    results = {}

    print(f"\nFetching {len(ARTICLES)} articles (6 parallel workers)...")
    with ThreadPoolExecutor(max_workers=6) as ex:
        futs = {ex.submit(process_item, a, 'article'): a for a in ARTICLES}
        for f in as_completed(futs):
            slug, data = f.result()
            if data:
                results[slug] = data

    print(f"\nFetching {len(CASE_STUDIES)} case studies...")
    with ThreadPoolExecutor(max_workers=6) as ex:
        futs = {ex.submit(process_item, cs, 'case-study'): cs for cs in CASE_STUDIES}
        for f in as_completed(futs):
            slug, data = f.result()
            if data:
                results[slug] = data

    out = '/tmp/bfp_content.json'
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    ok = len(results)
    total = len(ARTICLES) + len(CASE_STUDIES)
    print(f"\n✅  {ok}/{total} items → {out}")
    failed = [x['slug'] for x in ARTICLES + CASE_STUDIES if x['slug'] not in results]
    if failed:
        print(f"⚠  Failed slugs: {failed}")


if __name__ == '__main__':
    main()
