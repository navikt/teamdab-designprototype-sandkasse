import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "teamdab-designprototype-sandkasse";

const nextConfig: NextConfig = {
  // Statisk eksport: bygger appen som ren HTML/JS/CSS uten Node-server.
  // Kan hostes hvor som helst (GitHub Pages, Nais static, S3, osv.).
  output: "export",
  // GitHub Pages hoster under /<repo-navn>/ — sett basePath kun i prod.
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  // Image Optimization-APIet krever en server og støttes ikke ved statisk eksport.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
