import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Next.js 16 blocks cross-origin requests to dev-only resources (HMR socket,
  // dev assets) by default. When the dev server is opened via the machine's LAN
  // address instead of localhost, the browser's Origin no longer matches the
  // allowed host, so /_next/hmr is rejected. That stops the client bundle from
  // hydrating, which in turn leaves the intro PageLoader overlay stuck forever.
  // Dev-only setting; it has no effect on production builds.
  allowedDevOrigins: ["192.168.1.17"],
}

export default nextConfig
