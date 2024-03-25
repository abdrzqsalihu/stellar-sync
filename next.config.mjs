/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "firebasestorage.googleapis.com",
        // Optionally, specify a path for a directory within the domain:
        // path: "/path/to/images",
      },
    ],
  },
};

export default nextConfig;
