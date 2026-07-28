import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statisk eksport: bygger appen som ren HTML/JS/CSS uten Node-server.
  // Kan hostes hvor som helst (GitHub Pages, Nais static, S3, osv.).
  output: "export",
  // Image Optimization-APIet krever en server og støttes ikke ved statisk eksport.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
