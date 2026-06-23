const slugs = [
  "improving-employee-experience-through-workplace-mark-vandeneijnde",
  "human-potential-realization-organizations-400m-only-vandeneijnde",
];

for (const slug of slugs) {
  const res = await fetch(`https://www.linkedin.com/pulse/${slug}/`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const html = await res.text();
  console.log(`\n=== ${slug} ===`);
  const patterns = [
    /data-delayed-url="([^"]+)"/g,
    /data-src="(https:\/\/media\.licdn\.com[^"]+)"/g,
    /background-image:url\((https:\/\/media\.licdn\.com[^)]+)\)/g,
  ];
  for (const re of patterns) {
    const m = [...html.matchAll(re)];
    if (m.length) {
      console.log(re.source, m.length);
      m.slice(0, 5).forEach((x) => console.log(" ", x[1].slice(0, 100)));
    }
  }
  // search for article-inline or figure
  if (html.includes("article-inline")) console.log("has article-inline");
  const inline = html.match(/article-inline[^]{0,500}/);
  if (inline) console.log(inline[0].slice(0, 300));
}
