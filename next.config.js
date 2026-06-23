const articleRedirects = require("./lib/article-redirects.json");
const articleContent = require("./lib/article-content.json");

const publishedArticleSlugs = new Set(
  Object.entries(articleContent)
    .filter(([, entry]) => entry.type === "article")
    .map(([slug]) => slug)
);

const publishedCaseSlugs = new Set(
  Object.entries(articleContent)
    .filter(([, entry]) => entry.type === "case-study")
    .map(([slug]) => slug)
);

/** Never send live articles/case studies to the home page — overrides stale redirect JSON. */
function activeRedirects() {
  return articleRedirects.filter((redirect) => {
    if (redirect.source === redirect.destination) return false;
    const thoughtMatch = redirect.source.match(/^\/thoughtleadership\/(.+)$/);
    if (thoughtMatch && redirect.destination === "/" && publishedArticleSlugs.has(thoughtMatch[1])) {
      return false;
    }
    const caseMatch = redirect.source.match(/^\/case-studies\/(.+)$/);
    if (caseMatch && redirect.destination === "/" && publishedCaseSlugs.has(caseMatch[1])) {
      return false;
    }
    return true;
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    browserDebugInfoInTerminal: true,
  },
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  devIndicators: false,
  async redirects() {
    return [
      ...activeRedirects(),
      { source: "/contact/", destination: "/#contact", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  allowedDevOrigins: [
    "*.macaly.dev",
    "*.macaly.app",
    "*.macaly-app.com",
    "*.macaly-user-data.dev",
  ],
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        condition: {
          all: [{ not: "foreign" }, "development"],
        },
        loaders: [
          {
            loader: "macaly-tagger",
            options: {
              disableSourceMaps: true,
              ignorePackages: [
                // Skip components imported from these packages (requires macaly-tagger v1.2.0+)
                "@react-three/fiber",
                "@react-three/drei",
              ],
            },
          },
        ],
        as: "*",
      },
    },
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.module.rules.unshift({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "macaly-tagger",
            options: {
              ignorePackages: [
                // Skip components imported from these packages (requires macaly-tagger v1.2.0+)
                "@react-three/fiber",
                "@react-three/drei",
              ],
            },
          },
        ],
        enforce: "pre",
      });
    }

    return config;
  },
};

module.exports = nextConfig;
