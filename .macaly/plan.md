# Bringing All Articles & Case Studies Into the New Design

## Overview
There are ~50 thought leadership articles and 3 case studies currently linking out to the old WordPress site. We'll pull the full content into this site, create individual pages for every article, and build dedicated case study pages.

## What Will Be Built

### 1. Individual Article Pages (`/thoughtleadership/[slug]`)
- One internal page per article (50+ total), styled in the new navy/gold design
- Full article body content fetched from WordPress and stored locally
- Breadcrumb navigation back to the archive
- Author, date, related-article links at the bottom
- The article listing at `/thoughtleadership` will link to these internal pages instead of WordPress

### 2. Case Study Pages (3 pages)
- `/case-studies/siam-computing` — "Strengthening Company Culture Through Inner Development" (Siam Computing × BFP IDG partnership — from the home page hero)
- `/case-studies/omega-hms` — "Human Potential-Based Restructuring" (Omega Healthcare — from the Impact page)
- `/case-studies/thorntons-budgens` — "Unleashing Self-Leadership in a Supermarket" (Thornton's Budgens — from the Impact page)
- Each page includes full story, results/metrics, testimonials, and a CTA

### 3. Update all links
- Home page hero "Read More" → `/case-studies/siam-computing`
- Impact page case study cards → internal case study pages
- Thought leadership listing → internal article pages

## How It Works
A script fetches the full body content from each WordPress URL, cleans it up, and saves it to a local data file. The dynamic route reads from that file — no database needed, instant load times.

## No-Gos
- Will **not** move images away from their WordPress CDN URLs (they load fine externally)
- Will **not** replicate WordPress comments or interactive widgets
- Will **not** create CMS/admin editing for articles (content is static)
