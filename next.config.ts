import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.17"],
  experimental: {
    agentUpgrade: false,
  },
}

export default nextConfig
