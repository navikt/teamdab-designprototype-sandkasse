import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "teamdab-designprototype-sandkasse";
const basePath = isGitHubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  // Statisk eksport: bygger appen som ren HTML/JS/CSS uten Node-server.
  // Kan hostes hvor som helst (GitHub Pages, Nais static, S3, osv.).
  output: "export",
  trailingSlash: true,
  // GitHub Pages hoster under /<repo-navn>/ — sett basePath berre ved GitHub Pages-bygg.
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  // Image Optimization-APIet krever en server og støttes ikke ved statisk eksport.
  images: {
    unoptimized: true,
  },
  env: {
    // next/image (i motsetning til next/link) legger ikke automatisk basePath foran `src`.
    // Gjør derfor basePath tilgjengelig i klientkoden via src/lib/basePath.ts.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
