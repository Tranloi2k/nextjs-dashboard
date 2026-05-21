import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

function apiRemotePattern(): RemotePattern[] {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) return [];

  try {
    const { protocol, hostname, port } = new URL(apiUrl);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        ...(port ? { port } : {}),
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      ...apiRemotePattern(),
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
