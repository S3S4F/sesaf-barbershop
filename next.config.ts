import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // Uncomment for Docker only
  reactCompiler: true,
};

export default nextConfig;
