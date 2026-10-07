import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WordPress URLs end in "/" (e.g. /contact/); keep them identical.
  trailingSlash: true,
};

export default nextConfig;
