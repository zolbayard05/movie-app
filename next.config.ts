import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev үед утас/бусад төхөөрөмжөөс (ижил Wi-Fi) нэвтрэхийг зөвшөөрнө
  allowedDevOrigins: ["192.168.1.6"],
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
