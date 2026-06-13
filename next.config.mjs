/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["172.30.1.25"],
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
